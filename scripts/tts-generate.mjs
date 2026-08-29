/**
 * Generate the demo-call audio with Telenow's own TTS (tts.telenow.ai).
 *
 * This runs on a machine, never in a browser. The API key stays in
 * `.env.local` (gitignored) and never enters `src/`, because anything under
 * `src/` is bundled and shipped — putting the key there would publish it to
 * every visitor. The page only ever loads the finished MP3s.
 *
 *   node scripts/tts-generate.mjs            # generate what is missing
 *   node scripts/tts-generate.mjs --force    # regenerate everything
 *   node scripts/tts-generate.mjs --only feedback,upsell
 *
 * Writes:
 *   public/audio/<callId>-<n>.mp3   the clips
 *   src/data/clips.ts               the manifest the page imports
 */

import { readFile, writeFile, mkdir, stat } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'public', 'audio')
/** What each clip was rendered from, so a recast only re-renders what moved. */
const STATE = path.join(OUT, '.render-state.json')
const API = 'https://tts.telenow.ai/v1/tts'

const args = process.argv.slice(2)
const FORCE = args.includes('--force')
const ONLY = (() => {
  const i = args.indexOf('--only')
  return i >= 0 && args[i + 1] ? args[i + 1].split(',').map((s) => s.trim()) : null
})()

/* ---- config ------------------------------------------------------------ */

/**
 * Who says what, per call. `ai` is the agent, `cx` the customer.
 *
 * The cast, read out of the transcripts themselves:
 *
 *   feedback  Maya  -> Ananya (f)
 *   support   Maya  -> unnamed (f)
 *   reorder   Maya  -> Kavya  (f)
 *   survey    Maya  -> Meera  (f)
 *   upsell    Priya -> Rohit  (m)      Hinglish, both parts Hindi-voiced
 *
 * Maya takes all four English calls in `sarah-approachable-and-informative-en`
 * and the women customers are `lisa-women-en`, both chosen by the brand. The
 * Hinglish call has its own agent, Priya, because it is a different job in a
 * different language — and a voice Maya's cannot do.
 *
 * Two exceptions, both deliberate:
 *
 * - **The Hinglish call has its own agent.** Its script is Devanagari, and
 *   an English voice reads that badly, so it needs a Hindi-trained voice.
 *   Rather than have Maya sound like two different people across the tabs,
 *   the call is Priya's — a different agent doing a different job.
 *
 *   `devi-smooth-polished-commercial-confident-persuasive-attention-hi` was
 *   offered alongside `anu` and is unused: it reads as a commercial voice,
 *   where this is a post-purchase check-in, and the only other Hindi part in
 *   the page is Rohit, who is a man.
 *
 * Every part is cast by the brand; nothing here is a stand-in.
 */
const VOICES = {
  feedback: { ai: 'sarah-approachable-and-informative-en', cx: 'lisa-women-en', lang: 'en' },
  support: { ai: 'sarah-approachable-and-informative-en', cx: 'lisa-women-en', lang: 'en' },
  reorder: { ai: 'sarah-approachable-and-informative-en', cx: 'lisa-women-en', lang: 'en' },
  /* Maya again. The survey went male for a while, then back — and since it
     now carries her voice, it is her call rather than a second agent wearing
     it. `kunto-engaging-young-female-voice-en` and `hussen-men-hi` were both
     tried here and are now unused. */
  survey: { ai: 'sarah-approachable-and-informative-en', cx: 'lisa-women-en', lang: 'en' },
  // Rohit — young, and it suits him: he is a happy repeat buyer, not a complainant.
  upsell: { ai: 'anu-sweet-warm-sdr-voice-hi', cx: 'sunny-young-expressive-excited-youthful-interactive-bursting-with-natural-hi', lang: 'hi' },
}

/**
 * Render settings, chosen by A/B against the defaults rather than by taste.
 *
 * - `num_step: 128` is the API ceiling; the `quality` presets stop at 48
 *   (`standard`). Latency scales with steps and nobody is waiting on this.
 * - `position_temperature: 1` against a default of **5**. That default
 *   randomises which mask positions get filled, which is how words go
 *   missing. Zero is worse, not better: fully deterministic came back 17%
 *   shorter on a Hindi line, i.e. it dropped content.
 * - `guidance_scale: 3` against a default of 2, for tighter adherence to the
 *   voice reference — the accent — and to the text. This one is load-bearing:
 *   at 2.5 the same Hindi line lost 10% of its length.
 *
 * At these values the durations match the 48-step renders, so the extra
 * fidelity costs no content.
 */
const RENDER = {
  num_step: 128,
  guidance_scale: 3.0,
  position_temperature: 1.0,
}
const FORMAT = 'mp3'
const SAMPLE_RATE = 24000
/** Two at a time — this is someone's GPU, not a load test. */
const CONCURRENCY = 2

/**
 * With sound on the player runs the transcript in real time, so a line's slot
 * is exactly the gap to the next turn in `calls.ts`. Leave a beat at the end
 * of it so one line does not run into the next.
 */
const BREATH = 0.35
/** Past this, faster stops sounding natural. */
const MAX_SPEED = 1.35
/** How many times to chase a fit before accepting a trimmed tail. */
const FIT_ATTEMPTS = 3

/* ---- env --------------------------------------------------------------- */

async function loadEnv() {
  const file = path.join(ROOT, '.env.local')
  if (!existsSync(file)) {
    throw new Error('.env.local not found — it holds OMNIVOICE_API_KEY and is gitignored.')
  }
  const text = await readFile(file, 'utf8')
  for (const line of text.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
  }
  if (!process.env.OMNIVOICE_API_KEY) throw new Error('OMNIVOICE_API_KEY missing from .env.local')
}

/* ---- the call data ------------------------------------------------------ */

/**
 * `calls.ts` is TypeScript, but its only TS is a type-only import and one
 * annotation. Strip those two and it is valid ES — cheaper and more honest
 * than duplicating 41 lines of transcript into this script.
 */
async function loadCalls() {
  const src = await readFile(path.join(ROOT, 'src', 'data', 'calls.ts'), 'utf8')
  const js = src
    .replace(/^\s*import type[^\n]*\n/m, '')
    .replace(/:\s*Conversation\[\]/, '')
  const url = 'data:text/javascript;base64,' + Buffer.from(js, 'utf8').toString('base64')
  const mod = await import(url)
  return mod.CALLS
}

/* ---- synthesis ---------------------------------------------------------- */

async function synth(text, voiceId, language, speed) {
  const res = await fetch(API, {
    method: 'POST',
    headers: {
      'X-API-Key': process.env.OMNIVOICE_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      voice_id: voiceId,
      language,
      format: FORMAT,
      sample_rate: SAMPLE_RATE,
      ...RENDER,
      ...(speed && speed !== 1 ? { speed: +speed.toFixed(2) } : {}),
    }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`${res.status} ${body.slice(0, 200)}`)
  }
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length < 512) throw new Error(`suspiciously small response (${buf.length}B)`)
  return buf
}

/**
 * MP3 duration from the first frame header.
 *
 * The version bits matter: we ask for 24 kHz, which is MPEG-2 (LSF), and
 * MPEG-2 has its own bitrate table. Reading it with the MPEG-1 table returns
 * half the real length — which is exactly the trap that made an earlier run
 * of this script report every clip as comfortably short when most of them
 * were being cut off.
 */
const RATES_V1_L3 = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320]
const RATES_V2_L3 = [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160]

function mp3Seconds(buf) {
  for (let i = 0; i < Math.min(buf.length - 4, 16384); i++) {
    if (buf[i] !== 0xff || (buf[i + 1] & 0xe0) !== 0xe0) continue
    const versionBits = (buf[i + 1] & 0x18) >> 3   // 3 = MPEG-1, 2 = MPEG-2, 0 = MPEG-2.5
    const layerBits = (buf[i + 1] & 0x06) >> 1     // 1 = Layer III
    if (layerBits !== 1 || versionBits === 1) continue
    const mpeg1 = versionBits === 3
    const kbps = (mpeg1 ? RATES_V1_L3 : RATES_V2_L3)[(buf[i + 2] & 0xf0) >> 4]
    if (!kbps) continue
    // Frames carry 1152 samples on MPEG-1 and 576 on MPEG-2/2.5, so a
    // same-bitrate MPEG-2 file is twice the duration per byte.
    return (buf.length * 8) / (kbps * 1000)
  }
  return NaN
}

/* ---- run ---------------------------------------------------------------- */

async function main() {
  await loadEnv()
  await mkdir(OUT, { recursive: true })
  const calls = await loadCalls()

  let prevState = {}
  if (existsSync(STATE)) {
    try { prevState = JSON.parse(await readFile(STATE, 'utf8')) } catch { prevState = {} }
  }
  // --force ignores the record when deciding what to render, but still keeps
  // it so a targeted re-render does not orphan everything else.
  const state = FORCE ? {} : prevState

  /*
   * Every line of every call, whatever `--only` says. The manifest and the
   * review sheet are built from this and from what is actually on disk, not
   * from the subset this run rendered — otherwise a targeted re-render drops
   * the other calls out of the page and sends them back to the browser voice.
   */
  const allLines = []
  for (const call of calls) {
    const cfg = VOICES[call.id]
    if (!cfg) { console.warn(`! no voice mapping for "${call.id}" — skipped`); continue }

    call.turns.forEach((turn, n) => {
      allLines.push({
        key: `call:${call.callId}:${n}`,
        file: `${call.callId}-${String(n).padStart(2, '0')}.mp3`,
        text: turn.text,
        voice: turn.who === 'CX' ? cfg.cx : cfg.ai,
        lang: cfg.lang,
        // Seconds this line has before the next turn cancels it. The last
        // turn has nothing after it, so it plays out however long it is.
        gap: call.turns[n + 1] ? call.turns[n + 1].at - turn.at : Infinity,
        callId: call.callId,
        call: call.id,
      })
    })
  }

  const jobs = ONLY ? allLines.filter((l) => ONLY.includes(l.call)) : allLines

  console.log(
    `${jobs.length} lines · ${RENDER.num_step} steps · g=${RENDER.guidance_scale} · ` +
    `posT=${RENDER.position_temperature} · ${FORMAT}@${SAMPLE_RATE}\n`,
  )

  const done = []
  const failed = []
  let i = 0

  async function worker() {
    while (i < jobs.length) {
      const job = jobs[i++]
      const dest = path.join(OUT, job.file)
      /*
       * Everything that decides what comes out of the API is part of a clip's
       * identity. The render settings, or raising the step count re-renders
       * nothing. The slot too: it sets how much the line has to be sped up to
       * fit, so retiming a turn in `calls.ts` has to invalidate its audio.
       */
      const stamp = `${job.voice}|${job.lang}|${sha(job.text)}|${RENDER_ID}|${job.gap}`
      if (!FORCE && existsSync(dest) && state[job.file] === stamp) {
        const s = await stat(dest)
        done.push({ ...job, bytes: s.size, cached: true, stamp })
        continue
      }
      try {
        let buf = await synth(job.text, job.voice, job.lang, 1)
        let secs = mp3Seconds(buf)
        let speed = 1

        /*
         * Each turn cancels the one before it, so a line that runs past its
         * slot is heard cut off mid-sentence. Where that happens, ask for the
         * same line delivered a little faster — capped, because past about
         * 1.35x it stops sounding like someone talking and starts sounding
         * like someone in a hurry. A line that still will not fit is left
         * natural: better a clean tail trimmed than the whole line gabbled.
         */
        if (Number.isFinite(secs) && Number.isFinite(job.gap)) {
          const room = job.gap - BREATH
          /*
           * The model does not hit a requested speed exactly, and a single
           * retry sometimes comes back no shorter than the take it was meant
           * to replace. Ask a couple of times, aiming from where the last
           * attempt actually landed, and keep the shortest — the alternative
           * is a line whose tail is cut off, and on this page the tails are
           * where the offers are.
           */
          for (let attempt = 0; attempt < FIT_ATTEMPTS && secs > room; attempt++) {
            const want = Math.min(MAX_SPEED, speed * (secs / room))
            if (want <= speed + 0.01) break
            const faster = await synth(job.text, job.voice, job.lang, want)
            const fasterSecs = mp3Seconds(faster)
            if (Number.isFinite(fasterSecs) && fasterSecs < secs) {
              buf = faster
              secs = fasterSecs
              speed = want
            }
            if (want >= MAX_SPEED) break
          }
        }

        await writeFile(dest, buf)
        const over = Number.isFinite(secs) && Number.isFinite(job.gap) && secs > job.gap
        done.push({ ...job, bytes: buf.length, secs, speed, stamp })
        console.log(
          `  ok ${job.file}  ${(buf.length / 1024).toFixed(0).padStart(4)}KB  ` +
          `${Number.isFinite(secs) ? secs.toFixed(1).padStart(4) + 's' : '   ?  '}` +
          `${speed !== 1 ? `  x${speed.toFixed(2)}` : '       '}` +
          `${Number.isFinite(job.gap) ? `  slot ${job.gap}s` : '  (last line)'}` +
          `${over ? '  ⚠ still over' : ''}`,
        )
      } catch (err) {
        failed.push({ ...job, err: String(err.message || err) })
        console.log(`  !! ${job.file}  ${err.message || err}`)
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker))

  // The manifest the page imports: every line that has a file on disk, so a
  // `--only` run refreshes some clips without unlisting the rest.
  const onDisk = allLines
    .filter((l) => existsSync(path.join(OUT, l.file)))
    .sort((a, b) => a.file.localeCompare(b.file))

  const entries = onDisk.map((l) => `  '${l.key}': '/audio/${l.file}',`).join('\n')

  const manifest = `/* GENERATED by scripts/tts-generate.mjs — do not edit by hand.
 *
 * One entry per line of the call simulator, synthesised with Telenow's own
 * voices at tts.telenow.ai. Re-run the script to refresh:
 *
 *   node scripts/tts-generate.mjs --force
 */

export const CLIPS: Record<string, string> = {
${entries}
}
`
  await writeFile(path.join(ROOT, 'src', 'data', 'clips.ts'), manifest, 'utf8')

  /*
   * Merge, do not replace. A `--only` run knows about its own call and
   * nothing else, so writing just those stamps would drop every other clip's
   * record and quietly re-render the lot on the next run.
   */
  const nextState = { ...prevState }
  for (const d of done) nextState[d.file] = d.stamp
  await writeFile(STATE, JSON.stringify(nextState, null, 2) + '\n', 'utf8')

  await writeReviewSheet(onDisk, done)

  const cached = done.filter((d) => d.cached).length
  const total = done.reduce((n, d) => n + d.bytes, 0)
  const longest = done.filter((d) => Number.isFinite(d.secs) && d.secs > d.gap)
  console.log(`\n${done.length} clips · ${(total / 1024 / 1024).toFixed(2)}MB · manifest written`)
  if (longest.length) {
    console.log(`${longest.length} clip(s) run past their slot and will be cut short:`)
    longest.forEach((d) => console.log(`   ${d.file}  ${d.secs.toFixed(1)}s in a ${d.gap}s gap`))
  }
  if (failed.length) {
    console.log(`\n${failed.length} failed:`)
    failed.forEach((f) => console.log(`   ${f.file}  ${f.err}`))
    process.exitCode = 1
  }
}

/**
 * A page for listening to every clip against the line it is meant to say.
 *
 * The model is still training and can hallucinate — say something other than
 * the text it was given — and nothing in the pipeline can catch that: the
 * service's own word-miss detector compares *durations*, so it flags dropped
 * words, not wrong ones. Only an ear can. This makes that a two-minute job
 * instead of a spelunk through 41 files.
 *
 * Serve it with `npm run dev` and open /audio-review.html.
 */
async function writeReviewSheet(onDisk, done) {
  const speed = new Map(done.map((d) => [d.file, d.speed]))
  const rows = onDisk
    .map((d) => `    <tr>
      <td class="f">${d.file}${speed.get(d.file) > 1 ? ` <em>x${speed.get(d.file).toFixed(2)}</em>` : ''}</td>
      <td class="t">${escapeHtml(d.text)}</td>
      <td><audio controls preload="none" src="/audio/${d.file}"></audio></td>
    </tr>`)
    .join('\n')

  const html = `<!doctype html>
<meta charset="utf-8">
<meta name="robots" content="noindex, nofollow">
<title>Demo call audio — review</title>
<style>
  body { font: 15px/1.6 system-ui, sans-serif; margin: 0; padding: 32px; color: #13233F; background: #FBF8F3; }
  h1 { font: 600 22px/1.2 system-ui; margin: 0 0 6px; }
  p.lede { color: #55637C; max-width: 68ch; margin: 0 0 26px; }
  table { border-collapse: collapse; width: 100%; background: #fff; border: 1px solid #E8E3DA; border-radius: 12px; overflow: hidden; }
  th, td { text-align: left; padding: 10px 14px; border-bottom: 1px solid #F1EDE6; vertical-align: top; }
  th { font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: #616D85; background: #FBF8F3; }
  tr:last-child td { border-bottom: 0; }
  .f { font-family: ui-monospace, monospace; font-size: 12px; color: #55637C; white-space: nowrap; }
  .f em { color: #A8430C; font-style: normal; }
  .t { max-width: 62ch; }
  audio { height: 34px; }
  code { background: #F5F1EA; padding: 1px 5px; border-radius: 4px; font-size: 13px; }
</style>
<h1>Demo call audio — review</h1>
<p class="lede">
  Listen to each clip against the line it is meant to say. The voice model is
  still training and can say something other than the text it was given —
  nothing automatic catches that, because the service compares durations, not
  words. If a clip is wrong, replace the file at
  <code>public/audio/&lt;name&gt;.mp3</code> with a recording of your own, or
  delete it and re-run <code>npm run audio</code> to try again. The page needs
  no code change either way: it loads whatever is at that path.
</p>
<table>
  <thead><tr><th>File</th><th>Should say</th><th>Listen</th></tr></thead>
  <tbody>
${rows}
  </tbody>
</table>
`
  await writeFile(path.join(ROOT, 'public', 'audio-review.html'), html, 'utf8')
}

/** Identity of the render settings, so changing them invalidates every clip. */
const RENDER_ID = createHash('sha1').update(JSON.stringify(RENDER)).digest('hex').slice(0, 8)

/** Identity of a line's text, so an edited transcript re-renders its clip. */
function sha(text) {
  return createHash('sha1').update(text, 'utf8').digest('hex').slice(0, 12)
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
}

main().catch((err) => { console.error(err); process.exit(1) })
