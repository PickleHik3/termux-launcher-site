/* Termux Launcher — home page: the character field, the index stage, release tags */
(() => {
  "use strict";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* old deep links: /#wiki/<key> now live under docs/ */
  if (/^#wiki(\/|$)/.test(location.hash)) { location.replace(`docs/${location.hash}`); return; }

  /* ---------- character field ---------- */
  const hero = document.querySelector(".hero");
  const canvas = document.querySelector(".hero-field");
  if (hero && canvas) field(hero, canvas);

  function field(hero, canvas) {
    const ctx = canvas.getContext("2d", { alpha: true });
    const RAMP = " .·:;+=*#%@";
    const INK = "#17181c", KLEIN = "#1f2bd4";
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const FONT_PX = 14;
    let cols = 0, rows = 0, cw = 0, ch = 0, sprites = null;
    let wake = [];                       // {x, y, t} in cell units
    let pointer = null;                  // last pointer cell
    let booted = reduced, bootStart = 0;
    let running = false, raf = 0, lastInput = 0;

    function buildSprites() {
      const font = `500 ${FONT_PX * dpr}px "Martian Mono", monospace`;
      ctx.font = font;
      cw = Math.ceil(ctx.measureText("@").width / dpr);
      ch = Math.round(FONT_PX * 1.4);
      sprites = {};
      for (const color of [INK, KLEIN]) {
        const sheet = document.createElement("canvas");
        sheet.width = RAMP.length * cw * dpr; sheet.height = ch * dpr;
        const c = sheet.getContext("2d");
        c.font = font; c.fillStyle = color; c.textBaseline = "middle"; c.textAlign = "center";
        for (let i = 0; i < RAMP.length; i++) c.fillText(RAMP[i], (i + .5) * cw * dpr, ch * dpr / 2);
        sprites[color] = sheet;
      }
    }

    function resize() {
      const r = hero.getBoundingClientRect();
      canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
      if (!sprites) buildSprites();
      cols = Math.ceil(r.width / cw); rows = Math.ceil(r.height / ch);
      measureClear();
      draw(performance.now());
    }

    // smooth value noise, two octaves, drifting slowly
    function hash(ix, iy) {
      let n = (ix * 374761393 + iy * 668265263) | 0;
      n = Math.imul(n ^ (n >>> 13), 1274126177);
      return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
    }
    function noise(x, y) {
      const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
      const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
      const a = hash(ix, iy), b = hash(ix + 1, iy), c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1);
      return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
    }
    // the copy pushes the characters away: feathered rectangle around .hero-copy and the top bar
    let clear = null;
    function measureClear() {
      const c = hero.querySelector(".hero-copy"), r = hero.getBoundingClientRect(), b = c.getBoundingClientRect();
      clear = { x0: (b.left - r.left) / cw, y0: (b.top - r.top) / ch, x1: (b.right - r.left) / cw, y1: (b.bottom - r.top) / ch };
    }
    function clearing(x, y) {
      if (!clear) return 1;
      const dx = Math.max(clear.x0 - x, 0, x - clear.x1), dy = Math.max(clear.y0 - y, 0, y - clear.y1);
      const d = Math.hypot(dx * cw, dy * ch);
      const f = Math.min(1, d / 110);
      return y < 3.2 ? .35 : f * f;
    }
    function density(x, y, t) {
      const s = t * .00004;
      const n = .72 * noise(x * .038 + s * 3, y * .07 + s) + .28 * noise(x * .11 - s * 2, y * .19 + s * 4);
      const v = Math.min(.42, Math.max(0, n - .47) * 1.6) * clearing(x, y);
      let w = 0;
      for (const p of wake) {
        const age = (t - p.t) / 1400;
        if (age > 1) continue;
        const r = Math.hypot((x - p.x) * cw, (y - p.y) * ch) / (30 + age * 140);
        w += Math.exp(-r * r) * (1 - age);
      }
      return [v, w];
    }

    function draw(t) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const total = cols * rows;
      const prog = booted ? 1 : Math.min(1, (t - bootStart) / 1300);
      const lit = Math.floor(total * easeOut(prog));
      const ink = sprites[INK], blue = sprites[KLEIN], sw = cw * dpr, sh = ch * dpr;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          if (y * cols + x > lit) break;
          const [v, w] = density(x, y, t);
          const d = Math.min(1, v + w);
          const i = Math.min(RAMP.length - 1, Math.floor(d * RAMP.length));
          if (i === 0) continue;
          const hot = w > .18;
          ctx.globalAlpha = hot ? Math.min(1, .55 + w) : .3 + d * .6;
          ctx.drawImage(hot ? blue : ink, i * sw, 0, sw, sh, x * sw, y * sh, sw, sh);
        }
      }
      ctx.globalAlpha = 1;
      if (!booted && prog >= 1) { booted = true; hero.classList.add("is-booted"); }
    }
    function easeOut(p) { return 1 - Math.pow(1 - p, 3); }

    function frame(t) {
      wake = wake.filter((p) => t - p.t < 1400);
      draw(t);
      const idle = t - lastInput > 4000 && booted;
      raf = running ? setTimeout(() => requestAnimationFrame(frame), idle ? 70 : 0) : 0;
    }
    function start() { if (running) return; running = true; lastInput = performance.now(); requestAnimationFrame(frame); }
    function stop() { running = false; clearTimeout(raf); }

    function onMove(e) {
      const r = canvas.getBoundingClientRect();
      const x = (e.clientX - r.left) / cw, y = (e.clientY - r.top) / ch;
      const t = performance.now();
      lastInput = t;
      if (!pointer || Math.hypot(x - pointer.x, y - pointer.y) > .8) {
        wake.push({ x, y, t });
        if (wake.length > 40) wake.shift();
        pointer = { x, y };
      }
      hero.classList.add("has-pointer");
    }

    resize();
    if (reduced) { hero.classList.add("is-booted"); draw(performance.now()); }
    else {
      bootStart = performance.now();
      setTimeout(() => { booted = true; hero.classList.add("is-booted"); }, 1700);
      setTimeout(measureClear, 2400);
      document.fonts.ready.then(() => { sprites = null; resize(); });
      hero.addEventListener("pointermove", onMove, { passive: true });
      hero.addEventListener("pointerleave", () => { pointer = null; });
      new IntersectionObserver(([en]) => (en.isIntersecting && !document.hidden ? start() : stop()), { threshold: 0 }).observe(hero);
      document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
      start();
    }
    let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(resize, 120); });
  }

  /* ---------- top bar: dark over the ink band, hidden while scrolling down ---------- */
  const top = document.querySelector(".top");
  const band = document.querySelector(".show");
  if (top && band) {
    let lastY = scrollY;
    const tick = () => {
      const r = band.getBoundingClientRect();
      top.classList.toggle("is-dark", r.top <= 40 && r.bottom > 40);
      const y = scrollY;
      top.classList.toggle("is-away", y > 120 && y > lastY + 2);
      if (y < lastY - 2 || y <= 120) top.classList.remove("is-away");
      lastY = y;
    };
    addEventListener("scroll", tick, { passive: true });
    tick();
  }

  /* ---------- index stage ---------- */
  const index = document.querySelector("[data-index]");
  const stage = document.querySelector("[data-stage]");
  if (index && stage) {
    const caption = stage.querySelector("[data-caption]");
    const media = [...stage.querySelectorAll("[data-media-for]")];
    const buttons = [...index.querySelectorAll("button[data-media]")];
    let current = "terminal";
    const show = (key) => {
      if (key === current) return;
      current = key;
      buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.media === key)));
      media.forEach((m) => {
        const on = m.dataset.mediaFor === key;
        m.classList.toggle("is-active", on);
        if (m.tagName === "VIDEO") on ? m.play().catch(() => {}) : m.pause();
      });
      const b = buttons.find((b) => b.dataset.media === key);
      if (caption && b) caption.textContent = b.querySelector("b").textContent;
    };
    buttons.forEach((b) => {
      b.addEventListener("click", () => show(b.dataset.media));
      b.addEventListener("pointerenter", () => show(b.dataset.media));
      b.addEventListener("focus", () => show(b.dataset.media));
    });
    new IntersectionObserver(([en]) => media.forEach((m) => {
      if (m.tagName !== "VIDEO") return;
      en.isIntersecting && m.classList.contains("is-active") ? m.play().catch(() => {}) : m.pause();
    })).observe(stage);
  }

  /* ---------- release tags and stars ---------- */
  const tagNodes = document.querySelectorAll("[data-release-tag]");
  if (tagNodes.length) {
    fetch("https://api.github.com/repos/PickleHik3/termux-launcher/releases?per_page=30")
      .then((r) => (r.ok ? r.json() : []))
      .then((rel) => {
        const pick = (suffix) => rel.find((r) => !r.draft && !r.prerelease && (suffix ? r.tag_name.endsWith(suffix) : !/-(nix|vaj)$/.test(r.tag_name)));
        const main = pick(""), nix = pick("-nix"), vaj = pick("-vaj");
        const map = { "PickleHik3/termux-launcher:main": main, "PickleHik3/termux-launcher:nix": nix, "PickleHik3/termux-launcher:vaj": vaj };
        tagNodes.forEach((n) => {
          const key = n.dataset.releaseTag;
          const r = key ? map[key] : main;
          if (r) n.textContent = r.tag_name;
        });
        document.querySelectorAll("[data-release-link]").forEach((a) => { const r = map[a.dataset.releaseLink]; if (r) a.href = r.html_url; });
      })
      .catch(() => {});
  }
  const stars = document.querySelector("[data-github-stars]");
  if (stars) fetch(`https://api.github.com/repos/${stars.dataset.githubStars}`).then((r) => r.json()).then((j) => { if (j.stargazers_count) stars.textContent = `${j.stargazers_count} stars`; }).catch(() => {});
})();
