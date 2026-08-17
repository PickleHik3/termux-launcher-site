---
title: LLM backends
order: 35
---
The launcher can run language models entirely on your phone - no cloud, nothing leaves the device. Two runtimes are built in:

|                             | LiteRT-LM (Google)             | MNN-LLM (Alibaba)                    |
| --------------------------- | ------------------------------ | ------------------------------------ |
| Model format                | `.litertlm` / `.task` packages | MNN-converted models (`config.json`) |
| Chat, vision, audio input   | ✓                              | ✓                                    |
| Tool calling                | native                         | prompt-based                         |
| Thinking / reasoning traces | ✓                              | \-                                   |
| Embeddings                  | ✓ (`.tflite`)                  | ✓                                    |
| Runs on                     | CPU or GPU                     | CPU or GPU                           |

Loaded models are served over **OpenAI-compatible and Ollama-compatible APIs on localhost**, so existing clients, SDKs and CLIs work against your phone the same way they'd talk to the real thing. This whole subsystem is called TAI (Termux AI) in the settings.

## Getting a model

Open **Settings → Services & permissions → TAI · Termux AI → Browse Catalog**. The catalog lists ready-to-use models (Gemma, Qwen, DeepSeek distills and more), each with its download size, RAM requirement and license. Models download from Hugging Face; gated ones (like Gemma) ask for a Hugging Face token first, and every download shows the provider's license to accept.

A few things to know before downloading:

* **Start small.** Downloads run from ~300 MB to several GB, and the RAM tier listed per model is real - a preflight check runs before every load and refuses if the device doesn't have the memory.
* You can also **import your own**: a local `.litertlm` / `.task` / `.tflite` file, or a Hugging Face URL (for MNN, a link to the model's `config.json`). GGUF, safetensors and other raw-weight formats are not supported.

```clip
image: assets/screenshots/tai-import.jpeg
title: Model import
caption: The import window - paste a Hugging Face repo URL and TAI downloads, verifies and registers it.
```

```clip
image: assets/screenshots/tai-endpoint.jpeg
title: Endpoint & access
caption: Endpoint & access - the base URL and bearer token any OpenAI/Ollama client needs.
```

## Managing it from the shell

The `tai` command manages the host - it's not a chat client:

```shell
tai status      # what's running, current settings
tai models      # installed models and their capabilities
tai load        # load the default model (or: tai load MODEL_ID --gpu)
tai unload      # release all model memory
tai keep-warm   # keep the model resident (--minutes N)
tai preflight   # check a model would load, without loading it
tai doctor      # runtime + server health in one shot
```

`tai download`, `tai import`, `tai downloads` and `tai cancel` cover the rest. Add `--json` to any command for machine-readable output.

## Connecting a client

The server writes its address and token to disk, so clients can pick them up without hardcoding anything:

```shell
export OPENAI_BASE_URL="$(cat ~/.launcherctl/endpoint)/v1"
export OPENAI_API_KEY="$(cat ~/.launcherctl/token)"
```

* OpenAI-shaped: `/v1/chat/completions`, `/v1/responses`, `/v1/completions`, `/v1/embeddings`, with streaming.
* Ollama-shaped (same port, no `/v1`): `/api/chat`, `/api/generate`, `/api/embed`, `/api/tags`.

The server listens on localhost only by default; a LAN option exists in settings and always requires the token. Full endpoint reference with request/response examples is on the **Termux AI** page in the site navigation.

## How memory is handled

Phones don't have RAM to waste, so the runtime is strict about it:

* **One generation model is resident at a time.** Loading another (even on the other backend) unloads the current one first.
* Multimodal LiteRT models are split into separate `-text` / `-vision` / `-audio` model ids by default, so asking for text doesn't pay the RAM cost of the vision and audio encoders. A "combined" mode is available in Advanced settings.
* Embedding models don't occupy the slot at all - they're served on demand alongside the chat model.
* Idle models unload themselves after 10 minutes by default (configurable) - a countdown shows on the status bar while a model is resident; `tai keep-warm` extends it when you know you'll be back.
* Models run in a separate process, so a native crash can't take the launcher (your home screen) down with it.
