---
title: On-device AI
group: Extras
order: 130
---
The launcher can run language models entirely on your phone - no cloud, nothing leaves the device unless you deliberately expose the API to your network. Everything lives in **Settings → On-device AI**, a row under **Launcher** (right after Display).

Two runtimes are built in:

|                             | LiteRT-LM (Google)             | MNN-LLM (Alibaba)                    |
| --------------------------- | ------------------------------- | ------------------------------------- |
| Model format                | `.litertlm` / `.task` packages | MNN-converted models (`config.json`) |
| Chat input                  | ✓                               | ✓                                     |
| Image, audio input          | ✓                               | ✗                                     |
| Tool calling                | native                          | prompt-based                          |
| Thinking / reasoning traces | ✓                               | \-                                    |
| Embeddings                  | ✓ (`.tflite`)                   | ✓ (where the model advertises it)     |
| Runs on                     | CPU or GPU                      | CPU or GPU                            |

Loaded models are served over **OpenAI-compatible and Ollama-compatible APIs on localhost**, so existing clients, SDKs and CLIs work against your phone the same way they'd talk to the real thing. The command-line tool is `tai`.

## Getting a model

Open **Settings → On-device AI → Model centre**. It lists every installed model plus a **Worth a download** catalog: Gemma 4 chat models, the speech-to-text models [voice input](#wiki/voice) uses, and the voice model for read aloud. Each row shows a quiet backend pill. Models download from Hugging Face; gated ones ask for a Hugging Face token first, and every download shows the provider's license to accept.

| Model | Backend | Best for | Download | RAM | Tags |
| --- | --- | --- | ---: | ---: | --- |
| Gemma 4 E2B IT | LiteRT-LM | General chat, images, audio, tools | 2.4 GB | 8 GB+ | rec |
| Gemma 4 E4B IT | LiteRT-LM | Better coding and reasoning | 3.7 GB | 12 GB+ | |
| Whisper ACFT Base / Base (English) | LiteRT-LM | Voice input, multilingual or English only | 97 MB | 6 GB+ | |
| Whisper ACFT Small / Small (English) | LiteRT-LM | Voice input, better accuracy | 273 MB | 8 GB+ | |
| Parakeet TDT 0.6B v3 | LiteRT-LM | Voice input in 25 European languages | 586 MB | 8 GB+ | |
| KittenTTS Nano 0.8 | LiteRT-LM | Reading text aloud, in English | 90 MB | 4 GB+ | |

**rec** = the recommended general model. Both Gemma 4 models are Apache-2.0 and download without a token. This built-in catalog is deliberately short: any other LiteRT-LM or MNN model (Qwen, DeepSeek distills, an embedding model) still runs when you add it by Hugging Face link or import the file (see Importing your own, below) - it's just not in the catalog list.

A few things to know before downloading:

* **Start small.** The RAM tier listed per model is real - a preflight check runs before every load and refuses if the device doesn't have the memory.
* Only one chat/generation model is resident at a time; loading another (even on the other backend) unloads the current one first. Speech models are separate and load on demand beside the chat model.
* GGUF, safetensors and other raw-weight formats are not supported - run those under a separate runtime such as llama.cpp in Termux.

## Importing your own

Beyond the built-in catalog, On-device AI can pull any compatible LiteRT-LM or MNN model straight from Hugging Face, or import a file already on the phone.

**Step 1: set a Hugging Face token.** A classic **Read** token, or a fine-grained token with `Contents: Read`, is enough - set it under **Settings → On-device AI → Hugging Face token**. It's sent only to Hugging Face download URLs. For a gated model, also open its huggingface.co page and accept the terms first.

```clip
image: assets/screenshots/tai-hf-token.jpeg
title: Hugging Face token
caption: Set a Hugging Face token once - it's only ever sent to Hugging Face download URLs.
```

**Step 2: paste a repo URL to add.** In Model centre's **Add a model**, paste a Hugging Face repo URL (or pick a local `.litertlm` / `.task` / `.tflite` file, or a folder for MNN). Capabilities are guessed from known model names; tick or untick them, then import and verify.

```clip
image: assets/screenshots/tai-import.jpeg
title: Model import
caption: The import window - paste a Hugging Face repo URL and On-device AI downloads, verifies and registers it.
```

**Step 3: point your client at it.** Once installed, load it (`tai load MODEL_ID`) and connect any OpenAI- or Ollama-compatible client with the base URL and bearer token from **Endpoint & access**, the same values live in `~/.launcherctl/`.

```clip
image: assets/screenshots/tai-endpoint.jpeg
title: Endpoint & access
caption: Endpoint & access - the base URL and bearer token any OpenAI/Ollama client needs.
```

## Images and audio

A multimodal LiteRT model (Gemma 4) is advertised on the API as up to three ids sharing one downloaded file. By default the bare id is text-only chat, and only the modalities beyond that get a suffix:

- `model-id` - text (the default, canonical id)
- `model-id-vision` - text + image
- `model-id-audio` - text + audio

Only one mode loads at a time, which keeps the memory cost down. The advanced **Endpoint exposure** setting changes this: **Combined** serves every modality from the bare id alone, at a higher memory cost; **Both** keeps that combined id and adds the splits, with the text-only one as `model-id-text`.

## Managing it from the shell

```shell
tai status      # what's running, current settings
tai models      # installed models and their capabilities
tai load        # load the default model (or: tai load MODEL_ID --gpu)
tai unload      # release all model memory
tai keep-warm   # keep the model resident (--minutes N)
tai preflight   # check a model would load, without loading it
tai benchmark   # measure how well a model runs on this phone
tai transcribe  # speech to text from an audio file
tai speak       # read text aloud with the installed voice model
tai doctor      # runtime + server health in one shot
```

`tai download`, `tai import`, `tai downloads` and `tai cancel` cover the rest. Add `--json` to any command for machine-readable output.

## Benchmark

**On-device AI → Model centre → Benchmark** measures how a model actually runs on this phone: Home → Choose models → Check (battery, heat, screen) → Run, with a cool-down between models and a Result screen per entry. An installed chat model also has **Benchmark** in its own overflow menu, which preselects it. Once you've run one, installed chat rows show a speed pill with their best ranked tok/s. The same thing runs from the shell as `tai benchmark`.

## Voice and speech

Dictation, cleanup and read aloud are covered in [Voice & speech](#wiki/voice); it uses the same speech and voice models from this Model centre.

## Connecting a client

The server writes its address and token to disk, so clients can pick them up without hardcoding anything:

```shell
export OPENAI_BASE_URL="$(cat ~/.launcherctl/endpoint)/v1"
export OPENAI_API_KEY="$(cat ~/.launcherctl/token)"
```

* OpenAI-shaped: `/v1/chat/completions`, `/v1/responses`, `/v1/completions`, `/v1/embeddings`, `/v1/tokenize`, `/v1/audio/transcriptions`, `/v1/audio/speech`, with streaming.
* Ollama-shaped (same port, no `/v1`): `/api/chat`, `/api/generate`, `/api/embed`, `/api/tags`.

The server listens on localhost only by default; a LAN option exists in settings and always requires the token. Full endpoint reference with request/response examples is on the [On-device AI API](#wiki/on-device-ai-api) page.

### Quickstart: AIChat

[AIChat](https://github.com/sigoden/aichat) is a fast, single-binary terminal chat client (`pkg i -y aichat`). On first run it offers to build `~/.config/aichat/config.yaml`; the base URL and bearer token come from **Settings → On-device AI → Endpoint & access**:

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

Phones don't have RAM to waste, so the runtime is strict about it:

* **One generation model is resident at a time.** Loading another (even on the other backend) unloads the current one first.
* Embedding models don't occupy the slot at all - they're served on demand alongside the chat model.
* Idle models unload themselves after 10 minutes by default (**Idle unload** in settings) - `tai keep-warm` extends it when you know you'll be back.
* Models run in a separate process, so a native crash can't take the launcher (your home screen) down with it.
