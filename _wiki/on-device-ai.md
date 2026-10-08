---
title: On-device AI
group: Extras
order: 130
---
The launcher can run language, speech and image models on your phone. Nothing leaves the device unless you set up a remote model or open the API to your network. Everything lives in **Settings → On-device AI**, in the **Workspace** group right after Display.

Two runtimes are built in:

|                             | LiteRT-LM (Google)             | MNN-LLM (Alibaba)                    |
| --------------------------- | ------------------------------- | ------------------------------------- |
| Model format                | `.litertlm` / `.task` packages | MNN-converted models (`config.json`) |
| Chat input                  | ✓                               | ✓                                     |
| Image, audio input          | ✓                               | ✗                                     |
| Tool calling                | native                          | prompt-based                          |
| Thinking / reasoning traces | ✓                               | \-                                    |
| Embeddings                  | ✓ (`.tflite`, EmbeddingGemma 2 `.litertlm`) | ✓ (where the model advertises it) |
| Runs on                     | CPU or GPU                      | CPU or GPU                            |

Loaded models are served over **OpenAI-compatible and Ollama-compatible APIs on localhost**, so existing clients and SDKs work against your phone. The command-line tool is `tai`. Dictation, cleanup and read aloud are covered in [Voice & speech](#wiki/voice); they use the speech and voice models from the Model centre below.

## What runs on this phone

The first time you open On-device AI, a **What runs on this phone** card lists what fits your phone: **Voice typing**, **Read aloud**, **Assistant and tidy dictation** and **Dawn notes integration**. Tick what you want, leave **Wi-Fi only** on or switch it off, and tap **Download selected**, or **Later**. Reopen the card any time from the **What runs on this phone** row.

The phone's RAM puts it in a tier, shown in the Model centre header as "Tier N · X GB · chip · Android N". The tier decides what **Automatic** means for each function:

| Tier | RAM | Automatic picks |
| --- | --- | --- |
| 1 | 6 GB and under | No assistant; Whisper Base for voice typing; raw text for tidy dictation; app categories off; EmbeddingGemma 2 270M |
| 2 | 8 to 12 GB | Gemma 4 E2B for the assistant, tidy dictation and app categories; Whisper Small; EmbeddingGemma 2 440M |
| 3 | 16 GB and more | Gemma 4 E4B for the assistant (E2B when there is no GPU path) and app categories; E2B for tidy dictation; Whisper Small; EmbeddingGemma 2 440M |

Voice typing uses the English-only Whisper file when the phone is set to English. Read aloud uses KittenTTS on every tier.

## The Model centre

**Settings → On-device AI → Model centre** has three segments:

- **Functions**: one row per job, showing what it uses: **Assistant and endpoint**, **Voice typing**, **Tidy dictation**, **Read aloud**, **App categories**, **Dawn notes integration**. Tap a row to pick from **Automatic**, **On this phone**, **Remote**, **Without a model** (such as **Raw text** or **Off**) and **Get a model**. The sheet's **Settings** part holds the extras: **Runs on** GPU or CPU (with **Answers look wrong? Use the CPU** and **Try the GPU again**), **Cleanup level** for Tidy dictation, **Voice** and **Speed** for Read aloud, and **Voice typing window**.
- **Installed**: every model on the phone. Each shows a "Used by:" line and a **Use for…** action; deleting a model that serves a function warns "In use by …" first. Installed image models sit under **Image generation**.
- **Get models**: the catalogue, grouped under **Assistants**, **Speech**, **Voice output** and **Search**, with the import bar on top.

| Model | Group | Download | RAM |
| --- | --- | ---: | ---: |
| Gemma 4 E2B IT (recommended) | Assistants | 2.4 GB | 8 GB+ |
| Gemma 4 E4B IT | Assistants | 3.7 GB | 12 GB+ |
| Whisper ACFT Base / Base (English) | Speech | 97 MB | 6 GB+ |
| Whisper ACFT Small / Small (English) | Speech | 273 MB | 8 GB+ |
| Parakeet TDT 0.6B v3 (25 European languages) | Speech | 586 MB | 8 GB+ |
| KittenTTS Nano 0.8 (English) | Voice output | 90 MB | 4 GB+ |
| EmbeddingGemma 2 Text+Vision 440M (recommended) | Search | 388 MB | 4 GB+ |
| EmbeddingGemma 2 Text 270M | Search | 165 MB | 4 GB+ |
| EmbeddingGemma 300M (gated, needs a token) | Search | ~520 MB | 4 GB+ |

Each catalogue row shows a **License:** line before you download. Gemma 4 and EmbeddingGemma 2 are Apache-2.0 and need no token. **Simultaneous downloads** sets how many run at once. A preflight check runs before every load and refuses if the phone does not have the memory. GGUF, safetensors and other raw-weight formats are not supported; run those under llama.cpp in Termux.

## Adding your own model

- **Set a Hugging Face token** under **Settings → On-device AI → Hugging Face token**. A classic **Read** token, or a fine-grained one with `Contents: Read`, is enough. For a gated model, accept its terms on huggingface.co first. Gated rows and refused downloads also offer **Add token**.
- **Paste a link** to any compatible LiteRT-LM or MNN model into **Paste a Hugging Face link…** at the top of **Get models** and tap **Add**, or tap **File** to pick a `.litertlm`, `.task` or `.tflite` file. An MNN model folder goes through **More ways to add a model → Add a model folder (MNN)**.

## Remote model

**Settings → On-device AI → Remote model** lets a function use a model on another server with your own key. Set the **Server address** (presets **OpenAI**, **OpenRouter** and **Server on this phone or LAN**; plain http is allowed only for this phone and your own network), the **API key** (stored encrypted), the **Model**, whether it **Understands images**, and **When to use it**: **Prefer remote** or **Only when no local model fits**. **Test connection** sends one short message and times the answer; **Remove** forgets the address, key and model. Function pickers then offer it as "Remote · <model>".

## Search by meaning

The **Dawn notes integration** function lets Dawn notes find notes by meaning, not only by the words you typed. Automatic picks EmbeddingGemma 2 (440M, or 270M on Tier 1) and falls back to the other EmbeddingGemma 2 file, then to EmbeddingGemma 300M. EmbeddingGemma 2 files are single `.litertlm` files with a 2048-token window and text input.

## Image generation

`tai image` draws a picture with an MNN diffusion model: Stable Diffusion 1.5 and Taiyi (512x512 only), or Sana (sizes in multiples of 32, from 256 to 2048). It runs on the GPU through OpenCL unless you add `--cpu`. There is no catalogue entry: add a model by pasting a Hugging Face repo link (for example `taobao-mnn/stable-diffusion-v1-5-mnn-opencl`), with **Add a model folder (MNN)**, or with `tai import <folder>`. Image models are not listed on `/v1/models` and cannot be loaded with `tai load`. Other options: `--model ID` or `--model-dir DIR`, `--type sd15|taiyi|sana`, `--steps N`, `--seed N`, `--size WxH`, `--cfg X`, `--image IN.png`, `--memory-mode 0|1|2`.

```shell
tai image "a lighthouse at dusk" --out lighthouse.png
tai image --stop
```

## Images and audio

A multimodal LiteRT model (Gemma 4) is advertised on the API as up to three ids sharing one downloaded file: `model-id` for text (the default, canonical id), `model-id-vision` for text and image, `model-id-audio` for text and audio. Only one mode loads at a time, which keeps the memory cost down. **Endpoint exposure** (under **Advanced → Parameters**) changes this: **Combined** serves every modality from the bare id alone, at a higher memory cost; **Both** keeps that combined id and adds the splits, with the text-only one as `model-id-text`.

## Managing it from the shell

```shell
tai status                       # what's running, current settings
tai runtime [--clear-history]    # runtime process state and history
tai logs [--lines N] [--clear]   # the diagnostics log
tai models                       # installed models and their capabilities
tai import <path> [model-id]     # add a file or folder already on the phone
tai download <model-id> <https-url> --accept-terms
tai downloads                    # the download queue
tai delete <model-id>
tai preflight [model] [--auto|--cpu|--gpu]
tai load [model] [--auto|--cpu|--gpu] [--fresh]
tai unload                       # release all model memory
tai keep-warm [model] [--minutes N] [--auto|--cpu|--gpu]
tai cancel                       # stop the running generation or benchmark
tai benchmark [model...] [--preset quick|standard]
tai transcribe <file.wav>        # speech to text
tai speak [text]                 # read aloud; tai speak --stop
tai doctor                       # runtime and server health in one shot
```

A queued download is steered with `tai download-pause`, `download-resume`, `download-now` and `download-cancel <model-id>`; `tai image` is under Image generation above. For machine-readable output put `--json` (or `-j`) first, as in `tai --json models`. `--fresh` on `tai load` rebuilds an MNN model's weight cache, for when a loaded model starts giving degenerate replies.

## Benchmark

**Settings → On-device AI → Benchmark** ("Which models this phone runs well") measures how models actually run here: choose models, pass the checks (battery, heat, screen) and run, with a cool-down between models and a result per entry. An installed chat model also has **Benchmark** in its overflow menu, and once you have run one, installed chat rows show a speed pill. From the shell it is `tai benchmark`.

## Connecting a client

The **OpenAI endpoint** row in the **Server** group opens **Endpoint & access**, with the base URL, the bearer token and **Recreate token**. **Require API token**, **LAN access** and **Model autoload** sit beside it. The same values are written to disk:

```shell
export OPENAI_BASE_URL="$(cat ~/.launcherctl/endpoint)/v1"
export OPENAI_API_KEY="$(cat ~/.launcherctl/token)"
```

```clip
svg: ai-endpoint
title: Endpoint & access
caption: Any OpenAI-compatible client talks to the model on the phone through the base URL and bearer token.
```

- OpenAI-shaped: `/v1/chat/completions`, `/v1/responses`, `/v1/completions`, `/v1/embeddings`, `/v1/tokenize`, `/v1/audio/transcriptions`, `/v1/audio/speech`, with streaming.
- Ollama-shaped (same port, no `/v1`): `/api/chat`, `/api/generate`, `/api/embed`, `/api/tags`.

The server listens on localhost only by default. **LAN access** always requires the token and turns itself off after 12 hours. The full endpoint reference is on the [On-device AI API](#wiki/on-device-ai-api) page.

### Quickstart: AIChat

[AIChat](https://github.com/sigoden/aichat) is a single-binary terminal chat client (`pkg i -y aichat`). On first run it offers to build `~/.config/aichat/config.yaml`; take the base URL and token from **Endpoint & access**:

```yaml
clients:
  - type: openai-compatible
    name: tai
    api_base: http://127.0.0.1:54298/v1   # your endpoint
    api_key: YOUR_TOKEN                    # your bearer token
    models:
      - name: gemma-4-e2b-it-litert-lm     # any installed model id
```

## How memory is handled

- **One generation model is resident at a time.** Loading another, even on the other backend, unloads the current one first.
- Embedding and speech models do not occupy that slot; they load on demand beside the chat model.
- Idle models unload after 10 minutes by default (**Idle unload**, under **Advanced**). `tai keep-warm` extends it.
- Models run in a separate process, so a native crash cannot take the launcher down with it.
- **Share diagnostics log** (under **Advanced**) saves loads, evictions, failures, the runtime history and the last crash as one text file, with no prompts or replies.

Full details: [On-device AI](https://github.com/PickleHik3/termux-launcher/blob/dev/docs/en/On_Device_AI.md)
