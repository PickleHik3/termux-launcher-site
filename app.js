"use strict";

class TermuxLauncherSite {
  constructor() {
    this.views = ["setup", "wiki", "ai"];
    this.spyMap = null;
    this.observer = null;
    this.stats = { cpu: 24, ram: 61, temp: 41 };
    this.staticWikiFiles = [
      "get-started", "home-screen", "notifications", "layout", "look",
      "keyboard", "extra-keys", "terminal", "panes", "command-palette", "fonts",
      "tlstore", "on-device-ai", "voice", "display", "keybindings",
      "action-reference", "keyboard-layout", "config", "permissions", "nix"
    ];
    // Old keys from before the docs rework resolve here, then the hash is
    // rewritten with replaceState. "backup" had a page that was removed, so
    // it (and any other unknown key) falls back to the docs landing.
    this.wikiAliases = {
      overview: "get-started",
      install: "home-screen",
      shell: "keyboard",
      surface: "terminal",
      tour: "command-palette",
      "shell-goodies": "tlstore",
      tai: "on-device-ai",
      tmux: "config",
      launcherctl: "permissions",
      backup: "landing"
    };
    this.docsHomeGroups = [
      "Start here", "Everyday", "Typing", "Terminal", "Extras", "Reference"
    ];
    // Mirrors _data/docs_home.yml, for the non-Jekyll static fallback only
    // (hydrateStaticWiki, when the wiki view is served without a Liquid
    // build). Jekyll builds read the YAML file directly.
    this.docsHomeStatic = {
      moves: [
        { n: 1, gesture: "Hold a pane corner", body: "The corner tab opens; tap ? to see what every control does." },
        { n: 2, gesture: "Hold the dock", body: "Choose your pinned apps." },
        { n: 3, gesture: "Pull down on the dock", body: "The app drawer; Home brings you back." },
        { n: 4, gesture: "Tap the keyboard key on the key row", body: "Hide or show the keyboard." },
        { n: 5, gesture: "Swipe up on the space bar", body: "The command palette." },
        { n: 6, gesture: "Hold on terminal text", body: "Select and copy; in htop or nvim your finger becomes the mouse." },
        { n: 7, gesture: "Hold Ctrl + Alt", body: "Every key shows its shortcut." },
        { n: 8, gesture: "Swipe along the status bar", body: "Terminal, Home screen, Linux display." }
      ],
      beyond: [
        { key: "notifications", title: "Essential notifications", line: "Only what matters reaches the status bar." },
        { key: "home-screen", title: "Home screen & widgets", line: "Widget pages, drawer layouts, folders, A-Z scrub." },
        { key: "layout", title: "Layout & full screen", line: "Layout editor, minimal mode, hide the system bars." },
        { key: "look", title: "Look & themes", line: "Appearance editor, wallpaper colours, Fancier Glass." },
        { key: "keyboard", title: "Your keyboard", line: "Floating, split, swipe away, your own layout, voice." },
        { key: "extra-keys", title: "Extra keys", line: "Edit the key row, presets, pages, actions." },
        { key: "terminal", title: "Terminal power", line: "Panes, pictures, big text, links, clipboard history." },
        { key: "tlstore", title: "tlstore", line: "fastfetch with GIFs, Claude Code, sigye, btop." },
        { key: "on-device-ai", title: "On-device AI", line: "Run a model on the phone, point any AI app at it." },
        { key: "voice", title: "Voice & speech", line: "Dictation, cleanup, read aloud. All local." },
        { key: "display", title: "Linux display", line: "Desktop apps in the drawer, opened with a tap." }
      ],
      editions: [
        { name: "com.termux", note: "Recommended" },
        { name: "com.termux.launcher.nix", note: "Nix edition" },
        { name: "io.vaj.tl", note: "Deprecated, migrate", href: "migrate-vaj.html" }
      ],
      reference: [
        { key: "keybindings", title: "Keybindings config" },
        { key: "action-reference", title: "Action reference" },
        { key: "keyboard-layout", title: "Keyboard layout schema" },
        { key: "config", title: "Config files" },
        { key: "permissions", title: "Permissions & Shizuku" },
        { key: "nix", title: "Nix edition" },
        { title: "Termux AI API", href: "#ai" }
      ]
    };
    this.terminalLines = [
      "launcherctl launch signal",
      "tai load gemma-4-e2b-it-litert-lm",
      "kew --sixel",
      "tai status"
    ];
    this.endpointGroups = [
      {
        name: "OpenAI-compatible",
        items: [
          { method: "GET", path: "/v1/models", description: "List installed, loadable models and their capabilities. Multimodal LiteRT-LM models also appear as separate -vision and -audio model IDs.", example: "curl -sS -H \"Authorization: Bearer $TOKEN\" \\\n  \"$OPENAI_BASE_URL/models\" | jq .", response: "{\n  \"object\": \"list\",\n  \"data\": [\n    {\n      \"id\": \"gemma-4-e2b-it-litert-lm\",\n      \"object\": \"model\",\n      \"owned_by\": \"termux-launcher\",\n      \"_backend\": \"litert-lm\",\n      \"_capabilities\": [\"text_chat\", \"tool_use\", \"image_input\", \"audio_input\"]\n    }\n  ]\n}" },
          { method: "GET", path: "/v1/models/{id}", description: "Return the OpenAI-compatible model object for one installed model ID." },
          { method: "POST", path: "/v1/chat/completions", description: "Chat Completions — text, image/audio input, and tools. Set \"stream\": true for token-by-token Server-Sent Events.", params: "Body: <b>model</b>, <b>messages</b>[], optional <b>stream</b>, <b>tools</b>, <b>temperature</b>, <b>max_tokens</b>.", example: "curl -sS -H \"Authorization: Bearer $TOKEN\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"model\":\"MODEL_ID\",\"messages\":[{\"role\":\"user\",\"content\":\"hi\"}]}' \\\n  \"$OPENAI_BASE_URL/chat/completions\"", note: "60 requests / minute. Requires a chat model loaded (tai load MODEL_ID)." },
          { method: "POST", path: "/v1/responses", description: "OpenAI Responses API — the newer input/output shape used by Codex and recent clients. Accepts a string or structured input and supports tools and streaming.", params: "Body: <b>model</b>, <b>input</b> (string or content array), optional <b>stream</b>, <b>tools</b>.", example: "curl -sS -H \"Authorization: Bearer $TOKEN\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"model\":\"MODEL_ID\",\"input\":\"Say hi in one word.\"}' \\\n  \"$OPENAI_BASE_URL/responses\"", note: "60 requests / minute." },
          { method: "POST", path: "/v1/completions", description: "Legacy text completions (prompt in, text out). Prefer chat/completions or responses for new work.", note: "60 requests / minute." },
          { method: "POST", path: "/v1/embeddings", description: "Embeddings for models that advertise text_embeddings (e.g. embeddinggemma-300m, 768-dim). Returns OpenAI-shape float vectors.", params: "Body: <b>model</b>, <b>input</b> (string or string[]), optional <b>encoding_format</b>, <b>dimensions</b>.", example: "curl -sS -H \"Authorization: Bearer $TOKEN\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"model\":\"embeddinggemma-300m\",\"input\":\"hello world\"}' \\\n  \"$OPENAI_BASE_URL/embeddings\"", response: "{\n  \"object\": \"list\",\n  \"model\": \"embeddinggemma-300m\",\n  \"data\": [\n    { \"object\": \"embedding\", \"index\": 0, \"embedding\": [-0.0251, 0.0404, 0.0088, \"...768 floats\"] }\n  ],\n  \"usage\": { \"prompt_tokens\": 6, \"total_tokens\": 6 }\n}", note: "60 requests / minute. Embedding models are served on demand — you do NOT load them via runtime/load (that path is for generation models only)." },
          { method: "POST", path: "/v1/audio/speech", description: "Present for OpenAI SDK compatibility only. Always returns HTTP 501 unsupported_audio_output — there is no local text-to-speech runner.", response: "HTTP 501\n{\n  \"error\": {\n    \"type\": \"api_error\",\n    \"code\": \"unsupported_audio_output\",\n    \"message\": \"Audio output is not available from the local LiteRT-LM or MNN runners.\"\n  }\n}" }
        ]
      },
      {
        name: "Ollama-compatible",
        items: [
          { method: "GET", path: "/api/version", description: "Server version string. Reports an Ollama-compatible version so Ollama clients accept the endpoint.", response: "{ \"version\": \"0.13.3-termux-launcher\" }" },
          { method: "GET", path: "/api/tags", description: "List installed models in Ollama shape (name, size, digest, details)." },
          { method: "GET", path: "/api/ps", description: "List currently loaded models. Empty array when nothing is resident.", response: "{ \"models\": [] }" },
          { method: "POST", path: "/api/chat", description: "Chat and tool calls, Ollama shape. Streams newline-delimited JSON (NDJSON) unless \"stream\": false.", note: "60 requests / minute." },
          { method: "POST", path: "/api/generate", description: "Prompt-style generation, Ollama shape.", example: "curl \"$BASE/api/generate\" -d '{\n  \"model\": \"MODEL_ID\",\n  \"prompt\": \"Why is the sky blue?\"\n}'", note: "60 requests / minute." },
          { method: "POST", path: "/api/show", description: "Show one model's details and capabilities.", params: "Body: <b>model</b>." },
          { method: "POST", path: "/api/embed", description: "Create embeddings for text_embeddings models, Ollama shape.", params: "Body: <b>model</b>, <b>input</b> (string or string[]).", response: "{\n  \"model\": \"embeddinggemma-300m\",\n  \"embeddings\": [ [-0.0251, 0.0404, 0.0088, \"...768 floats\"] ]\n}", note: "60 requests / minute. Served on demand — no runtime/load needed." },
          { method: "POST", path: "/api/embeddings", description: "Legacy Ollama embeddings alias.", params: "Body: <b>model</b>, <b>prompt</b>.", response: "{ \"embedding\": [0.012, -0.034, \"...floats\"] }" },
          { method: "POST", path: "/api/pull", description: "Not supported — returns 501 unsupported_registry_operation. Use the model import flow in settings instead.", response: "HTTP 501" },
          { method: "POST", path: "/api/create", description: "Not supported — returns 501 unsupported_registry_operation. Use the model import flow in settings instead.", response: "HTTP 501" },
          { method: "POST", path: "/api/push", description: "Not supported — returns 501 unsupported_registry_operation. Use the model import flow in settings instead.", response: "HTTP 501" },
          { method: "POST", path: "/api/copy", description: "Not supported — returns 501 unsupported_registry_operation. Use the model import flow in settings instead.", response: "HTTP 501" },
          { method: "POST", path: "/api/delete", description: "Not supported — returns 501 unsupported_registry_operation. Use the model import flow in settings instead.", response: "HTTP 501" }
        ]
      },
      {
        name: "Model management",
        items: [
          { method: "GET", path: "/v1/ai/status", description: "Overall AI status: runtime state, active settings/roles, device profile, and capability limitations.", response: "{\n  \"ok\": true,\n  \"name\": \"TAI\",\n  \"runtime\": {\n    \"loaded\": false,\n    \"loadedModelId\": null,\n    \"runtimeName\": \"litert-lm\",\n    \"state\": \"unloaded\",\n    \"backend\": \"none\"\n  },\n  \"settings\": { \"roles\": { \"...\": \"...\" } }\n}" },
          { method: "GET", path: "/v1/ai/models", description: "Full model catalog with display names, sizes, licenses, and per-model runtime profiles (compatible accelerators, context sizes)." },
          { method: "GET", path: "/v1/ai/models/downloads", description: "List in-progress and queued model downloads with source URLs and target paths." },
          { method: "GET", path: "/v1/ai/runtime", description: "Loaded model and runtime state (backend, keep-warm/idle timers, active generation).", response: "{\n  \"ok\": true,\n  \"runtime\": {\n    \"loaded\": true,\n    \"loadedModelId\": \"MODEL_ID\",\n    \"state\": \"ready\",\n    \"backend\": \"gpu\",\n    \"keepWarmRemainingMs\": 0\n  }\n}" },
          { method: "POST", path: "/v1/ai/runtime/preflight", description: "Check whether a model can load safely (ABI, memory, accelerator) without touching the runtime.", params: "Body: <b>model</b> (or <b>modelId</b>)." },
          { method: "POST", path: "/v1/ai/runtime/load", description: "Load a model into the isolated :tai_runtime process. Only one generation model is resident at a time.", params: "Body: <b>model</b> (or <b>modelId</b>), optional <b>accelerator</b>: auto | cpu | gpu.", example: "curl -sS -H \"Authorization: Bearer $TOKEN\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"model\":\"MODEL_ID\",\"accelerator\":\"auto\"}' \\\n  \"$BASE/v1/ai/runtime/load\"", note: "20 requests / minute. Heavy — allocates GPU/CPU memory." },
          { method: "POST", path: "/v1/ai/runtime/keep-warm", description: "Keep the loaded model resident for a set number of minutes instead of unloading on idle.", params: "Body: <b>minutes</b> (or <b>keepWarmMinutes</b>), optional <b>model</b>." },
          { method: "POST", path: "/v1/ai/runtime/unload", description: "Unload the active model and free its memory." },
          { method: "POST", path: "/v1/ai/runtime/cancel", description: "Cancel an in-flight load or generation on the runtime." },
          { method: "POST", path: "/v1/ai/models/download", description: "Download a catalog model by URL. Gated models require explicit terms acceptance.", params: "Body: <b>model</b> (or <b>modelId</b>), <b>url</b>, <b>acceptedTerms</b>: true.", note: "20 requests / minute. Downloads are several GB." },
          { method: "POST", path: "/v1/ai/models/download-catalog", description: "Download a built-in catalog entry by its catalog ID.", params: "Body: <b>modelId</b> (or <b>model</b>)." },
          { method: "POST", path: "/v1/ai/models/import", description: "Register a model from a Hugging Face repo URL or a local package path, with per-capability flags.", params: "Body: <b>model</b>/<b>modelId</b>, <b>url</b> or <b>path</b>, optional <b>displayName</b>, <b>roleHint</b>, <b>license</b>, <b>backend</b>, <b>autoLoad</b>." },
          { method: "POST", path: "/v1/ai/models/delete", description: "Delete a downloaded or imported model and its files.", params: "Body: <b>model</b> (or <b>modelId</b>).", note: "Destructive — removes model files from disk." },
          { method: "POST", path: "/v1/ai/models/load", description: "Alias for /v1/ai/runtime/load: load a generation model into the registry slot.", params: "Body: <b>model</b> (or <b>modelId</b>), optional <b>accelerator</b>: auto | cpu | gpu." },
          { method: "POST", path: "/v1/ai/models/unload", description: "Alias for /v1/ai/runtime/unload: unload the active generation model." },
          { method: "POST", path: "/v1/ai/models/downloads/cancel", description: "Cancel an in-progress model download.", params: "Body: <b>modelId</b> (or download <b>id</b>)." }
        ]
      },
      {
        name: "Launcher",
        items: [
          { method: "POST", path: "/v1/apps/launch", description: "Launch an app by fuzzy query, resolved against the app catalog. Exact package or activity matches rank before labels; ties return 409 with a candidates array. This is what launcherctl launch calls.", params: "Body: <b>query</b> (app name, package, or activity).", example: "curl -sS -H \"Authorization: Bearer $TOKEN\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"query\":\"maps\"}' \\\n  \"$BASE/v1/apps/launch\"", note: "30 requests / minute." },
          { method: "POST", path: "/v1/auth/rotate", description: "Rotate the API token and rewrite ~/.launcherctl/token and ~/.launcherctl/endpoint. All existing clients must re-read the new token.", note: "5 requests / minute. Invalidates the current token immediately." }
        ]
      }
    ];
  }

  async mount() {
    void this.hydrateGitHubData();
    this.startHeroTerminal();
    // The endpoint reference depends on nothing async; build it before the
    // wiki fetches so the Termux AI view has its full height on first paint
    // instead of growing by a few thousand pixels once 17 markdown files land.
    this.buildEndpointReference();
    await this.hydrateStaticWiki();
    this.decorateWikiContent();
    this.buildSearchIndex();
    this.wireSearch();
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
    this.wireShowcaseClips();
    const initial = this.parseHash() || { view: "setup", subview: null };
    this.setView(initial.view, initial.subview, false);
  }

  // Wiki clips carry preload="none" and only play while on screen, so opening
  // a docs page does not start every recording in it at once.
  wireShowcaseClips() {
    const clips = [...document.querySelectorAll("#tl video[data-autoplay]")];
    if (!clips.length) return;
    if (!("IntersectionObserver" in window)) {
      clips.forEach((video) => video.play().catch(() => {}));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) video.play().catch(() => {});
        else if (!video.paused) video.pause();
      });
    }, { rootMargin: "160px 0px", threshold: 0 });
    clips.forEach((video) => observer.observe(video));
  }

  startHeroTerminal() {
    const output = document.querySelector("[data-terminal-line]");
    if (!output) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      output.textContent = this.terminalLines[0];
      return;
    }

    let lineIndex = 0;
    let characterIndex = 0;
    let deleting = false;
    const tick = () => {
      const line = this.terminalLines[lineIndex];
      characterIndex += deleting ? -1 : 1;
      output.textContent = line.slice(0, Math.max(0, characterIndex));
      let delay = deleting ? 24 : 54;
      if (!deleting && characterIndex >= line.length) {
        deleting = true;
        delay = 1450;
      } else if (deleting && characterIndex <= 0) {
        deleting = false;
        lineIndex = (lineIndex + 1) % this.terminalLines.length;
        delay = 320;
      }
      window.setTimeout(tick, delay);
    };
    window.setTimeout(tick, 280);
  }

  async hydrateGitHubData() {
    const repositories = [
      { name: "PickleHik3/termux-launcher", includeStars: false },
      { name: "PickleHik3/termux-api", includeStars: false },
      { name: "PickleHik3/termux-styling", includeStars: false }
    ];

    await Promise.allSettled(repositories.map(async ({ name, includeStars }) => {
      const requests = [this.fetchGitHubJson(`/repos/${name}/releases?per_page=20`)];
      if (includeStars) requests.push(this.fetchGitHubJson(`/repos/${name}`));
      const [releases, repository] = await Promise.all(requests);

      if (includeStars && Number.isFinite(repository?.stargazers_count)) {
        document.querySelectorAll("[data-github-stars]").forEach((element) => {
          element.textContent = repository.stargazers_count.toLocaleString("en-US");
          element.title = "Live from GitHub";
        });
      }

      const published = Array.isArray(releases)
        ? releases.filter((release) => !release.draft && !release.prerelease && typeof release.tag_name === "string")
        : [];
      this.applyReleaseData(`${name}:main`, published.find((release) => !/-(vaj|nix)$/i.test(release.tag_name)));
      this.applyReleaseData(`${name}:vaj`, published.find((release) => /-vaj$/i.test(release.tag_name)));
      // The Nix edition publishes as prereleases, so it gets its own pool.
      const includingPrereleases = Array.isArray(releases)
        ? releases.filter((release) => !release.draft && typeof release.tag_name === "string")
        : [];
      this.applyReleaseData(`${name}:nix`, includingPrereleases.find((release) => /-nix$/i.test(release.tag_name)));
    }));
  }

  async fetchGitHubJson(path) {
    const response = await fetch(`https://api.github.com${path}`, {
      headers: { Accept: "application/vnd.github+json" }
    });
    if (!response.ok) throw new Error(`GitHub request failed: ${response.status}`);
    return response.json();
  }

  applyReleaseData(key, release) {
    if (!release?.tag_name || !release?.html_url) return;
    let releaseUrl;
    try {
      releaseUrl = new URL(release.html_url);
    } catch {
      return;
    }
    if (releaseUrl.origin !== "https://github.com") return;

    document.querySelectorAll("[data-release-tag]").forEach((element) => {
      if (element.dataset.releaseTag === key) {
        element.textContent = release.tag_name;
        element.title = "Live from GitHub releases";
      }
    });
    document.querySelectorAll("[data-release-link]").forEach((element) => {
      if (element.dataset.releaseLink === key) element.href = releaseUrl.href;
    });
  }

  async hydrateStaticWiki() {
    const wikiView = document.querySelector('#tl [data-view="wiki"]');
    const placeholder = wikiView?.querySelector("[data-article-body]");
    const needsFallback = placeholder?.dataset.articleBody?.includes("{{")
      || wikiView?.textContent.includes("{% assign wiki_articles");
    if (!wikiView || !needsFallback) return;

    const documents = (await Promise.all(this.staticWikiFiles.map(async (key) => {
      try {
        const response = await fetch(`_wiki/${key}.md`);
        if (!response.ok) return null;
        return this.parseWikiDocument(key, await response.text());
      } catch {
        return null;
      }
    }))).filter(Boolean).sort((a, b) => a.order - b.order);

    this.stripLiquidText(wikiView);
    const sidebar = wikiView.querySelector(".wiki-sidebar nav");
    const main = wikiView.querySelector("[data-wiki-content]");
    if (!sidebar || !main) return;

    sidebar.replaceChildren();
    main.replaceChildren();

    if (!documents.length) {
      const empty = document.createElement("div");
      empty.className = "wiki-empty";
      empty.innerHTML = '<div class="wiki-kicker">DOCUMENTATION</div><h1>Docs unavailable</h1><p>Run the site from its project root so the wiki files can be loaded.</p>';
      main.appendChild(empty);
      return;
    }

    this.docsHomeGroups.forEach((group, groupIndex) => {
      const label = document.createElement("div");
      label.className = "wiki-group-label";
      label.textContent = group;
      sidebar.appendChild(label);

      if (groupIndex === 0) {
        const home = document.createElement("button");
        home.type = "button";
        home.dataset.article = "landing";
        home.className = "wiki-article-button";
        home.textContent = "Docs home";
        sidebar.appendChild(home);
      }

      documents.filter((doc) => doc.group === group).forEach((doc) => {
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.article = doc.key;
        button.className = "wiki-article-button";
        button.textContent = doc.title;
        sidebar.appendChild(button);
      });
    });
    const indicator = document.createElement("i");
    indicator.className = "wiki-sidebar-indicator";
    indicator.setAttribute("aria-hidden", "true");
    sidebar.appendChild(indicator);

    main.appendChild(this.buildStaticLandingArticle());

    documents.forEach((doc) => {
      const article = document.createElement("article");
      article.dataset.articleBody = doc.key;
      article.style.display = "none";

      const kicker = document.createElement("div");
      kicker.className = "wiki-kicker";
      kicker.textContent = "DOCUMENTATION";

      const heading = document.createElement("h1");
      heading.dataset.spy = "";
      heading.id = `w-${doc.key}`;
      heading.textContent = doc.title;

      const meta = document.createElement("div");
      meta.className = "wiki-article-meta";
      meta.innerHTML = '<span data-article-meta></span><i></i>';

      const prose = document.createElement("div");
      prose.className = "wiki-prose";
      prose.innerHTML = this.markdownToHtml(doc.body);

      article.append(kicker, heading, meta, prose);
      main.appendChild(article);
    });
  }

  // Mirrors the Liquid-built landing block for the non-Jekyll fallback path,
  // from this.docsHomeStatic (kept in step with _data/docs_home.yml by hand).
  buildStaticLandingArticle() {
    const article = document.createElement("article");
    article.dataset.articleBody = "landing";
    article.className = "wiki-landing";
    article.style.display = "block";

    const kicker = document.createElement("div");
    kicker.className = "wiki-kicker";
    kicker.dataset.reveal = "";
    kicker.textContent = "Documentation";

    const h1 = document.createElement("h1");
    h1.dataset.reveal = "";
    h1.textContent = "Everything the tour did not show you";

    const lead = document.createElement("p");
    lead.className = "wiki-landing-lead";
    lead.dataset.reveal = "";
    lead.textContent = "The in-app tour teaches eight moves. Below: a recap of all of them, then the features the tour leaves out.";

    const searchBlock = document.createElement("div");
    searchBlock.className = "wiki-search wiki-landing-search";
    searchBlock.dataset.search = "";
    searchBlock.innerHTML = `
      <label class="wiki-search-label" for="wiki-landing-search">Search docs</label>
      <input class="wiki-search-input" type="text" id="wiki-landing-search" data-search-input
        placeholder="Search docs…" autocomplete="off" role="combobox" aria-autocomplete="list"
        aria-controls="wiki-landing-search-results" aria-expanded="false">
      <div class="search-results" data-search-results id="wiki-landing-search-results" role="listbox" hidden></div>
    `;

    const tourSection = document.createElement("section");
    tourSection.className = "wiki-landing-section";
    tourSection.dataset.reveal = "";
    const tourHeading = document.createElement("h2");
    tourHeading.textContent = "The tour on one page";
    const moves = document.createElement("ol");
    moves.className = "tour-moves";
    moves.dataset.revealStagger = "";
    moves.setAttribute("aria-label", "The eight moves the in-app tour teaches");
    this.docsHomeStatic.moves.forEach((move) => {
      const li = document.createElement("li");
      li.className = "tour-move glass glass--sm";
      li.innerHTML = `<span class="tour-move-n" aria-hidden="true">${move.n}</span><span class="tour-move-gesture">${this.escapeHtml(move.gesture)}</span><span class="tour-move-body">${this.escapeHtml(move.body)}</span>`;
      moves.appendChild(li);
    });
    const caption = document.createElement("p");
    caption.className = "tour-moves-caption";
    caption.textContent = "Replay any time: Settings → About & support → Play the tour again.";
    tourSection.append(tourHeading, moves, caption);

    const beyondSection = document.createElement("section");
    beyondSection.className = "wiki-landing-section";
    beyondSection.dataset.reveal = "";
    const beyondHeading = document.createElement("h2");
    beyondHeading.textContent = "Beyond the tour";
    const beyondGrid = document.createElement("div");
    beyondGrid.className = "beyond-grid";
    beyondGrid.dataset.revealStagger = "";
    this.docsHomeStatic.beyond.forEach((card, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "beyond-card glass glass--sm";
      button.dataset.article = card.key;
      button.innerHTML = `<span class="beyond-card-rank" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span><span class="beyond-card-title">${this.escapeHtml(card.title)}</span><span class="beyond-card-line">${this.escapeHtml(card.line)}</span>`;
      beyondGrid.appendChild(button);
    });
    beyondSection.append(beyondHeading, beyondGrid);

    const editionSection = document.createElement("section");
    editionSection.className = "wiki-landing-section";
    editionSection.dataset.reveal = "";
    const editionHeading = document.createElement("h2");
    editionHeading.textContent = "Pick an edition";
    const editionStrip = document.createElement("div");
    editionStrip.className = "edition-strip";
    editionStrip.dataset.revealStagger = "";
    this.docsHomeStatic.editions.forEach((ed) => {
      const el = document.createElement(ed.href ? "a" : "button");
      el.className = "edition-chip glass glass--sm";
      if (ed.href) el.href = ed.href;
      else {
        el.type = "button";
        el.dataset.nav = "setup";
        el.dataset.scrollto = "tl-install";
      }
      el.innerHTML = `<span class="edition-chip-name">${this.escapeHtml(ed.name)}</span><span class="edition-chip-note">${this.escapeHtml(ed.note)}</span>`;
      editionStrip.appendChild(el);
    });
    const getStarted = document.createElement("button");
    getStarted.type = "button";
    getStarted.className = "link-slide wiki-landing-getstarted";
    getStarted.dataset.article = "get-started";
    getStarted.textContent = "Get started guide →";
    editionSection.append(editionHeading, editionStrip, getStarted);

    const referenceSection = document.createElement("section");
    referenceSection.className = "wiki-landing-section";
    referenceSection.dataset.reveal = "";
    const referenceHeading = document.createElement("h2");
    referenceHeading.textContent = "Reference";
    const shelf = document.createElement("div");
    shelf.className = "reference-shelf";
    shelf.dataset.revealStagger = "";
    this.docsHomeStatic.reference.forEach((ref) => {
      const el = document.createElement(ref.key ? "button" : "a");
      el.className = "reference-pill";
      if (ref.key) { el.type = "button"; el.dataset.article = ref.key; el.textContent = ref.title; }
      else { el.href = ref.href; el.dataset.nav = "ai"; el.textContent = `${ref.title} ↗`; }
      shelf.appendChild(el);
    });
    referenceSection.append(referenceHeading, shelf);

    article.append(kicker, h1, lead, searchBlock, tourSection, beyondSection, editionSection, referenceSection);
    return article;
  }

  stripLiquidText(scope) {
    [...scope.childNodes].forEach((node) => {
      if (node.nodeType === 3 && /\{[{%]/.test(node.textContent || "")) {
        node.remove();
        return;
      }
      if (node.nodeType === 1) this.stripLiquidText(node);
    });
  }

  parseWikiDocument(key, source) {
    const normalized = source.replace(/\r\n/g, "\n");
    const match = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    const metadata = {};
    const frontMatter = match ? match[1] : "";
    frontMatter.split("\n").forEach((line) => {
      const separator = line.indexOf(":");
      if (separator < 0) return;
      const name = line.slice(0, separator).trim();
      const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, "");
      metadata[name] = value;
    });
    return {
      key,
      title: metadata.title || key,
      group: metadata.group || "",
      order: Number.parseInt(metadata.order || "999", 10),
      body: match ? match[2].trim() : normalized.trim()
    };
  }

  escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  inlineMarkdown(value) {
    const codeTokens = [];
    let text = this.escapeHtml(value);
    text = text.replace(/`([^`]+)`/g, (_match, code) => {
      const token = `@@CODE${codeTokens.length}@@`;
      codeTokens.push(`<code>${code}</code>`);
      return token;
    });
    text = text.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+&quot;[^&]*&quot;)?\)/g, '<img src="$2" alt="$1">');
    text = text.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+&quot;[^&]*&quot;)?\)/g, '<a href="$2">$1</a>');
    text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/__([^_]+)__/g, "<strong>$1</strong>");
    text = text.replace(/(^|\s)\*([^*]+)\*(?=\s|$|[.,;:!?])/g, "$1<em>$2</em>");
    codeTokens.forEach((html, index) => {
      text = text.replace(`@@CODE${index}@@`, html);
    });
    return text;
  }

  markdownToHtml(markdown) {
    const lines = markdown.replace(/\r\n/g, "\n").split("\n");
    const html = [];
    const isTableDivider = (line) => /^\s*\|?\s*:?-{3,}/.test(line) && line.includes("|");
    const cells = (line) => line.trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim());
    let index = 0;

    while (index < lines.length) {
      const line = lines[index];
      if (!line.trim()) { index += 1; continue; }

      const fence = line.match(/^```\s*([^\s]*)/);
      if (fence) {
        const code = [];
        index += 1;
        while (index < lines.length && !/^```/.test(lines[index])) code.push(lines[index++]);
        if (index < lines.length) index += 1;
        const language = fence[1] ? ` class="language-${this.escapeHtml(fence[1])}"` : "";
        html.push(`<pre><code${language}>${this.escapeHtml(code.join("\n"))}</code></pre>`);
        continue;
      }

      const heading = line.match(/^(#{2,4})\s+(.+)$/);
      if (heading) {
        const level = Math.min(heading[1].length, 4);
        html.push(`<h${level}>${this.inlineMarkdown(heading[2])}</h${level}>`);
        index += 1;
        continue;
      }

      if (index + 1 < lines.length && line.includes("|") && isTableDivider(lines[index + 1])) {
        const headings = cells(line);
        index += 2;
        const rows = [];
        while (index < lines.length && lines[index].trim() && lines[index].includes("|")) rows.push(cells(lines[index++]));
        html.push(`<table><thead><tr>${headings.map((cell) => `<th>${this.inlineMarkdown(cell)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${this.inlineMarkdown(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table>`);
        continue;
      }

      const listMatch = line.match(/^\s*(?:([-*])|(\d+)\.)\s+(.+)$/);
      if (listMatch) {
        const ordered = Boolean(listMatch[2]);
        const tag = ordered ? "ol" : "ul";
        const items = [];
        while (index < lines.length) {
          const item = lines[index].match(/^\s*(?:([-*])|(\d+)\.)\s+(.+)$/);
          if (!item || Boolean(item[2]) !== ordered) break;
          items.push(`<li>${this.inlineMarkdown(item[3])}</li>`);
          index += 1;
        }
        html.push(`<${tag}>${items.join("")}</${tag}>`);
        continue;
      }

      if (/^>\s?/.test(line)) {
        const quote = [];
        while (index < lines.length && /^>\s?/.test(lines[index])) quote.push(lines[index++].replace(/^>\s?/, ""));
        html.push(`<blockquote><p>${this.inlineMarkdown(quote.join(" "))}</p></blockquote>`);
        continue;
      }

      if (/^---+$/.test(line.trim())) {
        html.push("<hr>");
        index += 1;
        continue;
      }

      const paragraph = [line.trim()];
      index += 1;
      while (index < lines.length && lines[index].trim()) {
        const next = lines[index];
        if (/^(#{2,4})\s+|^```|^>\s?|^\s*(?:[-*]|\d+\.)\s+/.test(next)) break;
        if (index + 1 < lines.length && next.includes("|") && isTableDivider(lines[index + 1])) break;
        paragraph.push(next.trim());
        index += 1;
      }
      html.push(`<p>${this.inlineMarkdown(paragraph.join(" "))}</p>`);
    }

    return html.join("\n");
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
    if (event.key === "/") {
      event.preventDefault();
      this.openSearch();
      return;
    }
    const viewNumber = Number.parseInt(event.key, 10);
    if (viewNumber >= 1 && viewNumber <= this.views.length) {
      this.setView(this.views[viewNumber - 1], null, true);
    }
  }

  setView(view, subview, pushHistory) {
    if (!this.views.includes(view)) view = "setup";
    document.querySelectorAll("#tl [data-view]").forEach((element) => {
      element.style.display = element.dataset.view === view ? "block" : "none";
    });

    document.querySelectorAll("#tl .nav-tabs [data-nav]").forEach((element) => {
      const active = element.dataset.nav === view;
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
    // motion.js listens for this to re-bind reveals and refresh ScrollTrigger.
    document.dispatchEvent(new CustomEvent("tl:viewchange", { detail: { view, subview } }));
  }

  showArticle(name) {
    const articles = [...document.querySelectorAll("#tl [data-article-body]")];
    const toc = document.querySelector("#tl [data-wiki-toc]");
    if (!articles.length) {
      if (toc) toc.replaceChildren();
      if (window.location.hash !== "#wiki") window.history.replaceState(null, "", "#wiki");
      return;
    }
    // Old keys resolve through the alias map; anything left unrecognised
    // (including no key at all) falls back to the docs landing block.
    let resolved = name ? this.wikiAliases[name] || name : "landing";
    if (!articles.some((article) => article.dataset.articleBody === resolved)) {
      resolved = "landing";
    }
    name = resolved;

    articles.forEach((article) => {
      article.style.display = article.dataset.articleBody === name ? "block" : "none";
    });
    document.querySelectorAll("#tl [data-article]").forEach((button) => {
      const active = button.dataset.article === name;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    this.buildSpy(
      document.querySelector(`#tl [data-article-body="${name}"]`),
      toc
    );
    const hash = name === "landing" ? "#wiki" : `#wiki/${name}`;
    if (window.location.hash !== hash) window.history.replaceState(null, "", hash);
  }

  buildSpy(scope, toc) {
    if (!scope) return;
    if (this.observer) this.observer.disconnect();
    this.spyMap = {};
    if (toc) toc.replaceChildren();

    const headings = toc
      ? scope.querySelectorAll(".wiki-prose h2, .wiki-prose h3")
      : scope.querySelectorAll("[data-spy]");
    headings.forEach((heading) => {
      if (toc) {
        const link = document.createElement("a");
        link.textContent = heading.textContent;
        link.href = `#${heading.id}`;
        link.dataset.anchor = heading.id;
        link.className = heading.tagName === "H3" ? "wiki-toc-h3" : "wiki-toc-h2";
        toc.appendChild(link);
        this.spyMap[heading.id] = link;
      }
      if (this.observer) this.observer.observe(heading);
    });
  }

  highlightSpy(activeLink) {
    Object.values(this.spyMap || {}).forEach((link) => {
      const active = link === activeLink;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }

  // Wiki pages embed recordings with a fenced ```clip block so the markdown
  // stays plain text for the content manager. Two render paths produce two
  // shapes: the local markdownToHtml fallback emits <pre><code
  // class="language-clip">, while kramdown + rouge wraps it in
  // <div class="language-clip highlighter-rouge">. Handle both.
  //
  // Fields: name (a clip in assets/showcase/features, framed as a product
  // card and cropped to the bezel), src (a path prefix for any other
  // recording, shown at its own aspect ratio), image (a single screenshot or
  // gif file, shown framed), or todo (no asset captured yet - renders a
  // labelled placeholder frame so the gap is visible instead of silent).
  // Optional: title, caption, formats, shape: wide (landscape placeholder)
  // and layout: full (opt out of the text-wrap aside for a lone figure).
  upgradeWikiClips(article) {
    const blocks = [
      ...article.querySelectorAll(".wiki-prose pre > code.language-clip"),
      ...article.querySelectorAll(".wiki-prose .language-clip pre > code")
    ];

    blocks.forEach((code) => {
      const pre = code.closest(".highlighter-rouge") || code.closest("pre");
      if (!pre) return;
      const fields = {};
      (code.textContent || "").split("\n").forEach((line) => {
        const separator = line.indexOf(":");
        if (separator < 0) return;
        fields[line.slice(0, separator).trim().toLowerCase()] = line.slice(separator + 1).trim();
      });

      const figure = document.createElement("figure");
      figure.className = "wiki-clip";
      if (fields.shape === "wide") figure.classList.add("wiki-clip--wide");
      let frame;

      if (fields.todo) {
        // Placeholder for a capture that has not been recorded yet.
        frame = document.createElement("div");
        frame.className = "wiki-clip-frame wiki-clip-frame--todo";
        if (fields.shape === "wide") frame.classList.add("wiki-clip-frame--todo-wide");
        const badge = document.createElement("span");
        badge.className = "wiki-clip-todo-badge";
        badge.textContent = fields.title || "capture needed";
        const note = document.createElement("p");
        note.className = "wiki-clip-todo-note";
        note.textContent = fields.todo;
        frame.appendChild(badge);
        frame.appendChild(note);
      } else if (fields.image) {
        const path = fields.image;
        if (!/^assets\/[a-z0-9][a-z0-9/._-]*$/i.test(path) || path.includes("..")) return;
        frame = document.createElement("div");
        frame.className = "wiki-clip-frame wiki-clip-frame--raw wiki-clip-frame--img";
        const img = document.createElement("img");
        img.src = path;
        img.loading = "lazy";
        img.alt = fields.title || fields.caption || "";
        frame.appendChild(img);
      } else {
        const name = fields.name || "";
        const source = fields.src || "";
        let base;
        let card;
        if (name) {
          if (!/^[a-z0-9][a-z0-9-]*$/.test(name)) return;
          base = `assets/showcase/features/${name}`;
          card = true;
        } else if (source) {
          if (!/^assets\/[a-z0-9][a-z0-9/-]*$/.test(source) || source.includes("..")) return;
          base = source;
          card = false;
        } else {
          return;
        }

        const label = fields.title || name || base.split("/").pop();
        const formats = (fields.formats || "webm,mp4")
          .split(",")
          .map((format) => format.trim().toLowerCase())
          .filter((format) => format === "webm" || format === "mp4");
        if (!formats.length) return;

        frame = document.createElement("div");
        frame.className = card ? "wiki-clip-frame" : "wiki-clip-frame wiki-clip-frame--raw";

        const video = document.createElement("video");
        // These have to be real attributes, not just properties: WebKit only
        // grants inline autoplay to an element carrying muted/playsinline in
        // markup, and without the autoplay attribute nothing plays unless the
        // observer below manages to call play(). Native controls are no use here
        // because the card crop pushes the control bar outside the frame, so the
        // fallback is the tap-to-play overlay added below.
        video.setAttribute("muted", "");
        video.setAttribute("autoplay", "");
        video.setAttribute("loop", "");
        video.setAttribute("playsinline", "");
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = "metadata";
        video.dataset.autoplay = "";
        video.setAttribute("aria-label", `${label} screen recording`);
        video.poster = `${base}-poster.webp`;
        formats.forEach((format) => {
          const element = document.createElement("source");
          element.src = `${base}.${format}`;
          element.type = format === "webm" ? "video/webm" : "video/mp4";
          video.appendChild(element);
        });

        frame.appendChild(video);

        // A GIF could not be refused; an autoplaying video can be, by a battery
        // or data saver. This keeps the clip startable by hand in that case, and
        // lets anyone pause one they have finished with.
        const toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = "wiki-clip-toggle";
        toggle.setAttribute("aria-label", `Play ${label}`);
        toggle.addEventListener("click", () => {
          if (video.paused) video.play().catch(() => {});
          else video.pause();
        });
        video.addEventListener("play", () => {
          frame.dataset.playing = "";
          toggle.setAttribute("aria-label", `Pause ${label}`);
        });
        video.addEventListener("pause", () => {
          delete frame.dataset.playing;
          toggle.setAttribute("aria-label", `Play ${label}`);
        });
        frame.appendChild(toggle);
      }

      figure.appendChild(frame);

      if (fields.caption) {
        const caption = document.createElement("figcaption");
        caption.textContent = fields.caption;
        figure.appendChild(caption);
      }

      // Consecutive clips sit side by side instead of stacking down the page.
      const previous = pre.previousElementSibling;
      if (previous?.classList.contains("wiki-clip-row")) {
        if (fields.layout === "full") previous.dataset.full = "";
        previous.appendChild(figure);
        pre.remove();
        return;
      }
      const row = document.createElement("div");
      row.className = "wiki-clip-row";
      if (fields.layout === "full") row.dataset.full = "";
      row.appendChild(figure);
      pre.replaceWith(row);
    });

    // A lone figure floats beside the text on wide screens instead of cutting
    // the page in half; merged rows and layout: full rows stay full-width.
    // A float only looks right when text follows it before the next heading -
    // otherwise the heading clears it and an empty band opens beside the card.
    // So: float where text already follows; if the text sits above instead,
    // move the row in front of it so it wraps; with no text on either side,
    // center the card.
    const wrapsText = (el) => !!el && /^(P|UL|OL)$/.test(el.tagName);
    article.querySelectorAll(".wiki-prose .wiki-clip-row").forEach((row) => {
      row.classList.remove("wiki-clip-row--aside", "wiki-clip-row--center");
      if (row.children.length !== 1 || "full" in row.dataset) return;
      if (wrapsText(row.nextElementSibling)) {
        row.classList.add("wiki-clip-row--aside");
      } else if (wrapsText(row.previousElementSibling)) {
        row.previousElementSibling.before(row);
        row.classList.add("wiki-clip-row--aside");
      } else {
        row.classList.add("wiki-clip-row--center");
      }
    });
  }

  decorateWikiContent() {
    document.querySelectorAll("#tl [data-article-body]").forEach((article) => {
      const articleKey = article.dataset.articleBody;
      const usedIds = new Set();

      this.upgradeWikiClips(article);

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
        pre.classList.add("glass", "glass--sm");
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

      const prose = article.querySelector(".wiki-prose");
      const words = (prose?.textContent || "").trim().split(/\s+/).filter(Boolean).length;
      const sections = article.querySelectorAll(".wiki-prose h2, .wiki-prose h3").length;
      const meta = article.querySelector("[data-article-meta]");
      if (meta) meta.textContent = `${sections} sections · ~${Math.max(1, Math.round(words / 210))} min read`;
    });
  }

  buildSearchIndex() {
    const index = [];
    // Wiki articles (Docs). The landing block itself is navigation, not a
    // result: its own content is the "Beyond the tour" cards, already
    // indexed as the pages they link to.
    document.querySelectorAll('#tl [data-article-body]:not([data-article-body="landing"])').forEach((article) => {
      const key = article.dataset.articleBody;
      const button = document.querySelector(`#tl .wiki-sidebar [data-article="${key}"]`);
      const title = (button ? button.textContent : article.querySelector("h1")?.textContent || key).trim();
      index.push({
        title,
        tag: "Docs",
        view: "wiki",
        sub: key,
        text: (article.textContent || "").replace(/\s+/g, " ").trim().toLowerCase()
      });
    });
    // Static destinations
    const statics = [
      { title: "Download & install", tag: "About", view: "setup", id: "setup-downloads", kw: "apk build com.termux io.vaj.tl companion install release" },
      { title: "Model catalog", tag: "Termux AI", view: "ai", id: "ai-catalog", kw: "gemma qwen deepseek embedding litert mnn model ram download" },
      { title: "Add & import your own models", tag: "Termux AI", view: "ai", id: "ai-import", kw: "hugging face token import repo url litert mnn gguf" },
      { title: "Chat from the terminal with AIChat", tag: "Termux AI", view: "ai", id: "ai-aichat", kw: "aichat openai compatible client endpoint token config" },
      { title: "tai commands", tag: "Termux AI", view: "ai", id: "ai-commands", kw: "tai status models load runtime keep-warm doctor cli" },
      { title: "API reference", tag: "Termux AI", view: "ai", id: "ep-intro", kw: "openai ollama endpoints v1 chat completions responses embeddings launcherctl app launch rate limit 429 errors streaming sse" }
    ];
    statics.forEach((s) => index.push({
      title: s.title, tag: s.tag, view: s.view, id: s.id,
      text: (s.title + " " + s.kw).toLowerCase()
    }));
    this.searchIndex = index;
    this.searchItems = [];
    this.searchActive = -1;
  }

  // Two search fields exist (sidebar, docs landing); both read the same
  // index but keep independent input/results state so typing in one never
  // touches the other. `/` (handleKey, unchanged) focuses whichever is
  // currently visible.
  wireSearch() {
    this.searchBlocks = [...document.querySelectorAll("[data-search]")]
      .map((root) => {
        const input = root.querySelector("[data-search-input]");
        const results = root.querySelector("[data-search-results]");
        if (!input || !results) return null;
        const state = { root, input, results, items: [], active: -1 };

        input.addEventListener("input", () => this.runSearch(state, input.value));
        input.addEventListener("keydown", (event) => {
          if (event.key === "Escape") { this.closeSearch(state, true); return; }
          if (event.key === "ArrowDown") { event.preventDefault(); this.moveActive(state, 1); return; }
          if (event.key === "ArrowUp") { event.preventDefault(); this.moveActive(state, -1); return; }
          if (event.key === "Enter") {
            event.preventDefault();
            const pick = state.items[state.active] || state.items[0];
            if (pick) this.goToResult(state, pick);
          }
        });
        results.addEventListener("click", (event) => {
          const button = event.target.closest("[data-result]");
          if (!button) return;
          const item = state.items[Number.parseInt(button.dataset.result, 10)];
          if (item) this.goToResult(state, item);
        });
        document.addEventListener("click", (event) => {
          if (!root.contains(event.target)) this.closeSearch(state, false);
        });
        return state;
      })
      .filter(Boolean);
  }

  openSearch() {
    if (!this.searchBlocks?.length) return;
    const state = this.searchBlocks.find((s) => s.input.offsetParent !== null) || this.searchBlocks[0];
    state.root.classList.add("open");
    state.input.focus();
    state.input.select();
    if (state.input.value.trim()) this.runSearch(state, state.input.value);
  }

  closeSearch(state, clear) {
    state.root.classList.remove("open");
    state.input.setAttribute("aria-expanded", "false");
    state.results.hidden = true;
    state.results.replaceChildren();
    state.items = [];
    state.active = -1;
    if (clear) state.input.value = "";
  }

  runSearch(state, query) {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) {
      state.input.setAttribute("aria-expanded", "false");
      state.results.hidden = true;
      state.results.replaceChildren();
      state.items = [];
      return;
    }
    const scored = [];
    for (const entry of this.searchIndex) {
      const title = entry.title.toLowerCase();
      let score = 0;
      let matchesAll = true;
      for (const term of terms) {
        const inTitle = title.includes(term);
        const inText = entry.text.includes(term);
        if (!inTitle && !inText) { matchesAll = false; break; }
        score += inTitle ? 3 : 1;
      }
      if (matchesAll) scored.push({ entry, score });
    }
    scored.sort((a, b) => b.score - a.score);
    state.items = scored.slice(0, 8).map((s) => s.entry);
    state.active = state.items.length ? 0 : -1;
    state.input.setAttribute("aria-expanded", "true");
    this.renderResults(state, terms);
  }

  renderResults(state, terms) {
    state.results.replaceChildren();
    if (!state.items.length) {
      const empty = document.createElement("div");
      empty.className = "search-empty";
      empty.textContent = "No matches. Try another term.";
      state.results.appendChild(empty);
      state.results.hidden = false;
      return;
    }
    state.items.forEach((item, i) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.result = String(i);
      button.setAttribute("role", "option");
      button.className = "search-result" + (i === state.active ? " active" : "");

      const head = document.createElement("div");
      const title = document.createElement("span");
      title.className = "sr-title";
      title.textContent = item.title;
      const tag = document.createElement("span");
      tag.className = "sr-tag";
      tag.textContent = item.tag;
      head.append(title, tag);
      button.appendChild(head);

      const snippet = this.snippetFor(item, terms);
      if (snippet) {
        const snip = document.createElement("div");
        snip.className = "sr-snippet";
        snip.textContent = snippet;
        button.appendChild(snip);
      }
      state.results.appendChild(button);
    });
    state.results.hidden = false;
  }

  snippetFor(item, terms) {
    const text = item.text;
    if (!text) return "";
    let at = -1;
    for (const term of terms) {
      const found = text.indexOf(term);
      if (found >= 0 && (at < 0 || found < at)) at = found;
    }
    if (at < 0) return "";
    const start = Math.max(0, at - 32);
    let slice = text.slice(start, start + 120).trim();
    if (start > 0) slice = "… " + slice;
    if (start + 120 < text.length) slice += " …";
    return slice;
  }

  moveActive(state, delta) {
    if (!state.items.length) return;
    state.active = (state.active + delta + state.items.length) % state.items.length;
    state.results.querySelectorAll("[data-result]").forEach((el, i) => {
      el.classList.toggle("active", i === state.active);
      if (i === state.active) el.scrollIntoView({ block: "nearest" });
    });
  }

  goToResult(state, item) {
    this.setView(item.view, item.sub || null, true);
    if (item.id) window.setTimeout(() => this.scrollToId(item.id), 90);
    this.closeSearch(state, true);
  }

  buildEndpointReference() {
    const list = document.querySelector("#tl [data-eplist]");
    const details = document.querySelector("#tl [data-epdetail]");
    if (!list || !details) return;

    this.endpointGroups.forEach((group, groupIndex) => {
      const groupLabel = document.createElement("div");
      groupLabel.textContent = group.name;
      groupLabel.className = "api-eplist-label";
      list.appendChild(groupLabel);

      const groupDetails = document.createElement("section");
      groupDetails.dataset.spy = "";
      groupDetails.dataset.reveal = "";
      groupDetails.id = `epg-${groupIndex}`;
      groupDetails.className = "api-group";
      const title = document.createElement("h3");
      title.textContent = group.name;
      title.className = "api-group-title";
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
    button.className = "api-eplist-button";

    const method = document.createElement("span");
    method.textContent = endpoint.method;
    method.className = this.methodClass(endpoint.method, "api-method");
    const path = document.createElement("span");
    path.textContent = endpoint.path.replace(/^.*\//, "/");
    path.className = "api-eplist-path";
    button.append(method, path);
    return button;
  }

  methodClass(method, base) {
    const modifier = (method || "").toLowerCase();
    const known = { get: 1, post: 1, delete: 1 };
    // The colour modifier is shared by the sidebar label and the card pill
    // (.api-method--get sets colour; .api-pill.api-method--get sets background).
    return known[modifier] ? `${base} api-method--${modifier}` : base;
  }

  createEndpointCard(endpoint) {
    const card = document.createElement("article");
    card.className = "api-card glass glass--sm";

    const heading = document.createElement("div");
    heading.className = "api-card-head";
    const method = document.createElement("span");
    method.textContent = endpoint.method;
    method.className = this.methodClass(endpoint.method, "api-pill");
    const path = document.createElement("code");
    path.textContent = endpoint.path;
    path.className = "api-card-path";
    heading.append(method, path);

    const description = document.createElement("p");
    description.textContent = endpoint.description;
    description.className = "api-card-desc";
    card.append(heading, description);

    if (endpoint.params) {
      const params = document.createElement("p");
      params.innerHTML = endpoint.params;
      params.className = "api-card-params";
      card.appendChild(params);
    }

    if (endpoint.note) {
      const note = document.createElement("div");
      note.innerHTML = endpoint.note;
      note.className = "api-card-note";
      card.appendChild(note);
    }

    card.appendChild(this.createEndpointBlock(endpoint.example, "Request"));
    card.appendChild(this.createEndpointBlock(endpoint.response, "Response", true));
    return card;
  }

  createEndpointBlock(text, label, readOnly) {
    if (!text) return document.createDocumentFragment();
    const wrap = document.createElement("div");
    wrap.className = "api-block";
    if (label) {
      const tag = document.createElement("div");
      tag.textContent = label;
      tag.className = "api-block-label";
      wrap.appendChild(tag);
    }
    const command = document.createElement("div");
    command.dataset.cmd = "";
    command.className = readOnly ? "ai-cmd glass glass--sm ai-cmd--muted" : "ai-cmd glass glass--sm";
    if (!readOnly) {
      const copy = document.createElement("button");
      copy.dataset.copy = "";
      copy.innerHTML = "<span data-copy-label>copy</span>";
      copy.className = "ai-copy-button";
      command.appendChild(copy);
    }
    const pre = document.createElement("pre");
    pre.dataset.cmdText = "";
    pre.textContent = text;
    command.appendChild(pre);
    wrap.appendChild(command);
    return wrap;
  }

  handleClick(event) {
    const marqueeToggle = event.target.closest("[data-marquee-toggle]");
    if (marqueeToggle) {
      const marquee = document.getElementById(marqueeToggle.getAttribute("aria-controls"));
      const paused = marquee ? marquee.classList.toggle("is-paused") : false;
      marqueeToggle.setAttribute("aria-pressed", String(paused));
      marqueeToggle.textContent = paused ? "Play ticker" : "Pause ticker";
      return;
    }

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
      this.setView("wiki", article.dataset.article, true);
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
    const navHeight = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 64;
    const top = element.getBoundingClientRect().top + window.scrollY - navHeight - 24;
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
    button.classList.add("is-copied");
    window.clearTimeout(button.resetTimer);
    button.resetTimer = window.setTimeout(() => {
      label.textContent = original;
      button.classList.remove("is-copied");
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
  new TermuxLauncherSite().mount().catch((error) => {
    console.error("Unable to initialize the site", error);
  });
});
