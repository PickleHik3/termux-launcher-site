---
title: On-device AI API
group: Reference
order: 260
---
The local server behind [On-device AI](#wiki/on-device-ai) speaks OpenAI- and Ollama-compatible HTTP on localhost. This page is the endpoint reference; see On-device AI for the settings screens and the `tai` CLI.

## Base URL & auth

The server writes its current address and token to disk on every start:

```shell
BASE=$(sed -n '1p' ~/.launcherctl/endpoint)   # e.g. http://127.0.0.1:54298
TOKEN=$(cat ~/.launcherctl/token)
export OPENAI_BASE_URL="$BASE/v1"
export OPENAI_API_KEY="$TOKEN"
```

OpenAI-compatible clients append `/v1`; Ollama-compatible clients use the base address as-is. Send the token as `Authorization: Bearer <token>` or `X-Api-Key: <token>`. `GET /` and `OPTIONS` never require it.

Default bind mode is **localhost** (`127.0.0.1`). A **Require API token** setting (default on, under **Settings → On-device AI**) lets you turn token checks off for localhost only - any placeholder key works for local CLI clients. **LAN mode always requires the token**, no matter that toggle, rebinds to localhost and rotates the token 12 hours after it's enabled, and is opt-in from the same settings screen. Rotate the token any time with `POST /v1/auth/rotate`.

## Rate limits

Each route has its own per-minute token-bucket limit; a request over it gets `429` with `Retry-After`. Roughly:

| Routes | Limit |
| --- | ---: |
| Reads (`/v1/ai/status`, `/v1/ai/runtime`, `/v1/ai/models`, `GET /v1/models`) | 120 / min |
| Chat, responses, completions, embeddings, tokenize | 60 / min |
| `/v1/audio/transcriptions` | 240 / min |
| `/v1/audio/speech` | 60 / min |
| Model load / download / import | 20 / min |
| Model delete / cancel download / unload / preflight / keep-warm | 30–60 / min |
| Benchmark run (native or harness) | 6 / min |
| Benchmark records (read) | 120 / min |
| Token rotate | 5 / min |

## Errors & status

OpenAI-style routes (`/v1/*`) return a nested OpenAI error object:

```json
{
  "error": {
    "message": "Model 'MODEL_ID' does not exist",
    "type": "invalid_request_error",
    "code": "model_not_found"
  }
}
```

Ollama-style routes (`/api/*`) return a flat `{"error": "..."}` string. Common codes: `model_not_found` (404), `capability_not_supported` (400), `mnn_required_tool_call_missing` (422), `embedding_tokenizer_missing` (400), `embedding_memory` (503, with `Retry-After`), `unsupported_audio_output` (501), `benchmark_running` (409). Missing or wrong bearer token is 401.

## Streaming

`/v1/chat/completions`, `/v1/responses` and `/v1/completions` stream **Server-Sent Events** (`text/event-stream`) with `"stream": true`, ending in a `data: [DONE]` line. `/api/chat` and `/api/generate` stream **newline-delimited JSON** by default, the final line flagged `"done": true`. A non-streaming request returns one JSON body.

## OpenAI-compatible

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/v1/models` | List installed, loadable models with On-device AI metadata |
| GET | `/v1/models/{id}` | Return one model object |
| POST | `/v1/chat/completions` | Chat: text, image/audio input, tools, SSE streaming |
| POST | `/v1/responses` | Stateless Responses adapter (text/image input, function calls) |
| POST | `/v1/completions` | Legacy text completions, SSE streaming |
| POST | `/v1/embeddings` | Embeddings for models advertising `text_embeddings` |
| POST | `/v1/tokenize` | `{model, input}` in, `{tokens: n}` out, the model's own tokenizer |
| POST | `/v1/audio/transcriptions` | Speech to text with the voice input speech model |
| POST | `/v1/audio/speech` | Speech output with the voice model (KittenTTS nano 0.8) |

### `GET /v1/models` metadata

Each entry carries On-device AI fields prefixed with an underscore, so plain OpenAI clients ignore them: `_backend` (`litert-lm` or `mnn-llm`), `_capabilities` (what this install currently serves - `text_chat`, `image_input`, `audio_input`, `tool_use`, `text_embeddings`, `code`, and so on; identical to `_endpoint_capabilities`), `_source_capabilities` (informational upstream claims only - never use these to decide what to send), `_default_max_output_tokens`, `_endpoint_context_window` and `_source_context_window` (the window this device serves vs. the model's own limit), and `_tool_mode` (`prompt_fallback` for MNN, native when advertised for LiteRT).

### Multimodal LiteRT ids

A multimodal LiteRT model shares one downloaded file across up to three ids. By default (the **split** exposure) the bare id is text-only, and only the extra modalities get a suffix:

- `gemma-4-e2b-it-litert-lm` - text (default, canonical id)
- `gemma-4-e2b-it-litert-lm-vision` - text + image
- `gemma-4-e2b-it-litert-lm-audio` - text + audio

Only one modality is loaded at a time. Under **Endpoint exposure → Combined** the bare id serves every modality and there are no suffixed ids; under **Both** the bare id is combined and the text-only split gets its own `-text` suffix. Sending media to a model id that doesn't cover it returns `capability_not_supported`.

### `POST /v1/embeddings`

Only models advertising `text_embeddings` are accepted; others return `capability_not_supported`. `input` is a string or array of strings, at most `_endpoint_max_batch` (currently 64) - a larger batch is `413 batch_too_large`, never a silent drop.

Extra fields beyond `model`, `input`, `dimensions`:

- `input_type` - `"query"` or `"document"` (default). EmbeddingGemma was trained with a task prefix per input; the server adds it, counted inside the model's window (`task: search result | query: ` for a query, `title: <title or none> | text: ` for a document). Other families ignore it.
- `title` - an optional document heading folded into the document prefix. Ignored for `input_type: "query"`.
- `encoding_format` - `"float"` (default) or `"base64"`.

Each `data[i]` also reports `tokens` (the count before truncation, prefix included) and `truncated` (whether the body was cut to fit the window - the prefix itself is never cut). While a chat generation is running elsewhere, embeddings run at background thread priority so they don't slow the live reply. A load that doesn't fit in memory returns `503` with `Retry-After` and `code: "embedding_memory"` (`embedding_memory`), distinct from the plain rate-limit `429`.

```json
{"model": "embeddinggemma-300m", "input": "hello world", "input_type": "document", "title": "note"}
```

### `POST /v1/audio/transcriptions` and `/v1/audio/speech`

`/v1/audio/transcriptions` is speech to text with the installed voice-input speech model (Whisper ACFT or Parakeet): multipart `file` (WAV or raw 16 kHz PCM16), `model`, `language`, `prompt`, `response_format` (`json`, `text` or `verbose_json`). It needs no chat model loaded and is never queued behind a chat generation.

`/v1/audio/speech` **is implemented** - it speaks with the installed voice model (KittenTTS nano 0.8): `input`, `voice`, `speed`, `response_format` (`wav` for the whole clip, `pcm` streamed per sentence). Both return `400` (`stt_model_not_configured` / `tts_model_not_installed`) if the matching model isn't installed, not a blanket 501.

### `POST /v1/tokenize`

`{model, input}` in, `{tokens: n}` out: the model's own tokenizer, no task prefix or BOS/EOS framing added - just the raw count, for splitting long text on real token counts. Only the LiteRT/EmbeddingGemma path exposes a tokenizer today; other backends return `capability_not_supported`.

## Ollama-compatible

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/version` | Compatibility version |
| GET | `/api/tags` | List installed models |
| POST | `/api/show` | Show one model's details and capabilities |
| GET | `/api/ps` | Show the loaded model |
| POST | `/api/chat` | Chat and tool calls, NDJSON streaming |
| POST | `/api/generate` | Prompt-style generation, NDJSON streaming |
| POST | `/api/embed` | Create embeddings when supported |
| POST | `/api/embeddings` | Legacy alias: `{model, prompt}` in, `{embedding: [...]}` out |
| POST | `/api/pull` `/api/create` `/api/push` `/api/copy` `/api/delete` | `501` - not emulated; use the catalog or import flow instead |

## Benchmark

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/v1/ai/benchmarks/run` | Run a benchmark |
| GET | `/v1/ai/benchmarks` | Records and the leaderboard |
| DELETE | `/v1/ai/benchmarks` | Clear records, or one model's with `{"modelId": "…"}` |
| POST | `/v1/ai/runtime/benchmark` | LiteRT-LM's own native `benchmark()` (`tai benchmark --native`) |

`POST /v1/ai/benchmarks/run` takes `{"models": ["id", …], "preset": "quick|standard|thorough", "processors": ["cpu", "gpu"], "eagle": false, "stream": false}`. With `"stream": true` the response is a server-sent event stream (`entry_start`, `phase_start`, `token`, `phase_done`, `entry_done`, `skipped`, `error`, `paused`, `done`); without it, the response is the `done` summary. `GET /v1/ai/benchmarks` returns `{records, leaderboard: {ranked, broken}, benchVersions}`. While a benchmark runs, chat and load requests are refused with `benchmark_running`.

## Model management

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/v1/ai/status` | Overall status, settings, limitations |
| GET | `/v1/ai/runtime` | Loaded model and runtime state |
| GET | `/v1/ai/models` | Detailed model registry |
| GET | `/v1/ai/models/downloads` | Download progress/history |
| POST | `/v1/ai/models/import` | Register a supported local package |
| POST | `/v1/ai/models/download` | Download a model from a URL |
| POST | `/v1/ai/models/download-catalog` | Download a catalog model |
| POST | `/v1/ai/models/downloads/cancel` \| `pause` \| `resume` \| `prioritize` | Manage a download |
| POST | `/v1/ai/models/delete` | Delete an installed user model |
| POST | `/v1/ai/models/load` \| `/v1/ai/runtime/load` | Load a model into the runtime |
| POST | `/v1/ai/models/unload` \| `/v1/ai/runtime/unload` | Unload the active model |
| POST | `/v1/ai/runtime/preflight` | Check whether a model can load safely |
| POST | `/v1/ai/runtime/keep-warm` | Keep a model loaded temporarily |
| POST | `/v1/ai/runtime/cancel` | Cancel active generation |
| POST | `/v1/auth/rotate` | Rotate the API token and rewrite `~/.launcherctl/` |

`POST /v1/ai/runtime/preflight` checks ABI, API level, bundled native libraries, model package readability/format, memory, accelerator policy and known backend history, without touching native runtime code.

## Example requests

```shell
curl -sS -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"model":"MODEL_ID","messages":[{"role":"user","content":"hi"}]}' \
  "$OPENAI_BASE_URL/chat/completions"

curl -sS -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"model":"embeddinggemma-300m","input":"hello world"}' \
  "$OPENAI_BASE_URL/embeddings"
```
