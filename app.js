"use strict";

class TermuxLauncherSite {
  constructor() {
    this.views = ["setup", "wiki", "ai"];
    this.spyMap = null;
    this.observer = null;
    this.stats = { cpu: 24, ram: 61, temp: 41 };
    this.staticWikiFiles = [
      "overview", "install", "tour", "surface", "keys", "shell",
      "tmux", "launcherctl", "shizuku", "tai", "agent", "trouble"
    ];
    this.endpointGroups = [
      {
        name: "OpenAI-compatible",
        items: [
          { method: "GET", path: "/v1/models", description: "List installed, loadable models and their capabilities. Multimodal LiteRT-LM models also appear as separate -vision and -audio model IDs.", example: "curl -sS -H \"Authorization: Bearer $TOKEN\" \\\n  \"$OPENAI_BASE_URL/models\" | jq .", response: "{\n  \"object\": \"list\",\n  \"data\": [\n    {\n      \"id\": \"gemma-4-e2b-it-litert-lm\",\n      \"object\": \"model\",\n      \"owned_by\": \"termux-launcher\",\n      \"_backend\": \"litert-lm\",\n      \"_capabilities\": [\"text_chat\", \"tool_use\", \"vision\"]\n    }\n  ]\n}" },
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
          { method: "POST", path: "/api/pull", description: "Pull a model by name. Long-running; streams progress as NDJSON." }
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
          { method: "POST", path: "/v1/ai/models/downloads/cancel", description: "Cancel an in-progress model download.", params: "Body: <b>modelId</b> (or download <b>id</b>)." }
        ]
      },
      {
        name: "Launcher & agent",
        items: [
          { method: "GET", path: "/v1/status", description: "Bridge status: privileged backend (Shizuku), notification-listener connectivity, and policy.", response: "{\n  \"ok\": true,\n  \"apiVersion\": \"v1\",\n  \"backendType\": \"SHIZUKU\",\n  \"backendState\": \"READY\",\n  \"notificationListenerConnected\": true\n}" },
          { method: "GET", path: "/v1/launcher/capabilities", description: "Device profile, integration flags (OpenAI/MCP), memory, SoC, and availability warnings.", response: "{\n  \"ok\": true,\n  \"integrations\": { \"openAiCompatible\": true, \"mcpStdio\": true },\n  \"device\": {\n    \"socModel\": \"SM8475\",\n    \"supportedAbis\": [\"arm64-v8a\"],\n    \"memoryGiB\": 14.9\n  }\n}" },
          { method: "GET", path: "/v1/apps", description: "The launcher's launchable activity catalog (label, package, activity, stableId).", response: "{\n  \"ok\": true,\n  \"count\": 113,\n  \"apps\": [\n    {\n      \"label\": \"Maps\",\n      \"packageName\": \"com.example.maps\",\n      \"activityName\": \"com.example.maps.MainActivity\",\n      \"stableId\": \"com.example.maps/...MainActivity\",\n      \"launchable\": true\n    }\n  ]\n}" },
          { method: "POST", path: "/v1/apps/launch", description: "Launch an app by fuzzy query, resolved against the app catalog.", params: "Body: <b>query</b> (app name or package fragment).", example: "curl -sS -H \"Authorization: Bearer $TOKEN\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"query\":\"maps\"}' \\\n  \"$BASE/v1/apps/launch\"", note: "30 requests / minute." },
          { method: "POST", path: "/v1/app/restart", description: "Restart the launcher activity.", note: "5 requests / minute." },
          { method: "GET", path: "/v1/system/resources", description: "CPU, memory, battery, network, thermal, and storage snapshot.", response: "{\n  \"ok\": true,\n  \"cpuCores\": 8,\n  \"cpuPercent\": 19.7,\n  \"memTotalBytes\": 11807469568,\n  \"memAvailableBytes\": 5217705984\n}" },
          { method: "GET", path: "/v1/notifications", description: "Current cached notification list. Needs notification-listener access granted to the launcher.", note: "Requires notification-listener access." },
          { method: "POST", path: "/v1/notifications/recent", description: "Most recent notification events from the persisted log.", params: "Body: optional <b>limit</b>." },
          { method: "POST", path: "/v1/notifications/search", description: "Search the notification-event log by text query.", params: "Body: <b>query</b>, optional <b>limit</b>." },
          { method: "POST", path: "/v1/notifications/since", description: "Notification events after a timestamp (epoch ms).", params: "Body: <b>since</b> (epoch ms, required), optional <b>limit</b>." },
          { method: "POST", path: "/v1/notifications/stats", description: "Aggregate counts by package over the retained event log.", response: "{\n  \"total\": 10000,\n  \"posted\": 9111,\n  \"removed\": 889,\n  \"packages\": [ { \"packageName\": \"com.example.app\", \"count\": 4032 } ]\n}" },
          { method: "GET", path: "/v1/media/now-playing", description: "Currently playing media session, when a listener is connected.", response: "{ \"listenerConnected\": true, \"nowPlaying\": null, \"ok\": true }" },
          { method: "GET", path: "/v1/media/art", description: "Album art for the active media session (binary image)." },
          { method: "GET", path: "/v1/events", description: "Recent bridge/agent events from the ring buffer (most recent last)." },
          { method: "GET", path: "/v1/events/stream", description: "Live event stream as Server-Sent Events. Keep the connection open and read events as they arrive.", note: "12 concurrent opens / minute — one long-lived stream, not a poll loop." },
          { method: "POST", path: "/v1/events/tail", description: "Fetch events since a timestamp without holding a stream open.", params: "Body: optional <b>since</b> (epoch ms), <b>limit</b>." },
          { method: "GET", path: "/v1/agent/tools", description: "List the callable agent tools and their JSON schemas (for tool-using clients and MCP).", response: "{\n  \"ok\": true,\n  \"count\": 15,\n  \"tools\": [\n    {\n      \"name\": \"apps.search\",\n      \"openAiName\": \"apps_search\",\n      \"risk\": \"low\",\n      \"requiresConfirmation\": false\n    }\n  ]\n}" },
          { method: "POST", path: "/v1/agent/route", description: "Route a natural-language request to the right agent tool and run it.", params: "Body: <b>request</b> (natural-language string).", example: "curl -sS -H \"Authorization: Bearer $TOKEN\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"request\":\"show recent notifications\"}' \\\n  \"$BASE/v1/agent/route\"" },
          { method: "POST", path: "/v1/agent/execute", description: "Execute a named tool directly. Risky tools are confirmation-gated — pass confirm: true.", params: "Body: <b>tool</b>, <b>arguments</b> (object), optional <b>confirm</b>.", example: "curl -sS -H \"Authorization: Bearer $TOKEN\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"tool\":\"system.resources\",\"arguments\":{},\"confirm\":true}' \\\n  \"$BASE/v1/agent/execute\"" },
          { method: "POST", path: "/v1/auth/rotate", description: "Rotate the API token and rewrite ~/.launcherctl/token and ~/.launcherctl/endpoint. All existing clients must re-read the new token.", note: "5 requests / minute. Invalidates the current token immediately." }
        ]
      }
    ];
    this.methodColors = {
      GET: "var(--green)",
      POST: "var(--blue)",
      DELETE: "var(--red)"
    };
  }

  async mount() {
    void this.hydrateGitHubData();
    await this.hydrateStaticWiki();
    this.buildEndpointReference();
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
    const initial = this.parseHash() || { view: "setup", subview: null };
    this.setView(initial.view, initial.subview, false);
  }

  async hydrateGitHubData() {
    const repositories = [
      { name: "PickleHik3/termux-launcher", includeStars: true },
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
      this.applyReleaseData(`${name}:main`, published.find((release) => !/-vaj$/i.test(release.tag_name)));
      this.applyReleaseData(`${name}:vaj`, published.find((release) => /-vaj$/i.test(release.tag_name)));
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

    documents.forEach((doc, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.article = doc.key;
      button.className = "wiki-nav-item";
      button.textContent = doc.title;
      sidebar.appendChild(button);

      const article = document.createElement("article");
      article.dataset.articleBody = doc.key;
      article.style.display = index === 0 ? "block" : "none";

      const kicker = document.createElement("div");
      kicker.className = "wiki-kicker";
      kicker.textContent = "DOCUMENTATION";

      const heading = document.createElement("h1");
      heading.dataset.spy = "";
      heading.id = `w-${doc.key}`;
      heading.textContent = doc.title;

      const prose = document.createElement("div");
      prose.className = "wiki-prose";
      prose.innerHTML = this.markdownToHtml(doc.body);

      article.append(kicker, heading, prose);
      main.appendChild(article);
    });
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
      element.style.background = active ? "var(--blue-soft)" : "transparent";
      element.style.color = active ? "var(--blue)" : "var(--mute)";
      element.style.fontWeight = "400";
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

  buildSearchIndex() {
    const index = [];
    // Wiki articles (Docs)
    document.querySelectorAll("#tl [data-article-body]").forEach((article) => {
      const key = article.dataset.articleBody;
      const button = document.querySelector(`#tl [data-article="${key}"]`);
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
      { title: "API reference", tag: "Termux AI", view: "ai", id: "ep-intro", kw: "openai ollama endpoints v1 chat completions responses embeddings launcherctl rate limit 429 errors streaming sse agent tools" }
    ];
    statics.forEach((s) => index.push({
      title: s.title, tag: s.tag, view: s.view, id: s.id,
      text: (s.title + " " + s.kw).toLowerCase()
    }));
    this.searchIndex = index;
    this.searchItems = [];
    this.searchActive = -1;
  }

  wireSearch() {
    this.searchRoot = document.querySelector("[data-search]");
    this.searchToggle = document.querySelector("[data-search-toggle]");
    this.searchInput = document.querySelector("[data-search-input]");
    this.searchResults = document.querySelector("[data-search-results]");
    if (!this.searchRoot || !this.searchInput || !this.searchResults) return;

    this.searchToggle.addEventListener("click", () => this.openSearch());
    this.searchInput.addEventListener("input", () => this.runSearch(this.searchInput.value));
    this.searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Escape") { this.closeSearch(true); return; }
      if (event.key === "ArrowDown") { event.preventDefault(); this.moveActive(1); return; }
      if (event.key === "ArrowUp") { event.preventDefault(); this.moveActive(-1); return; }
      if (event.key === "Enter") {
        event.preventDefault();
        const pick = this.searchItems[this.searchActive] || this.searchItems[0];
        if (pick) this.goToResult(pick);
      }
    });
    this.searchResults.addEventListener("click", (event) => {
      const button = event.target.closest("[data-result]");
      if (!button) return;
      const item = this.searchItems[Number.parseInt(button.dataset.result, 10)];
      if (item) this.goToResult(item);
    });
    document.addEventListener("click", (event) => {
      if (!this.searchRoot.contains(event.target) && !this.searchResults.contains(event.target)) {
        this.closeSearch(false);
      }
    });
  }

  openSearch() {
    if (!this.searchRoot) return;
    this.searchRoot.classList.add("open");
    this.searchToggle.setAttribute("aria-expanded", "true");
    this.searchInput.focus();
    this.searchInput.select();
    if (this.searchInput.value.trim()) this.runSearch(this.searchInput.value);
  }

  closeSearch(clear) {
    if (!this.searchRoot) return;
    this.searchRoot.classList.remove("open");
    this.searchToggle.setAttribute("aria-expanded", "false");
    this.searchResults.hidden = true;
    this.searchResults.replaceChildren();
    this.searchItems = [];
    this.searchActive = -1;
    if (clear) this.searchInput.value = "";
  }

  runSearch(query) {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) {
      this.searchResults.hidden = true;
      this.searchResults.replaceChildren();
      this.searchItems = [];
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
    this.searchItems = scored.slice(0, 8).map((s) => s.entry);
    this.searchActive = this.searchItems.length ? 0 : -1;
    this.renderResults(terms);
  }

  renderResults(terms) {
    this.searchResults.replaceChildren();
    if (!this.searchItems.length) {
      const empty = document.createElement("div");
      empty.className = "search-empty";
      empty.textContent = "No matches. Try another term.";
      this.searchResults.appendChild(empty);
      this.searchResults.hidden = false;
      return;
    }
    this.searchItems.forEach((item, i) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.result = String(i);
      button.className = "search-result" + (i === this.searchActive ? " active" : "");

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
      this.searchResults.appendChild(button);
    });
    this.searchResults.hidden = false;
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

  moveActive(delta) {
    if (!this.searchItems.length) return;
    this.searchActive = (this.searchActive + delta + this.searchItems.length) % this.searchItems.length;
    this.searchResults.querySelectorAll("[data-result]").forEach((el, i) => {
      el.classList.toggle("active", i === this.searchActive);
      if (i === this.searchActive) el.scrollIntoView({ block: "nearest" });
    });
  }

  goToResult(item) {
    this.setView(item.view, item.sub || null, true);
    if (item.id) window.setTimeout(() => this.scrollToId(item.id), 90);
    this.closeSearch(true);
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

    if (endpoint.params) {
      const params = document.createElement("p");
      params.innerHTML = endpoint.params;
      params.style.cssText = "font-family:var(--sans);font-size:13px;color:var(--dim);line-height:1.6;margin:9px 0 0";
      card.appendChild(params);
    }

    if (endpoint.note) {
      const note = document.createElement("div");
      note.innerHTML = endpoint.note;
      note.style.cssText = "display:flex;gap:8px;margin-top:11px;background:rgba(217,139,106,.09);border:1px solid rgba(217,139,106,.28);border-radius:7px;padding:8px 11px;font-family:var(--mono);font-size:11.5px;color:#e6c4b4;line-height:1.5";
      card.appendChild(note);
    }

    card.appendChild(this.createEndpointBlock(endpoint.example, "Request"));
    card.appendChild(this.createEndpointBlock(endpoint.response, "Response", true));
    return card;
  }

  createEndpointBlock(text, label, readOnly) {
    if (!text) return document.createDocumentFragment();
    const wrap = document.createElement("div");
    wrap.style.cssText = "margin-top:12px";
    if (label) {
      const tag = document.createElement("div");
      tag.textContent = label;
      tag.style.cssText = "font-family:var(--mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--dim);margin-bottom:5px";
      wrap.appendChild(tag);
    }
    const command = document.createElement("div");
    command.dataset.cmd = "";
    command.style.cssText = "position:relative;background:var(--ink);border:1px solid var(--line);border-radius:8px;padding:13px";
    if (!readOnly) {
      const copy = document.createElement("button");
      copy.dataset.copy = "";
      copy.innerHTML = "<span data-copy-label>copy</span>";
      copy.style.cssText = "position:absolute;top:8px;right:8px;font-family:var(--mono);font-size:10.5px;text-transform:uppercase;color:var(--gold);background:var(--ink);border:1px solid var(--gline);border-radius:6px;padding:4px 9px;cursor:pointer";
      command.appendChild(copy);
    }
    const pre = document.createElement("pre");
    pre.dataset.cmdText = "";
    pre.textContent = text;
    pre.style.cssText = `margin:0;overflow-x:auto;font-family:var(--mono);font-size:12px;line-height:1.6;color:${readOnly ? "var(--mute)" : "var(--cream)"}`;
    command.appendChild(pre);
    wrap.appendChild(command);
    return wrap;
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
  new TermuxLauncherSite().mount().catch((error) => {
    console.error("Unable to initialize the site", error);
  });
});
