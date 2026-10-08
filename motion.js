/* Motion layer for the Termux Launcher site. Runs as a classic deferred script
   after app.js. Binds only to the selectors named in DESIGN.md and no-ops when
   an element is missing, because the DOM/CSS ship from a separate change.
   Scroll-linked work uses ScrollTrigger and IntersectionObserver only. */
(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  var reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");

  var state = {
    booted: false,
    dead: false,
    motion: false,        // gsap + ScrollTrigger present and reduced motion off
    pendingView: null,    // a tl:viewchange that arrived before boot
    io: null,
    observed: null,       // WeakSet of elements handed to the observer
    mo: null,
    resizeTimer: 0,
    indicatorPos: null    // WeakMap indicator -> last written size+transform key
  };

  function q(sel, scope) { return (scope || doc).querySelector(sel); }
  function qa(sel, scope) { return Array.prototype.slice.call((scope || doc).querySelectorAll(sel)); }
  function noop() {}

  function hasGsap() { return !!(window.gsap && window.ScrollTrigger); }

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
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("load", function () { refresh(); }, { once: true });
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { refresh(); }, noop);
    doc.addEventListener("click", onDocClick, true);

    if (state.pendingView) {
      var pending = state.pendingView;
      state.pendingView = null;
      onViewChange(pending);
    }
  }

  function onMediaChange(mq, handler) {
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else if (mq.addListener) mq.addListener(handler);
  }

  function enableMotion() {
    if (state.dead || state.motion) return;
    if (!hasGsap() || reduceMQ.matches) return;
    window.gsap.registerPlugin(window.ScrollTrigger);
    state.motion = true;
    root.classList.add("has-motion");
  }

  // Kills every tween and trigger this file made and clears the inline
  // styles they left, so the CSS fallback layout takes over cleanly.
  function disableMotion() {
    if (!state.motion) return;
    if (window.ScrollTrigger) window.ScrollTrigger.getAll().forEach(function (t) { t.kill(true); });
    state.motion = false;
    root.classList.remove("has-motion");
  }

  function onReduceChange() {
    if (reduceMQ.matches) disableMotion();
    else enableMotion();
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
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }

  function teardown() {
    disableMotion();
    if (state.io) state.io.disconnect();
    if (state.mo) state.mo.disconnect();
    state.dead = true;
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
