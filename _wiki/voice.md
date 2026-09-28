---
title: Voice & speech
group: Extras
order: 140
---
Voice input turns speech into text, entirely on the phone. Read aloud does the opposite: it speaks
terminal text back to you. Both run on small local models and need nothing installed to try - the
launcher falls back to Android's own speech recognizer until you get one.

## Starting a dictation

Swipe up on the built-in keyboard's **Enter** key and speak; allow the microphone the first time.
A second swipe pauses. Swiping up and holding opens Android's **Choose speech recognizer** list
instead.

A dictation from the keyboard belongs to the keyboard: hiding it stops the dictation. To dictate
with the keyboard down - on Home or the Linux display - add the **Dictate** action
(`tool:voice.dictate`) from **Settings → Keyboard → Edit extra keys**; it starts or stops a
dictation wherever you are.

Nothing is typed while you speak. What you say collects in a pill at the top right of the place
you're on (you can drag it elsewhere; double-tap its handle to put it back). The pill shows a
waveform, the current state (**Listening…**, **Transcribing…**, **Cleaning up…**), pause/resume,
and **×** to discard. It grows down into a panel with the text so far, up to seven lines.

At the bottom of the panel: **undo** (only once a cleanup changed something), **Copy**, and **✓**
(**Insert at the cursor**). You can tap either early, while still listening - the dictation stops
and the action runs once the text is final.

### Where the text goes

**✓** types where the keyboard would type: a focused field first (command palette, app drawer
search, a rename field), then the Linux display if that's what's showing, then a launcher field
such as a widget editor, then the terminal's focused pane. On Home with nothing focused, there's
nowhere to type into, so **✓** copies the text instead.

## Cleanup with a local model

Once a dictation stops, a local chat model can pass over the whole thing to fix punctuation,
capitals, fillers and self-corrections ("at five, no, six" becomes "at six"). Changed words are
marked in the panel; undo takes the cleanup back.

Cleanup is on by default and needs a Gemma chat model installed (see
[On-device AI](#wiki/on-device-ai)). Turn it off with **Polish dictation with local model** in
**Settings → Keyboard → Voice input**. While it's on:

| Setting | Choices | Default |
| --- | --- | --- |
| Cleanup level | Light (punctuation, capitals, fillers) or Polished (also grammar) | Polished |
| Cleanup model | Automatic, or any installed chat model | Automatic |

A dictation is kept exactly **as heard** - no cleanup - when it's under 4 words, when it's a spoken
command (below), or when the model is too slow, unavailable, or its answer looks wrong rather than
a cleanup.

## Spoken commands

Say a command name first and the dictation is written as a command, with fixed rules and no model:
"ls dash la" becomes `ls -la`, "cd slash home slash user" becomes `cd /home/user`, "git add dot"
becomes `git add .`. Spelled letters join up ("L S" is `ls`), and "dash", "dot", "slash", "tilde",
"pipe", "star" and "equals" become their symbols.

## Speech models

With no speech model installed, voice input uses Android's own recognizer, which types straight to
the cursor with no panel. Install a model in **Settings → On-device AI → Model centre → Speech**:

| Model | Languages | Download |
| --- | --- | ---: |
| Whisper ACFT Base | many languages, or English only | 97 MB |
| Whisper ACFT Small | many languages, or English only | 273 MB |
| Parakeet TDT 0.6B v3 | 25 European languages, auto-detected | 586 MB |

**Base** is faster; **Small** is more accurate for long sentences and noisy rooms. The first model
you finish downloading becomes the one voice input uses. With more than one installed, switch with
**Settings → Keyboard → Voice input → Speech model**.

## Listening settings

All in **Settings → Keyboard → Voice input**:

- **Pause that ends a phrase** - how long a pause sends what you've said off to be transcribed.
- **Silence auto-stop** - how long without speech ends the dictation (or **Until tap**, which only
  stops on a tap or the keyboard going down).
- **Mic sensitivity** - **Normal** keeps background talk out; **High** is for speaking softly, at
  the cost of picking up a TV or people nearby.
- **Voice sounds** - a short blip when the microphone opens and closes.

## Read aloud with KittenTTS

Install **KittenTTS Nano 0.8** in **Model centre → Speech → Voice output** (about 90 MB). It's a
small voice model, English only, that runs on the phone.

Long-press text in the terminal to select it, then tap **Read aloud** in the selection toolbar; the
same spot offers **Stop reading** while it plays. Choose the voice (Bruno, Hugo, Jasper or Rosie)
and speed in **Settings → Keyboard → Voice input → Speech model → Voice output**.

Read aloud only appears once the voice model is installed, and it reads English only - other
languages come out wrong.

## From the shell: `tai transcribe` and `tai speak`

```sh
tai transcribe recording.wav
tai speak "The build finished."
```

`tai transcribe` runs the installed speech model over an audio file and prints the plain text.
`tai speak` reads text aloud with the installed voice model, or saves it to a file with `--out`.
Both cover the whole command surface in [On-device AI](#wiki/on-device-ai); the underlying API
routes (`/v1/audio/transcriptions`, `/v1/audio/speech`) are documented on the
[On-device AI API](#wiki/on-device-ai-api) page.
