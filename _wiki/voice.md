---
title: Voice & speech
group: Extras
order: 140
---
Voice input turns speech into text, entirely on the phone. Read aloud does the opposite: it speaks
terminal text back to you. Both run on small local models and need nothing installed to try; the
launcher falls back to Android's own speech recognizer until you get one.

## Starting a dictation

Swipe up on the built-in keyboard's **Enter** key and speak; allow the microphone the first time.
A second swipe pauses. Swiping up and holding opens Android's **Choose speech recognizer** list
instead.

A dictation from the keyboard belongs to the keyboard: hiding it stops the dictation. To dictate
with the keyboard down, on Home or the Linux display, add the **Dictate** action
(`tool:voice.dictate`) from **Settings → Keyboard → Terminal extra keys**; it starts or stops a
dictation wherever you are.

## The dictation card

Nothing is typed while you speak. What you say collects in a card at the top right of the place
you are on. The card is whole from the start, in three parts:

- **The strip** on top: the state (**Listening…**, **Transcribing…**, **Cleaning up…**, then
  **Ready**, **Cleaned up** or **Kept as heard**), a small ring while something runs, a few words
  of detail (**· warming up**, **· cleanup undone**, **· at the cursor**, **· to the clipboard**),
  a handle, and **×**, which discards and closes. Swiping the card sideways also discards.
- **The text**, up to seven lines, the oldest scrolling off the top.
- **One control bar**: **Pause** (carrying the waveform) or **Resume**, **Undo** and **Redo** for
  the cleanup, **Copy** and **Insert**.

You can tap **Copy** or **Insert** early, while still listening: the dictation stops and the action
runs once the text is final. Afterwards the strip says **Inserted** or **Copied**.

Drag the strip to move the card; double-tap it to put the card back in the top-right corner.
Portrait and landscape each remember their own spot.

### Where the text goes

**Insert** types where the keyboard would type: a focused field first (command palette, app drawer
search, a rename field), then the Linux display if that is what is showing, then a launcher field
such as a widget editor, then the terminal's focused pane. On Home with nothing focused there is
nowhere to type into, so the text is copied instead.

## Cleanup with a local model

Once a dictation stops, a chat model can pass over the whole thing to fix punctuation, fillers,
grammar and self-corrections ("at five, no, six" becomes "at six"). Changed words are marked in the
card; **Undo** takes the cleanup back.

Cleanup is on by default and needs a Gemma chat model installed (see
[On-device AI](#wiki/on-device-ai)), or a remote model for **Polished**. The switch is
**Clean up dictation**, in the **Dictation cleanup** group of **Settings → Keyboard → Voice input**;
**Cleanup details** explains what it does. While it is on:

| Setting | Choices | Default |
| --- | --- | --- |
| Cleanup level | **Light**: punctuation, fillers and grammar, in your words, on this phone. **Polished**: also paragraphs and lists, using your remote model when one is set up | Polished |
| Cleanup model | Opens the **Tidy dictation** picker: Automatic, an installed model, a **Remote** model, or **Raw text** (no model) | Automatic |

Automatic means Gemma 4 E2B, then E4B, then raw text. On a phone with 6 GB of RAM or less,
Automatic means **Raw text**. A Polished result keeps its line breaks only in programs that accept
bracketed paste; elsewhere they are joined with spaces.

A dictation is kept exactly **as heard**, with no cleanup, when it is under 4 words, when it is a
spoken command (below), or when the model is too slow, unavailable, or its answer looks wrong
rather than a cleanup.

## Spoken commands

Say a command name first and the dictation is written as a command, with fixed rules and no model:
"ls dash la" becomes `ls -la`, "cd slash home slash user" becomes `cd /home/user`, "git add dot"
becomes `git add .`. Spelled letters join up ("L S" is `ls`), and "dash", "dot", "slash", "tilde",
"pipe", "star" and "equals" become their symbols.

## Speech models

With no speech model installed, voice input uses Android's own recognizer, which types straight to
the cursor with no card. Install a model from **Settings → On-device AI → Model centre → Get models
→ Speech**, or from the **Voice typing** row on the Model centre's **Functions** segment:

| Model | Languages | Download |
| --- | --- | ---: |
| Whisper ACFT Base | many languages, or English only | 97 MB |
| Whisper ACFT Small | many languages, or English only | 273 MB |
| Parakeet TDT 0.6B v3 | 25 European languages, auto-detected | 586 MB |

**Base** is faster; **Small** is more accurate for long sentences and noisy rooms. The first model
you finish downloading becomes the one voice input uses. With more than one installed, switch with
**Settings → Keyboard → Voice input → Speech model**.

The **Speech** group of that page also has **Speech engine** (**Android system** or
**On-device**; it switches to On-device by itself once a model is installed) and **Voice language**.

## Listening settings

In the **Listening** group of **Settings → Keyboard → Voice input**:

- **Phrase pause**: how long a pause sends what you have said off to be transcribed.
- **Stop after silence**: how long without speech ends the dictation (5 s, 10 s, 30 s, or
  **Until tap**, which only stops on a tap or the keyboard going down). Default 10 s.
- **Mic sensitivity**: **Normal: ignores background talk**, or **High: for soft speech; may hear
  others**.
- **Listening sounds**: a short sound when listening starts or stops.

## Read aloud with KittenTTS

Install **KittenTTS Nano 0.8** from **Model centre → Get models → Voice output** (about 90 MB). It
is a small voice model, English only, that runs on the phone.

Long-press text in the terminal to select it, then tap **Read aloud** in the selection toolbar. A
reading card opens in the same place as the dictation card:

- The selected text, with the sentence being heard in the accent colour and what was already read
  dimmed; it scrolls by itself.
- The strip says **Reading** with **· preparing** until the first sound, then **· N of M**
  sentences; **Paused** while paused; **Done** at the end, then the card closes.
- **Pause** and **Resume** stop and continue in place, one sentence at a time.
- The voice button (Bruno, Hugo, Jasper or Rosie) changes the voice from the next sentence and
  saves it as the default.
- The stop button, **×**, a sideways swipe, or **Stop reading** in the selection toolbar stop and close.

You can also set the voice and speed in **Settings → Keyboard → Voice input → Speech model → Voice
output**, or with **Voice** and **Speed** on the **Read aloud** row of the Model centre's
**Functions** segment.

Read aloud only appears once the voice model is installed, and it reads English only; other
languages come out wrong.

## From the shell: `tai transcribe` and `tai speak`

```sh
tai transcribe recording.wav
tai speak "The build finished."
some-agent | tai speak
tai speak --stop
```

`tai transcribe` runs the installed speech model over an audio file and prints the plain text.
`tai speak` reads text aloud with the installed voice model, or saves it to a file with `--out`.
Piped text is spoken sentence by sentence as it arrives, with colour codes and Markdown marks
dropped; `--whole` collects everything first and `--stream` forces streaming. `tai speak --stop`
or Ctrl-C stops it. The whole command surface is in [On-device AI](#wiki/on-device-ai); the API
routes (`/v1/audio/transcriptions`, `/v1/audio/speech`, `/v1/ai/speak`) are on the
[On-device AI API](#wiki/on-device-ai-api) page.

Full details: [Voice input](https://github.com/PickleHik3/termux-launcher/blob/dev/docs/en/Voice_Input.md); read aloud is covered in [Text to speech](https://github.com/PickleHik3/termux-launcher/blob/dev/docs/en/Text_To_Speech.md).
