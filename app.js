"use strict";

class TermuxLauncherSite {
  constructor() {
    this.views = ["setup", "wiki", "ai", "showcase"];
    this.spyMap = null;
    this.observer = null;
    this.stats = { cpu: 24, ram: 61, temp: 41 };
    this.endpointGroups = [
      {
        name: "OpenAI-compatible",
        items: [
          { method: "GET", path: "/v1/models", description: "List installed, loadable models and their capabilities. Multimodal models are also exposed as separate -vision and -audio model IDs.", example: "curl -sS -H \"Authorization: Bearer $TOKEN\" \\\n  \"$OPENAI_BASE_URL/models\" | jq ." },
          { method: "POST", path: "/v1/chat/completions", description: "Chat Completions — text, streaming (SSE), image/audio input, and tools.", example: "curl -sS -H \"Authorization: Bearer $TOKEN\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"model\":\"MODEL_ID\",\"messages\":[{\"role\":\"user\",\"content\":\"hi\"}]}' \\\n  \"$OPENAI_BASE_URL/chat/completions\"" },
          { method: "POST", path: "/v1/completions", description: "Legacy text completions." },
          { method: "POST", path: "/v1/embeddings", description: "Embeddings for models that advertise text_embeddings (e.g. embeddinggemma-300m). Returns OpenAI-shape float vectors.", example: "curl -sS -H \"Authorization: Bearer $TOKEN\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"model\":\"embeddinggemma-300m\",\"input\":\"hello world\"}' \\\n  \"$OPENAI_BASE_URL/embeddings\"" },
          { method: "POST", path: "/v1/audio/speech", description: "Present for OpenAI compatibility, but always returns an unsupported_audio_output error — there is no local speech backend." }
        ]
      },
      {
        name: "Ollama-compatible",
        items: [
          { method: "GET", path: "/api/version", description: "Server version string (reports as 0.13.3-termux-launcher)." },
          { method: "GET", path: "/api/tags", description: "List installed models." },
          { method: "POST", path: "/api/chat", description: "Chat and tool calls. Streams newline-delimited JSON." },
          { method: "POST", path: "/api/generate", description: "Prompt-style generation.", example: "curl \"$BASE/api/generate\" -d '{\n  \"model\": \"MODEL_ID\",\n  \"prompt\": \"Why is the sky blue?\"\n}'" },
          { method: "POST", path: "/api/show", description: "Show one model's details and capabilities." },
          { method: "GET", path: "/api/ps", description: "Show the loaded model." },
          { method: "POST", path: "/api/embed", description: "Create embeddings for text_embeddings models (Ollama shape)." }
        ]
      },
      {
        name: "Model management",
        items: [
          { method: "GET", path: "/v1/ai/status", description: "Overall AI status, settings, device profile, and limitations." },
          { method: "GET", path: "/v1/ai/models", description: "Full model catalog with sizes, backends, and capabilities." },
          { method: "GET", path: "/v1/ai/runtime", description: "Loaded model and runtime state." },
          { method: "POST", path: "/v1/ai/runtime/preflight", description: "Check whether a model can load safely (ABI, memory, accelerator) before touching the runtime." },
          { method: "POST", path: "/v1/ai/runtime/load", description: "Load a model into the isolated :tai_runtime process." },
          { method: "POST", path: "/v1/ai/runtime/keep-warm", description: "Keep the loaded model resident for a set number of minutes." },
          { method: "POST", path: "/v1/ai/runtime/unload", description: "Unload the active model and free memory." },
          { method: "POST", path: "/v1/ai/models/download", description: "Download a catalog model (requires explicit terms acceptance)." }
        ]
      },
      {
        name: "LauncherCtl",
        items: [
          { method: "GET", path: "/v1/status", description: "Backend (Shizuku), notification-listener, and endpoint status." },
          { method: "GET", path: "/v1/apps", description: "The launcher's launchable activity catalog." },
          { method: "GET", path: "/v1/system/resources", description: "CPU, memory, battery, network, thermal, and storage snapshot." },
          { method: "GET", path: "/v1/notifications", description: "Cached notification list (needs listener access)." },
          { method: "GET", path: "/v1/media/now-playing", description: "Currently playing media session, when available." },
          { method: "GET", path: "/v1/agent/tools", description: "List the callable agent tools and their JSON schemas." },
          { method: "POST", path: "/v1/agent/execute", description: "Execute a named tool. Confirmation-gated for risky tools.", example: "curl -sS -H \"Authorization: Bearer $TOKEN\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"tool\":\"system.resources\",\"arguments\":{},\"confirm\":true}' \\\n  \"$BASE/v1/agent/execute\"" },
          { method: "POST", path: "/v1/auth/rotate", description: "Rotate the API token and rewrite the token and endpoint files." }
        ]
      }
    ];
    this.methodColors = {
      GET: "var(--green)",
      POST: "var(--blue)",
      DELETE: "var(--red)"
    };
  }

  mount() {
    this.buildEndpointReference();
    this.decorateWikiContent();
    this.observer = "IntersectionObserver" in window
      ? new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && this.spyMap) {
              const link = this.spyMap[entry.target.id];
              if (link) this.highlightSpy(link);
            }
          });
        }, { rootMargin: "-64px 0px -68% 0px", threshold: 0 })
      : null;

    document.addEventListener("click", (event) => this.handleClick(event));
    document.addEventListener("keydown", (event) => this.handleKey(event));
    window.addEventListener("hashchange", () => this.routeFromHash());
    window.addEventListener("popstate", () => this.routeFromHash());

    this.statTimer = window.setInterval(() => this.tickStats(), 2200);
    const initial = this.parseHash() || { view: "setup", subview: null };
    this.setView(initial.view, initial.subview, false);
  }

  parseHash() {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return null;
    const [view, subview = null] = hash.split("/");
    return this.views.includes(view) ? { view, subview } : null;
  }

  routeFromHash() {
    const route = this.parseHash();
    if (route) this.setView(route.view, route.subview, false);
  }

  handleKey(event) {
    if (event.target && /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName)) return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const viewNumber = Number.parseInt(event.key, 10);
    if (viewNumber >= 1 && viewNumber <= 4) {
      this.setView(this.views[viewNumber - 1], null, true);
    }
  }

  setView(view, subview, pushHistory) {
    if (!this.views.includes(view)) view = "setup";
    document.querySelectorAll("#tl [data-view]").forEach((element) => {
      element.style.display = element.dataset.view === view ? "block" : "none";
    });

    document.querySelectorAll("#tl [data-nav]").forEach((element) => {
      const active = element.dataset.nav === view;
      element.style.background = active ? "var(--gold)" : "transparent";
      element.style.color = active ? "#0d1012" : "var(--mute)";
      element.style.fontWeight = active ? "700" : "400";
      if (active) element.setAttribute("aria-current", "page");
      else element.removeAttribute("aria-current");
    });

    const hash = `#${view}${subview ? `/${subview}` : ""}`;
    if (pushHistory) {
      if (window.location.hash !== hash) window.history.pushState(null, "", hash);
    } else {
      window.history.replaceState(null, "", hash);
    }

    if (this.observer) this.observer.disconnect();
    this.spyMap = null;
    if (view === "wiki") this.showArticle(subview);
    if (view === "ai") this.buildSpy(document.querySelector('#tl [data-view="ai"]'));
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  showArticle(name) {
    const articles = [...document.querySelectorAll("#tl [data-article-body]")];
    const toc = document.querySelector("#tl [data-wiki-toc]");
    if (!articles.length) {
      if (toc) toc.replaceChildren();
      if (window.location.hash !== "#wiki") window.history.replaceState(null, "", "#wiki");
      return;
    }
    if (!articles.some((article) => article.dataset.articleBody === name)) {
      name = articles[0].dataset.articleBody;
    }

    articles.forEach((article) => {
      article.style.display = article.dataset.articleBody === name ? "block" : "none";
    });
    document.querySelectorAll("#tl [data-article]").forEach((button) => {
      const active = button.dataset.article === name;
      button.style.background = active ? "var(--gold-soft)" : "transparent";
      button.style.borderLeftColor = active ? "var(--gold)" : "transparent";
      button.style.color = active ? "var(--gold)" : "var(--mute)";
      button.style.fontWeight = active ? "600" : "400";
      button.setAttribute("aria-pressed", String(active));
    });

    this.buildSpy(
      document.querySelector(`#tl [data-article-body="${name}"]`),
      toc
    );
    const hash = `#wiki/${name}`;
    if (window.location.hash !== hash) window.history.replaceState(null, "", hash);
  }

  buildSpy(scope, toc) {
    if (!scope) return;
    if (this.observer) this.observer.disconnect();
    this.spyMap = {};
    if (toc) toc.replaceChildren();

    scope.querySelectorAll("[data-spy], .wiki-prose h2, .wiki-prose h3").forEach((heading) => {
      if (toc) {
        const link = document.createElement("a");
        link.textContent = heading.textContent;
        link.href = `#${heading.id}`;
        link.dataset.anchor = heading.id;
        link.style.cssText = `font-family:var(--sans);font-size:13px;line-height:1.4;text-decoration:none;color:var(--dim);cursor:pointer;padding-left:${heading.tagName === "H1" ? "0" : "10px"};transition:color .15s`;
        toc.appendChild(link);
        this.spyMap[heading.id] = link;
      }
      if (this.observer) this.observer.observe(heading);
    });
  }

  highlightSpy(activeLink) {
    Object.values(this.spyMap || {}).forEach((link) => {
      const active = link === activeLink;
      link.style.color = active ? "var(--gold)" : "var(--dim)";
      link.style.fontWeight = active ? "600" : "400";
    });
  }

  decorateWikiContent() {
    document.querySelectorAll("#tl [data-article-body]").forEach((article) => {
      const articleKey = article.dataset.articleBody;
      const usedIds = new Set();

      article.querySelectorAll(".wiki-prose h2, .wiki-prose h3").forEach((heading) => {
        const base = heading.textContent
          .toLowerCase()
          .normalize("NFKD")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") || "section";
        let id = `w-${articleKey}-${base}`;
        let suffix = 2;
        while (usedIds.has(id) || document.getElementById(id)) id = `w-${articleKey}-${base}-${suffix++}`;
        usedIds.add(id);
        heading.id = id;
      });

      article.querySelectorAll(".wiki-prose pre").forEach((pre) => {
        if (pre.dataset.cmd !== undefined) return;
        pre.dataset.cmd = "";
        const code = pre.querySelector("code") || pre;
        code.dataset.cmdText = "";
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.copy = "";
        button.className = "wiki-copy";
        button.innerHTML = "<span data-copy-label>copy</span>";
        button.setAttribute("aria-label", "Copy code");
        pre.appendChild(button);
      });

      article.querySelectorAll('.wiki-prose a[href^="http"]').forEach((link) => {
        link.target = "_blank";
        link.rel = "noopener";
      });
    });
  }

  buildEndpointReference() {
    const list = document.querySelector("#tl [data-eplist]");
    const details = document.querySelector("#tl [data-epdetail]");
    if (!list || !details) return;

    this.endpointGroups.forEach((group, groupIndex) => {
      const groupLabel = document.createElement("div");
      groupLabel.textContent = group.name;
      groupLabel.style.cssText = "font-family:var(--mono);font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--dim);margin:12px 0 4px";
      list.appendChild(groupLabel);

      const groupDetails = document.createElement("section");
      groupDetails.dataset.spy = "";
      groupDetails.id = `epg-${groupIndex}`;
      groupDetails.style.cssText = "scroll-margin-top:64px;margin-top:8px;display:flex;flex-direction:column;gap:14px";
      const title = document.createElement("h3");
      title.textContent = group.name;
      title.style.cssText = "font-family:var(--mono);font-weight:600;font-size:19px;margin:0 0 12px;color:var(--cream)";
      groupDetails.appendChild(title);

      group.items.forEach((endpoint) => {
        list.appendChild(this.createEndpointLink(endpoint, groupIndex));
        groupDetails.appendChild(this.createEndpointCard(endpoint));
      });
      details.appendChild(groupDetails);
    });
  }

  createEndpointLink(endpoint, groupIndex) {
    const button = document.createElement("button");
    button.dataset.scrollto = `epg-${groupIndex}`;
    button.style.cssText = "display:flex;align-items:center;gap:8px;width:100%;text-align:left;background:transparent;border:none;padding:5px 0;cursor:pointer";

    const method = document.createElement("span");
    method.textContent = endpoint.method;
    method.style.cssText = `font-family:var(--mono);font-size:9px;font-weight:700;color:${this.methodColors[endpoint.method] || "var(--mute)"};min-width:30px`;
    const path = document.createElement("span");
    path.textContent = endpoint.path.replace(/^.*\//, "/");
    path.style.cssText = "font-family:var(--mono);font-size:12.5px;color:var(--mute)";
    button.append(method, path);
    return button;
  }

  createEndpointCard(endpoint) {
    const card = document.createElement("article");
    card.style.cssText = "background:var(--panelink);border:1px solid var(--line);border-radius:11px;padding:16px 18px";

    const heading = document.createElement("div");
    heading.style.cssText = "display:flex;align-items:center;gap:10px;flex-wrap:wrap";
    const method = document.createElement("span");
    method.textContent = endpoint.method;
    method.style.cssText = `font-family:var(--mono);font-size:11px;font-weight:700;color:#0d1012;background:${this.methodColors[endpoint.method] || "var(--mute)"};border-radius:5px;padding:2px 8px`;
    const path = document.createElement("code");
    path.textContent = endpoint.path;
    path.style.cssText = "font-family:var(--mono);font-size:14px;color:var(--cream)";
    heading.append(method, path);

    const description = document.createElement("p");
    description.textContent = endpoint.description;
    description.style.cssText = "font-family:var(--sans);font-size:14px;color:var(--mute);line-height:1.55;margin:11px 0 0";
    card.append(heading, description);

    if (endpoint.example) {
      const command = document.createElement("div");
      command.dataset.cmd = "";
      command.style.cssText = "position:relative;background:var(--ink);border:1px solid var(--line);border-radius:8px;padding:13px;margin-top:12px";
      const copy = document.createElement("button");
      copy.dataset.copy = "";
      copy.innerHTML = "<span data-copy-label>copy</span>";
      copy.style.cssText = "position:absolute;top:8px;right:8px;font-family:var(--mono);font-size:10.5px;text-transform:uppercase;color:var(--gold);background:var(--ink);border:1px solid var(--gline);border-radius:6px;padding:4px 9px;cursor:pointer";
      const example = document.createElement("pre");
      example.dataset.cmdText = "";
      example.textContent = endpoint.example;
      example.style.cssText = "margin:0;overflow-x:auto;font-family:var(--mono);font-size:12px;line-height:1.6;color:var(--cream)";
      command.append(copy, example);
      card.appendChild(command);
    }
    return card;
  }

  handleClick(event) {
    const copyButton = event.target.closest("[data-copy]");
    if (copyButton) {
      const text = copyButton.closest("[data-cmd]")?.querySelector("[data-cmd-text]")?.textContent;
      if (text) this.copyText(text.replace(/^\s*\$\s/, "").trim(), copyButton);
      return;
    }

    const navigation = event.target.closest("[data-nav]");
    if (navigation) {
      event.preventDefault();
      const scrollTarget = navigation.dataset.scrollto;
      this.setView(navigation.dataset.nav, null, true);
      if (scrollTarget) window.setTimeout(() => this.scrollToId(scrollTarget), 80);
      return;
    }

    const article = event.target.closest("[data-article]");
    if (article) {
      this.showArticle(article.dataset.article);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const anchor = event.target.closest("[data-anchor]");
    if (anchor) {
      event.preventDefault();
      this.scrollToId(anchor.dataset.anchor);
      return;
    }

    const wikiLink = event.target.closest('.wiki-prose a[href^="#"]');
    if (wikiLink) {
      const target = wikiLink.getAttribute("href").slice(1);
      if (this.views.includes(target)) {
        event.preventDefault();
        this.setView(target, null, true);
        return;
      }
      if (document.getElementById(target)) {
        event.preventDefault();
        this.scrollToId(target);
        return;
      }
    }

    const scrollTarget = event.target.closest("[data-scrollto]");
    if (scrollTarget) {
      event.preventDefault();
      this.scrollToId(scrollTarget.dataset.scrollto);
    }
  }

  scrollToId(id) {
    const element = document.getElementById(id);
    if (!element) return;
    const top = element.getBoundingClientRect().top + window.scrollY - 58;
    window.scrollTo({ top, behavior: "smooth" });
  }

  async copyText(text, button) {
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
      else this.legacyCopy(text);
    } catch {
      this.legacyCopy(text);
    }

    const label = button.querySelector("[data-copy-label]") || button;
    const original = label.textContent;
    label.textContent = "copied";
    button.style.color = "var(--green)";
    button.style.borderColor = "var(--green)";
    window.clearTimeout(button.resetTimer);
    button.resetTimer = window.setTimeout(() => {
      label.textContent = original;
      button.style.color = "var(--gold)";
      button.style.borderColor = "var(--gline)";
    }, 1300);
  }

  legacyCopy(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  tickStats() {
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const step = (amount) => Math.round((Math.random() * 2 - 1) * amount);
    this.stats.cpu = clamp(this.stats.cpu + step(9), 6, 57);
    this.stats.ram = clamp(this.stats.ram + step(4), 55, 72);
    if (Math.random() < 0.28) this.stats.temp = clamp(this.stats.temp + step(1), 39, 43);

    const setValue = (key, value) => {
      const element = document.querySelector(`#tl [data-wval="${key}"]`);
      if (element) element.textContent = value;
    };
    setValue("cpu", `${this.stats.cpu}%`);
    setValue("ram", `${this.stats.ram}%`);
    setValue("temp", `${this.stats.temp}°`);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new TermuxLauncherSite().mount();
});
