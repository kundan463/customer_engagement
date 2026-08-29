# Demo voice — real recordings

Anything in here overrides the browser's own voice. Files are optional: every
line falls back to speech synthesis, so the page makes sound with this folder
empty.

## Adding one

1. Drop the file in here, e.g. `feedback-01.mp3`.
2. Register it in `src/voice.ts` under `CLIPS`, keyed by the line:

   Keys are `call:<callId>:<turnIndex>` — one per turn of the Live
   conversation simulator. Call ids are in `src/data/calls.ts`
   (`CX-8841`, and so on); turn indexes are the order in that call's
   `turns` array, from `0`.

```ts
export const CLIPS: Record<string, string> = {
  'call:CX-8841:0': '/audio/feedback-01.mp3',
}
```

A partial set is fine — registered lines play the recording, the rest are
spoken by the browser.

## Two things to know

- **Keep clips shorter than the gap to the next turn.** The simulator plays at
  2.2x and each new turn cancels the one before it, so a long clip is cut off
  rather than overlapped. The `at` values in `calls.ts` are the real seconds.
- **The single-file artifact build cannot carry these.** `npm run build:artifact`
  inlines JS and CSS but not `public/`, so a registered clip 404s there and the
  browser voice takes over. That is handled, not a bug — but it means the
  artifact always demos with synthesis.
