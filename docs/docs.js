/* The guide: turns the rendered _wiki pages into one page with a tree, disclosures and clips.
   Plain DOM, no dependencies. Every page section is <section class="page" id="wiki/<slug>">. */
(() => {
  "use strict";
  const ASSETS = "../";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasIO = "IntersectionObserver" in window;
  const pages = [...document.querySelectorAll("section.page")];
  const tree = document.querySelector(".tree");
  const indicator = tree.querySelector(".tree-ind");
  const filter = document.getElementById("toc-filter");
  const tocBtn = document.querySelector(".toc-btn");
  const linkFor = new Map(); // element id -> tree link
  const pageLi = new Map(); // slug -> tree <li>
  const videos = [];
  document.documentElement.classList.add("js");

  const el = (tag, cls, text) => Object.assign(document.createElement(tag), cls ? { className: cls } : {}, text ? { textContent: text } : {});
  const slugify = (text) => text.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").trim().replace(/\s+/g, "-");

  /* ── Clips: ```clip blocks with name / src / image / svg / title / caption / formats / shape / layout / crop / size ── */
  // "size: WxH" is the source frame in pixels (default: the 1080x1920 feature captures).
  function parseSize(value) {
    const m = /^(\d{1,5})\s*x\s*(\d{1,5})$/i.exec(value || "");
    return m && +m[1] > 0 && +m[2] > 0 ? { w: +m[1], h: +m[2] } : null;
  }
  // "crop: x y w h" is the visible region as fractions of the source frame; anything malformed is ignored.
  function parseCrop(value) {
    const n = (value || "").split(/[\s,]+/).filter(Boolean).map(Number);
    if (n.length !== 4 || !n.every(Number.isFinite)) return null;
    const [x, y, w, h] = n;
    const ok = x >= 0 && y >= 0 && w > 0 && h > 0 && x + w <= 1.0001 && y + h <= 1.0001;
    return ok ? { x, y, w, h } : null;
  }
  const pct = (v) => `${+v.toFixed(4)}%`;

  // An infographic: fetch the SVG, inline its root, point its assets/ links at the site root.
  function loadSvg(name, frame) {
    fetch(`${ASSETS}assets/docs/infographics/${name}.svg`)
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
      .then((text) => {
        const doc = new DOMParser().parseFromString(text, "image/svg+xml");
        const svg = doc.documentElement;
        if (!svg || svg.localName !== "svg" || doc.getElementsByTagName("parsererror").length) throw new Error("not an svg");
        svg.querySelectorAll("script, foreignObject").forEach((n) => n.remove());
        for (const node of [svg, ...svg.querySelectorAll("*")]) {
          for (const attr of [...node.attributes]) {
            if (/^on/i.test(attr.name)) node.removeAttributeNode(attr);
            else if (attr.localName === "href" && attr.value.startsWith("assets/")) attr.value = ASSETS + attr.value;
          }
        }
        frame.append(document.importNode(svg, true));
        frame.hidden = false;
      })
      .catch(() => frame.remove());
  }

  function buildClip(f) {
    const label = f.title || f.name || "";
    const size = parseSize(f.size);
    const crop = f.svg ? null : parseCrop(f.crop);
    const figure = el("figure", f.shape === "wide" || ((crop || f.svg) && f.shape !== "narrow") ? "clip wide" : "clip");
    const frame = el("div", "clip-frame");
    let media;
    if (f.svg) {
      if (!/^[a-z0-9][a-z0-9-]*$/.test(f.svg)) return null;
      frame.classList.add("infographic");
      frame.hidden = true; // nothing visible until the SVG is in; a failed fetch leaves only the caption
      loadSvg(f.svg, frame);
    } else if (f.image) {
      if (!/^assets\/[a-z0-9][a-z0-9/._-]*$/i.test(f.image) || f.image.includes("..")) return null;
      media = Object.assign(el("img"), { loading: "lazy", decoding: "async", src: ASSETS + f.image, alt: f.title || f.caption || "" });
      if (size) Object.assign(media, { width: size.w, height: size.h });
      frame.append(media);
    } else {
      let base;
      if (/^[a-z0-9][a-z0-9-]*$/.test(f.name || "")) base = `${ASSETS}assets/showcase/features/${f.name}`;
      else if (/^assets\/[a-z0-9][a-z0-9/-]*$/.test(f.src || "") && !f.src.includes("..")) base = ASSETS + f.src;
      else return null;
      if (!crop) frame.classList.add(base.includes("/showcase/features/") && !f.src ? "phone" : "raw");
      const formats = (f.formats || "webm,mp4").split(",").map((s) => s.trim().toLowerCase()).filter((s) => s === "webm" || s === "mp4");
      if (!formats.length) return null;
      const video = el("video");
      ["muted", "loop", "playsinline"].forEach((a) => video.setAttribute(a, ""));
      Object.assign(video, { muted: true, preload: "none" });
      video.dataset.poster = `${base}-poster.webp`;
      video.setAttribute("aria-label", `${label} screen recording`);
      formats.forEach((format) => video.append(Object.assign(el("source"), { src: `${base}.${format}`, type: `video/${format}` })));
      // Autoplay can be refused (battery saver, reduced motion): the overlay starts it by hand.
      const toggle = Object.assign(el("button", "clip-toggle"), { type: "button" });
      toggle.setAttribute("aria-label", `Play ${label}`);
      toggle.addEventListener("click", () => (video.paused ? video.play().catch(() => {}) : video.pause()));
      video.addEventListener("play", () => { frame.dataset.playing = ""; toggle.setAttribute("aria-label", `Pause ${label}`); });
      video.addEventListener("pause", () => { delete frame.dataset.playing; toggle.setAttribute("aria-label", `Play ${label}`); });
      frame.append(video, toggle);
      videos.push(video);
      media = video;
    }
    if (crop) {
      // Show only the declared region: the frame takes the region's aspect, the media is scaled and shifted behind it.
      const src = size || { w: 1080, h: 1920 };
      const aspect = (crop.w * src.w) / (crop.h * src.h);
      frame.classList.add("crop");
      frame.style.aspectRatio = `${+(crop.w * src.w).toFixed(2)} / ${+(crop.h * src.h).toFixed(2)}`;
      Object.assign(media.style, {
        left: pct((-crop.x / crop.w) * 100), top: pct((-crop.y / crop.h) * 100), width: pct(100 / crop.w),
        aspectRatio: `${src.w} / ${src.h}`,
      });
      // No cropped frame taller than about 440px at full width.
      if (figure.classList.contains("wide")) figure.style.maxWidth = `${Math.min(760, Math.round(440 * aspect))}px`;
    } else if (size && media) {
      // Reserve the box before the poster or image arrives, and never stretch past the source's own width.
      media.style.aspectRatio = `${size.w} / ${size.h}`;
      if (size.w < (figure.classList.contains("wide") ? 760 : 280)) figure.style.maxWidth = `${size.w}px`;
    }
    figure.append(frame);
    const cap = el("figcaption", "", f.caption || "");
    if (f.title) cap.prepend(el("b", "", f.title));
    if (f.title || f.caption) figure.append(cap);
    return figure;
  }

  function renderClips(prose) {
    prose.querySelectorAll("pre > code.language-clip, .language-clip pre > code").forEach((code) => {
      const block = code.closest(".highlighter-rouge") || code.parentElement;
      const fields = {};
      for (const line of code.textContent.split("\n")) {
        const at = line.indexOf(":");
        if (at > 0) fields[line.slice(0, at).trim().toLowerCase()] = line.slice(at + 1).trim();
      }
      const figure = buildClip(fields);
      if (!figure) return;
      const prev = block.previousElementSibling;
      const row = prev && prev.classList.contains("clips") ? prev : el("div", "clips");
      if (fields.layout === "full") row.classList.add("full");
      if (fields.layout === "trio") row.classList.add("trio");
      row.append(figure);
      if (row === prev) block.remove(); else block.replaceWith(row);
    });
  }

  /* ── Each page: ids, lede, footer line, glance-first disclosures, tree headings ── */
  pages.forEach((page) => {
    const slug = page.dataset.slug;
    const prose = page.querySelector(".prose");
    renderClips(prose);
    prose.querySelectorAll("table").forEach((table) => { const wrap = el("div", "tbl"); table.replaceWith(wrap); wrap.append(table); });
    prose.querySelectorAll('a[href^="http"]').forEach((a) => { a.target = "_blank"; a.rel = "noopener"; });

    // kramdown's auto ids collide across pages; give every h2/h3 a page-scoped one.
    const used = new Set(), renamed = {};
    prose.querySelectorAll("h2, h3").forEach((h) => {
      const base = slugify(h.textContent) || "section";
      let key = base;
      for (let n = 2; used.has(key); n++) key = `${base}-${n}`;
      used.add(key);
      if (h.id) renamed[h.id] = `wiki/${slug}--${key}`;
      h.id = `wiki/${slug}--${key}`;
    });
    prose.querySelectorAll('a[href^="#"]:not([href^="#wiki"])').forEach((a) => {
      const key = a.getAttribute("href").slice(1);
      const id = renamed[key] || (used.has(key) ? `wiki/${slug}--${key}` : "");
      if (id) a.setAttribute("href", `#${id}`);
    });

    const last = [...prose.children].reverse().find((n) => n.tagName === "P" && /^Full details/.test(n.textContent.trim()));
    if (last) { last.className = "page-foot"; page.append(last); }

    let section = null;
    const h2s = [];
    for (const node of [...prose.children]) {
      if (node.tagName === "H2") {
        section = el(h2s.length ? "details" : "div", "sec");
        node.before(section);
        if (h2s.length) { const summary = el("summary"); summary.append(node); section.append(summary, el("div", "sec-body")); }
        else section.append(node);
        h2s.push(node);
      } else if (section) {
        (section.querySelector(":scope > .sec-body") || section).append(node);
      } else if (node.tagName === "P" && !prose.querySelector(".lede")) {
        node.classList.add("lede");
      }
    }

    const expand = page.querySelector(".expand");
    const all = [...page.querySelectorAll("details.sec")];
    if (all.length) {
      expand.hidden = false;
      expand.addEventListener("click", () => { const open = all.some((d) => !d.open); all.forEach((d) => { d.open = open; }); });
    }

    const li = tree.querySelector(`.tree-page[data-slug="${slug}"]`);
    if (!li) return;
    pageLi.set(slug, li);
    linkFor.set(page.id, li.firstElementChild);
    if (!h2s.length) return;
    const subs = el("ul", "subs");
    h2s.forEach((h) => {
      const a = Object.assign(el("a", "", h.textContent), { href: `#${h.id}` });
      const item = el("li");
      item.append(a);
      subs.append(item);
      linkFor.set(h.id, a);
    });
    const tw = Object.assign(el("button", "tw"), { type: "button" });
    tw.setAttribute("aria-label", `Headings in ${li.textContent.trim()}`);
    tw.setAttribute("aria-expanded", "false");
    tw.addEventListener("click", () => { li.dataset.user = li.classList.contains("open") ? "closed" : "open"; syncOpen(li); });
    li.append(tw, subs);
  });

  const syncExpandLabel = (page) => {
    const expand = page && page.querySelector(".expand");
    if (!expand || expand.hidden) return;
    expand.textContent = [...page.querySelectorAll("details.sec")].some((d) => !d.open) ? "Expand all" : "Collapse all";
  };
  document.addEventListener("toggle", (e) => syncExpandLabel(e.target.closest && e.target.closest(".page")), true);

  /* ── Tree state: active page, open heading lists, sliding indicator ── */
  let activeSlug = null, activeSec = null;
  function syncOpen(li) {
    const user = li.dataset.user;
    const open = user === "open" || (user !== "closed" && li.dataset.slug === activeSlug);
    li.classList.toggle("open", open);
    const tw = li.querySelector(":scope > .tw");
    if (tw) tw.setAttribute("aria-expanded", String(open));
    moveIndicator();
  }
  function moveIndicator() {
    const sub = activeSec && linkFor.get(activeSec.querySelector("h2").id);
    const page = activeSlug && linkFor.get(`wiki/${activeSlug}`);
    const link = sub && sub.offsetParent ? sub : page;
    if (!link || !link.offsetParent || !tree.clientHeight) { indicator.classList.remove("on"); return; }
    const box = tree.getBoundingClientRect();
    const top = link.getBoundingClientRect().top - box.top + tree.scrollTop;
    indicator.style.transform = `translateY(${top}px) scaleY(${link.offsetHeight})`;
    indicator.classList.add("on");
    if (top < tree.scrollTop || top + link.offsetHeight > tree.scrollTop + tree.clientHeight) tree.scrollTop = top - tree.clientHeight / 3;
  }
  function setPage(slug) {
    if (slug === activeSlug) return;
    const prev = activeSlug;
    activeSlug = slug;
    if (activeSec && activeSec.closest(".page").dataset.slug !== slug) setSec(null);
    [prev, slug].map((s) => pageLi.get(s)).filter(Boolean).forEach((li) => {
      const on = li.dataset.slug === slug;
      li.classList.toggle("is-active", on);
      if (on) li.firstElementChild.setAttribute("aria-current", "location"); else li.firstElementChild.removeAttribute("aria-current");
      syncOpen(li);
    });
  }
  function setSec(sec) {
    if (activeSec) linkFor.get(activeSec.querySelector("h2").id)?.classList.remove("is-active");
    activeSec = sec;
    if (sec) setPage(sec.closest(".page").dataset.slug);
    if (sec) linkFor.get(sec.querySelector("h2").id)?.classList.add("is-active");
    moveIndicator();
  }

  /* ── Hash targets: open the disclosure holding the target, then scroll below the nav ── */
  // Slugs from before the docs rework, still used by the app and old links. "" = top of the guide.
  const ALIASES = { overview: "get-started", install: "home-screen", shell: "keyboard", surface: "terminal",
    tour: "command-palette", "shell-goodies": "tlstore", tai: "on-device-ai", tmux: "config", launcherctl: "permissions", backup: "" };
  const targetOf = (hash) => {
    if (!/^#wiki\/./.test(hash)) return null;
    const id = decodeURIComponent(hash.slice(1));
    return document.getElementById(id) || document.getElementById(id.split("--")[0]);
  };
  function unalias() {
    const m = /^#wiki\/([^/-]+(?:-[^/-]+)*?)(--.*)?$/.exec(decodeURIComponent(location.hash));
    if (!m || !(m[1] in ALIASES)) return;
    const slug = ALIASES[m[1]];
    history.replaceState(null, "", slug ? `#wiki/${slug}${m[2] || ""}` : "#wiki");
  }
  const reveal = (target) => {
    for (let n = target; n; n = n.parentElement) if (n.tagName === "DETAILS") n.open = true;
    target.closest(".page")?.classList.remove("pre");
  };
  function go(hash, smooth) {
    const target = targetOf(hash);
    if (!target) return;
    reveal(target);
    target.scrollIntoView({ behavior: smooth && !reduce ? "smooth" : "instant", block: "start" });
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest('a[href^="#wiki/"]');
    if (!a) return;
    const target = targetOf(a.getAttribute("href"));
    if (target) reveal(target);
    if (a.closest(".toc")) closeSheet(false);
  });
  window.addEventListener("hashchange", () => { unalias(); go(location.hash, true); });
  unalias();
  go(location.hash, false);

  /* ── Contents sheet (under 1000px) ── */
  function closeSheet(focusButton) {
    if (!document.body.classList.contains("sheet-open")) return;
    document.body.classList.remove("sheet-open");
    tocBtn.setAttribute("aria-expanded", "false");
    if (focusButton) tocBtn.focus();
  }
  tocBtn.addEventListener("click", () => {
    if (document.body.classList.contains("sheet-open")) return closeSheet(false);
    document.body.classList.add("sheet-open");
    tocBtn.setAttribute("aria-expanded", "true");
    document.querySelector(".toc-close").focus();
    moveIndicator();
  });
  document.querySelector(".toc-close").addEventListener("click", () => closeSheet(true));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeSheet(true); });

  /* ── Filter by page title and heading text ── */
  filter.addEventListener("input", () => {
    const q = filter.value.trim().toLowerCase();
    tree.querySelectorAll(".tree-group").forEach((group) => {
      let any = false;
      group.querySelectorAll(".tree-page").forEach((li) => {
        const hit = !q || li.firstElementChild.textContent.toLowerCase().includes(q);
        let subHit = false;
        li.querySelectorAll(".subs li").forEach((item) => {
          const match = hit || item.textContent.toLowerCase().includes(q);
          item.hidden = !match;
          if (q && !hit && match) subHit = true;
        });
        li.hidden = !(hit || subHit);
        li.classList.toggle("filter-open", subHit);
        any = any || !li.hidden;
      });
      group.hidden = !any;
    });
    moveIndicator();
  });

  /* ── Observers: scrollspy, fade-up once, clips play only on screen ── */
  if (hasIO) {
    const spy = new IntersectionObserver((entries) => entries.forEach((e) => {
      const t = e.target;
      if (t.classList.contains("page")) { if (e.isIntersecting) setPage(t.dataset.slug); }
      else if (e.isIntersecting) setSec(t);
      else if (t === activeSec) setSec(null);
    }), { rootMargin: "-25% 0px -70% 0px" });
    pages.forEach((p) => { spy.observe(p); p.querySelectorAll(".sec").forEach((s) => spy.observe(s)); });

    if (!reduce) {
      const fade = new IntersectionObserver((entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.remove("pre"); fade.unobserve(e.target); }
      }), { rootMargin: "0px 0px -8% 0px" });
      pages.forEach((p) => { if (p.getBoundingClientRect().top > innerHeight) { p.classList.add("pre"); fade.observe(p); } });
    }

    const clipIO = new IntersectionObserver((entries) => entries.forEach((e) => {
      const v = e.target;
      if (!e.isIntersecting) { if (!v.paused) v.pause(); return; }
      if (v.dataset.poster) { v.poster = v.dataset.poster; delete v.dataset.poster; }
      if (!reduce) v.play().catch(() => {});
    }), { rootMargin: "200px 0px" });
    videos.forEach((v) => clipIO.observe(v));
  } else {
    videos.forEach((v) => { v.poster = v.dataset.poster; });
  }

  /* ── Print everything open, then restore ── */
  let closedForPrint = [];
  window.addEventListener("beforeprint", () => {
    closedForPrint = [...document.querySelectorAll("details.sec:not([open])")];
    closedForPrint.forEach((d) => { d.open = true; });
  });
  window.addEventListener("afterprint", () => closedForPrint.forEach((d) => { d.open = false; }));
  window.addEventListener("resize", moveIndicator, { passive: true });
})();
