/* Motion layer for the Termux Launcher site. Runs as a classic deferred script
   after app.js. Binds only to the selectors named in DESIGN.md and no-ops when
   an element is missing, because the DOM/CSS ship from a separate change.
   Scroll-linked work uses ScrollTrigger and IntersectionObserver only. */
(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  var reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
  var desktopMQ = window.matchMedia("(min-width: 900px)");
  var hoverMQ = window.matchMedia("(hover: hover)");

  var state = {
    booted: false,
    dead: false,
    motion: false,        // gsap + ScrollTrigger present and reduced motion off
    pendingView: null,    // a tl:viewchange that arrived before boot
    io: null,
    observed: null,       // WeakSet of elements handed to the observer
    mo: null,
    entry: null,          // hero entry timeline
    story: null,          // { triggers, cleanup } for the spine choreography
    storyWanted: false,   // setup view seen but story could not measure yet
    tilt: [],             // [{ el, off }]
    resizeTimer: 0,
    indicatorPos: null    // WeakMap indicator -> last written size+transform key
  };

  function q(sel, scope) { return (scope || doc).querySelector(sel); }
  function qa(sel, scope) { return Array.prototype.slice.call((scope || doc).querySelectorAll(sel)); }
  function noop() {}

  // display:none anywhere up the tree yields no client rects.
  function isRendered(el) { return !!el && el.getClientRects().length > 0; }

  function hasGsap() { return !!(window.gsap && window.ScrollTrigger); }

  function navHeight() {
    var v = parseFloat(getComputedStyle(root).getPropertyValue("--nav-h"));
    return isNaN(v) ? 64 : v;
  }

  /* ------------------------------------------------------------------ */
  /* Bootstrap                                                            */
  /* ------------------------------------------------------------------ */

  // Registered at evaluation time so a tl:viewchange dispatched before our
  // DOMContentLoaded handler ran is not lost.
  doc.addEventListener("tl:viewchange", function (event) {
    var detail = (event && event.detail) || {};
    if (!state.booted) { state.pendingView = detail; return; }
    onViewChange(detail);
  });

  function boot() {
    if (state.booted) return;
    state.booted = true;
    root.classList.add("is-loaded");

    if (!hasGsap()) console.warn("motion.js: GSAP or ScrollTrigger missing, running without scroll motion");

    setupReveals();
    setupIndicators();
    enableMotion();

    onMediaChange(reduceMQ, onReduceChange);
    onMediaChange(desktopMQ, onDesktopChange);
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("load", function () { refresh(); }, { once: true });
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { refresh(); }, noop);
    doc.addEventListener("click", onDocClick, true);

    if (state.pendingView) {
      var pending = state.pendingView;
      state.pendingView = null;
      onViewChange(pending);
    } else if (setupViewVisibleNow()) {
      // app.js has not switched views yet; the markup shows About by default
      // unless the hash routes elsewhere, in which case app.js will hide it.
      initAbout();
    }
  }

  function onMediaChange(mq, handler) {
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else if (mq.addListener) mq.addListener(handler);
  }

  function setupViewVisibleNow() {
    var hash = window.location.hash || "";
    if (/^#(wiki|ai)\b/.test(hash)) return false;
    return isRendered(q('[data-view="setup"]'));
  }

  function enableMotion() {
    if (state.dead || state.motion) return;
    if (!hasGsap() || reduceMQ.matches) return;
    window.gsap.registerPlugin(window.ScrollTrigger);
    state.motion = true;
    root.classList.add("has-motion");
    bindTilt();
  }

  // Kills every tween and trigger this file made and clears the inline
  // styles they left, so the CSS fallback layout takes over cleanly.
  function disableMotion() {
    if (!state.motion) return;
    killStory();
    killEntry();
    unbindTilt();
    if (window.ScrollTrigger) window.ScrollTrigger.getAll().forEach(function (t) { t.kill(true); });
    state.motion = false;
    state.storyWanted = false;
    root.classList.remove("has-motion");
  }

  function onReduceChange() {
    if (reduceMQ.matches) disableMotion();
    else { enableMotion(); if (setupViewVisibleNow()) initAbout(); }
  }

  function onDesktopChange() {
    if (!state.motion) return;
    if (desktopMQ.matches) { if (isRendered(q("[data-hero]"))) buildStory(); }
    else killStory();
  }

  function onResize() {
    window.clearTimeout(state.resizeTimer);
    state.resizeTimer = window.setTimeout(function () { refresh(); }, 150);
  }

  function onViewChange(detail) {
    if (state.dead) return;
    afterPaint(function () {
      scanReveals();
      placeIndicators();
      if (detail && detail.view === "setup") initAbout();
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    });
  }

  // Two frames: setView toggles display and scrolls to 0; measurements are
  // only right once that layout has painted.
  function afterPaint(fn) {
    window.requestAnimationFrame(function () { window.requestAnimationFrame(fn); });
  }

  function refresh() {
    if (state.dead) return;
    scanReveals();
    placeIndicators();
    if (state.motion && state.storyWanted && !state.story) initAbout();
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }

  function teardown() {
    disableMotion();
    if (state.io) state.io.disconnect();
    if (state.mo) state.mo.disconnect();
    state.dead = true;
  }

  /* ------------------------------------------------------------------ */
  /* About view: hero entry, then the spine choreography                  */
  /* ------------------------------------------------------------------ */

  // Lazy: the About sections only measure correctly while their view is
  // displayed, so this waits for the first time that is true.
  function initAbout() {
    if (!state.motion) return;
    var hero = q("[data-hero]");
    if (!isRendered(hero)) { state.storyWanted = true; return; }
    state.storyWanted = false;
    if (!state.entry) playEntry(hero);
    else if (!state.story && !state.entry.isActive()) buildStory();
  }

  // GSAP reads the rest rotation from computed style; find which element the
  // CSS rotates so the 8deg to 6deg tween lands on the real rest pose.
  function rotatedElement(phone) {
    var frame = q(".phone-frame", phone);
    var candidates = [phone, frame].filter(Boolean);
    for (var i = 0; i < candidates.length; i += 1) {
      if (Math.abs(rotationOf(candidates[i])) > 0.5) return candidates[i];
    }
    return phone;
  }

  function rotationOf(el) {
    var t = getComputedStyle(el).transform;
    var m = /matrix\(([^)]+)\)/.exec(t || "");
    if (!m) return 0;
    var parts = m[1].split(",").map(parseFloat);
    return Math.atan2(parts[1], parts[0]) * 180 / Math.PI;
  }

  function playEntry(hero) {
    var gsap = window.gsap;
    var eyebrow = q(".hero-eyebrow", hero);
    var cta = q(".hero-cta", hero);
    var strip = q(".hero-strip", hero);
    var phone = q("[data-phone]", hero);
    var tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: function () { if (state.motion && !state.story) buildStory(); }
    });
    // fromTo everywhere: if the CSS parks these at opacity 0 under
    // html.has-motion, a plain from() would tween to that hidden value.
    if (eyebrow) tl.fromTo(eyebrow, { opacity: 0, y: 16, filter: "blur(6px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, clearProps: "filter" }, 0.08);
    if (cta) tl.fromTo(cta, { opacity: 0, y: 16, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.55 }, 0.42);
    if (strip) tl.fromTo(strip, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.55 }, 0.5);
    if (phone) {
      var spin = rotatedElement(phone);
      tl.fromTo(phone, { opacity: 0, y: window.innerHeight * 0.22 }, { opacity: 1, y: 0, duration: 0.78 }, 0.12);
      tl.fromTo(spin, { rotation: 8 }, { rotation: 6, duration: 0.78 }, 0.12);
    }
    state.entry = tl;
  }

  function killEntry() {
    if (!state.entry) return;
    var tl = state.entry;
    state.entry = null;
    var targets = [];
    tl.getChildren().forEach(function (t) { targets = targets.concat(t.targets()); });
    tl.kill();
    if (targets.length) window.gsap.set(targets, { clearProps: "transform,opacity,filter" });
  }

  // Pin choice: the phone is pinned (position: fixed by ScrollTrigger) from the
  // top of the page and moved with a transform computed straight from scroll
  // position. While the slot is stuck both are viewport-fixed, so the phone
  // sits on the slot with zero lag; a transform-only phone would trail the
  // sticky slot by a frame on threaded scrolling.
  function buildStory() {
    if (!state.motion || state.story || !desktopMQ.matches) return;
    var gsap = window.gsap;
    var ST = window.ScrollTrigger;
    var hero = q("[data-hero]");
    var phone = q("[data-phone]");
    var slot = q("[data-phone-slot]");
    var spine = q("[data-spine]");
    if (!hero || !phone || !slot || !spine || !isRendered(hero)) { state.storyWanted = true; return; }

    var copy = q(".hero-copy", hero);
    var strip = q(".hero-strip", hero);
    var spin = rotatedElement(phone);
    var chapters = qa(".chapter", spine);
    var list = q(".spine-chapters", spine) || (chapters[0] && chapters[0].parentElement);
    var video = q(".phone-video", phone);
    var shots = qa(".phone-shot[data-shot]", phone);
    var layers = (video ? [video] : []).concat(shots);
    var current = video || null;
    var triggers = [];
    var m = { dx: 0, dy: 0, s: 1, approach: 1, hold: 0, exit: 0, total: 1 };
    var approachEase = gsap.parseEase("power2.inOut");

    gsap.set(phone, { transformOrigin: "50% 50%" });

    // Every value is re-measured on refresh (the pin is reverted then, so the
    // pin-spacer, or the phone itself, gives the untransformed layout box).
    function measure() {
      var box = phone.parentElement && phone.parentElement.classList.contains("pin-spacer") ? phone.parentElement : phone;
      var r = box.getBoundingClientRect();
      var tx = box === phone ? Number(gsap.getProperty(phone, "x")) || 0 : 0;
      var ty = box === phone ? Number(gsap.getProperty(phone, "y")) || 0 : 0;
      var sy = window.scrollY || window.pageYOffset || 0;
      var phoneW = phone.offsetWidth || r.width;
      var phoneCx = r.left + r.width / 2 - tx;
      var phoneCy = r.top + r.height / 2 - ty + sy;   // document coords

      var slotRect = slot.getBoundingClientRect();
      var slotW = slot.offsetWidth || slotRect.width;
      var slotH = slot.offsetHeight || slotRect.height;
      if (!slotW || !phoneW) { m.dx = m.dy = 0; m.s = 1; m.approach = 1; m.hold = m.exit = 0; m.total = 1; return; }
      var slotCs = getComputedStyle(slot);
      var stickyTop = parseFloat(slotCs.top);
      if (isNaN(stickyTop)) stickyTop = navHeight() + 40;
      // The slot's natural top is the row it shares with the chapter list;
      // its own rect is unusable while it is stuck.
      var rowTop = list ? list.getBoundingClientRect().top + sy : slotRect.top + sy;
      var slotNaturalTop = rowTop + (parseFloat(slotCs.marginTop) || 0);
      var listBottom = list ? list.getBoundingClientRect().bottom + sy : slotNaturalTop + slotH;

      var pinStart = 0;
      var stickyStart = Math.max(pinStart + 1, slotNaturalTop - stickyTop);
      var stickyEnd = Math.max(stickyStart, listBottom - slotH - stickyTop);

      m.dx = (slotRect.left + slotW / 2) - phoneCx;
      m.dy = (stickyTop + slotH / 2) - (phoneCy - pinStart);
      m.s = slotW / phoneW;
      m.approach = stickyStart - pinStart;
      m.hold = stickyEnd - stickyStart;
      m.exit = stickyTop + slotH + 8;                  // until the phone has left the viewport
      m.total = m.approach + m.hold + m.exit;
    }

    function apply(self) {
      var scroll = self.scroll() - self.start;
      var x, y, s;
      if (scroll <= 0) { x = 0; y = 0; s = 1; }
      else if (scroll < m.approach) {
        var t = approachEase(scroll / m.approach);
        x = m.dx * t; y = m.dy * t; s = 1 + (m.s - 1) * t;
      } else if (scroll < m.approach + m.hold) { x = m.dx; y = m.dy; s = m.s; }
      else { x = m.dx; y = m.dy - Math.min(scroll - m.approach - m.hold, m.exit); s = m.s; }
      gsap.set(phone, { x: x, y: y, scale: s });
    }

    // A: hero copy leaves, phone straightens.
    var fade = gsap.timeline({ scrollTrigger: {
      trigger: hero, start: "top top", end: "bottom top", scrub: 0.6, invalidateOnRefresh: true
    } });
    var leaving = [copy, strip].filter(Boolean);
    if (leaving.length) fade.to(leaving, { opacity: 0, y: -40, ease: "none" }, 0);
    fade.to(spin, { rotation: 0, ease: "none" }, 0);
    triggers.push(fade.scrollTrigger);

    // B: pin from the top of the page; the transform carries the phone to the
    // slot, holds it there while the slot is stuck, then scrolls it away.
    triggers.push(ST.create({
      trigger: hero,
      start: 0,
      end: function () { measure(); return m.total; },
      pin: phone,
      pinSpacing: false,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onRefresh: apply,
      onUpdate: apply
    }));

    function showLayer(name) {
      var target = name === "video" ? video : shots.filter(function (s) { return s.dataset.shot === name; })[0];
      if (!target || target === current) return;
      current = target;
      layers.forEach(function (layer) {
        var on = layer === target;
        gsap.to(layer, { opacity: on ? 1 : 0, duration: 0.35, ease: "power2.inOut", overwrite: "auto",
          onComplete: function () { if (layer === video && !on) video.pause(); } });
        if (layer === video && on && video.paused) { var p = video.play(); if (p && p.catch) p.catch(noop); }
      });
    }

    chapters.forEach(function (chapter) {
      triggers.push(ST.create({
        trigger: chapter, start: "top center", end: "bottom center",
        toggleClass: "is-current",
        onToggle: function (self) { if (self.isActive) showLayer(chapter.dataset.shot); }
      }));
    });
    if (list && video) {
      triggers.push(ST.create({
        trigger: list, start: "top center", end: "bottom center",
        onToggle: function (self) { if (!self.isActive) showLayer("video"); }
      }));
    }

    state.story = {
      triggers: triggers,
      cleanup: function () {
        fade.kill();
        gsap.killTweensOf(layers.concat([phone, spin], leaving));
        gsap.set(layers.concat([phone, spin], leaving), { clearProps: "transform,opacity" });
        chapters.forEach(function (c) { c.classList.remove("is-current"); });
        if (video && video.paused) { var p = video.play(); if (p && p.catch) p.catch(noop); }
      }
    };
  }

  function killStory() {
    var story = state.story;
    if (!story) return;
    state.story = null;
    story.triggers.forEach(function (t) { if (t) t.kill(true); });
    story.cleanup();
  }

  /* ------------------------------------------------------------------ */
  /* Reveals                                                              */
  /* ------------------------------------------------------------------ */

  function setupReveals() {
    if (!("IntersectionObserver" in window)) {
      qa("[data-reveal], [data-reveal-stagger], .divider").forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    state.observed = new WeakSet();
    state.io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        // Very tall wrappers never reach 15% visible; let them in once on screen.
        var tall = entry.boundingClientRect.height > window.innerHeight * 0.7;
        if (entry.intersectionRatio < 0.15 && !tall) return;
        entry.target.classList.add("is-visible");
        state.io.unobserve(entry.target);
      });
    }, { threshold: [0, 0.15], rootMargin: "-40px 0px" });
    scanReveals();
  }

  function scanReveals() {
    if (!state.io) return;
    var els = qa("[data-reveal], [data-reveal-stagger], .divider");
    qa(".line-mask").forEach(function (mask) { if (mask.parentElement) els.push(mask.parentElement); });
    els.forEach(function (el) {
      if (el.classList.contains("is-visible") || state.observed.has(el)) return;
      state.observed.add(el);
      state.io.observe(el);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Tilt                                                                 */
  /* ------------------------------------------------------------------ */

  function bindTilt() {
    if (!state.motion || !hoverMQ.matches) return;
    var gsap = window.gsap;
    qa("[data-tilt]").forEach(function (el) {
      if (state.tilt.some(function (t) { return t.el === el; })) return;
      gsap.set(el, { transformPerspective: 900 });
      var toX = gsap.quickTo(el, "rotationX", { duration: 0.45, ease: "power3.out" });
      var toY = gsap.quickTo(el, "rotationY", { duration: 0.45, ease: "power3.out" });
      function move(event) {
        if (event.pointerType && event.pointerType !== "mouse") return;
        var r = el.getBoundingClientRect();
        if (!r.width || !r.height) return;
        var px = (event.clientX - r.left) / r.width - 0.5;
        var py = (event.clientY - r.top) / r.height - 0.5;
        toX(-py * 12);   // 6deg max either way
        toY(px * 12);
      }
      function leave() {
        gsap.to(el, { rotationX: 0, rotationY: 0, duration: 0.6, ease: "expo.out", overwrite: "auto" });
      }
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      state.tilt.push({ el: el, off: function () {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
        gsap.killTweensOf(el);
        gsap.set(el, { clearProps: "transform" });
      } });
    });
  }

  function unbindTilt() {
    state.tilt.forEach(function (t) { t.off(); });
    state.tilt = [];
  }

  /* ------------------------------------------------------------------ */
  /* Indicators                                                           */
  /* ------------------------------------------------------------------ */

  // app.js showArticle marks the active sidebar button with .is-active and
  // aria-pressed; highlightSpy marks the TOC link with .is-active and
  // aria-current="location".
  var ACTIVE_SIDEBAR = '.wiki-sidebar button[data-article].is-active, .wiki-sidebar button[data-article][aria-pressed="true"]';
  var ACTIVE_TOC = '[data-wiki-toc] a.is-active, [data-wiki-toc] a[aria-current]';
  var INDICATORS = ".nav-indicator, .wiki-sidebar-indicator, .wiki-toc-indicator";

  function setupIndicators() {
    state.indicatorPos = new WeakMap();
    placeIndicators();
    // highlightSpy runs from app.js's own IntersectionObserver with no event,
    // so watch the containers for its class/attribute writes.
    if ("MutationObserver" in window) {
      var watched = [q("[data-wiki-toc]"), q(".wiki-sidebar"), q(".site-nav .nav-tabs")].filter(Boolean);
      if (watched.length) {
        var queued = false;
        state.mo = new MutationObserver(function (records) {
          // Our own writes to the indicators land in these containers too.
          var relevant = records.some(function (r) { return !r.target.matches || !r.target.matches(INDICATORS); });
          if (queued || !relevant) return;
          queued = true;
          window.requestAnimationFrame(function () { queued = false; placeIndicators(); });
        });
        watched.forEach(function (el) {
          state.mo.observe(el, { attributes: true, subtree: true, childList: true,
            attributeFilter: ["style", "class", "aria-current", "aria-pressed"] });
        });
      }
    }
  }

  function onDocClick(event) {
    var t = event.target;
    if (!t || !t.closest) return;
    if (t.closest(".site-nav .nav-tabs, .wiki-sidebar, .wiki-toc-col")) {
      window.requestAnimationFrame(placeIndicators);
    }
  }

  function placeIndicators() {
    if (state.dead) return;
    placeIndicator(q(".site-nav .nav-tabs .nav-indicator"), q('.site-nav .nav-tabs [aria-current="page"]'), "x");
    placeIndicator(q(".wiki-sidebar .wiki-sidebar-indicator"), q(ACTIVE_SIDEBAR), "y");
    placeIndicator(q(".wiki-toc-col .wiki-toc-indicator"), q(ACTIVE_TOC), "y");
  }

  // Only transform and width/height are written; the CSS transition on the
  // indicator does the sliding. The untransformed origin is the current rect
  // minus the current (possibly mid-transition) translate.
  function placeIndicator(indicator, active, axis) {
    if (!indicator) return;
    // No active item yet (the TOC spy has not fired): keep the bar hidden
    // rather than parked at the container's corner.
    if (!active) { indicator.style.opacity = "0"; return; }
    indicator.style.opacity = "";
    var ar = active.getBoundingClientRect();
    var ir = indicator.getBoundingClientRect();
    if (!ar.width && !ar.height) return;
    var t = currentTranslate(indicator);
    var size, transform;
    if (axis === "x") {
      size = ar.width;
      transform = "translateX(" + (ar.left - (ir.left - t.x)).toFixed(2) + "px)";
    } else {
      size = ar.height;
      transform = "translateY(" + (ar.top - (ir.top - t.y)).toFixed(2) + "px)";
    }
    var key = axis + size + transform;
    if (state.indicatorPos.get(indicator) === key) return;   // idempotent, keeps the observer quiet
    state.indicatorPos.set(indicator, key);
    indicator.style[axis === "x" ? "width" : "height"] = size + "px";
    indicator.style.transform = transform;
  }

  function currentTranslate(el) {
    var t = getComputedStyle(el).transform;
    var m = /matrix\(([^)]+)\)/.exec(t || "");
    if (!m) return { x: 0, y: 0 };
    var p = m[1].split(",").map(parseFloat);
    return { x: p[4] || 0, y: p[5] || 0 };
  }

  /* ------------------------------------------------------------------ */

  window.TLMotion = { refresh: refresh, teardown: teardown };

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
