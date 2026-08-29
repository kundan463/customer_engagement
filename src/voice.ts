import { useSyncExternalStore } from 'react'

/* =====================================================================
   The demo voice.

   Two sources, one interface. If a real recording is registered for a
   line, that plays. If not, the browser speaks the line itself. The page
   therefore makes sound today and gets better the moment audio is added,
   with no component changes.

   Sound is ON by default, but nothing can speak until the visitor presses
   play — and that press is the gesture browsers require before any audio is
   allowed. Nothing here is ever triggered by scrolling.
   ===================================================================== */

export type Speaker = 'agent' | 'customer' | 'narrator'

/**
 * Real recordings, keyed by line — generated with Telenow's own voices at
 * tts.telenow.ai by `scripts/tts-generate.mjs`, which is also what writes
 * the manifest. Re-run it to refresh:
 *
 *   node scripts/tts-generate.mjs --force
 *
 * Anything without an entry falls back to the browser's own voice, so a
 * partial set is fine. A key that 404s falls back too, rather than playing
 * silence — which is what keeps the single-file artifact build working,
 * since it cannot carry `public/`.
 */
export { CLIPS } from './data/clips'
import { CLIPS } from './data/clips'

/* ---- the on/off preference, shared across the page -------------------- */

/**
 * On by default. Safe only because every path into `speak()` runs behind the
 * player's own play button; see `primeVoice()` for the part that makes it
 * hold on stricter browsers.
 */
let on = true
const listeners = new Set<() => void>()

const emit = () => listeners.forEach((l) => l())

function subscribe(l: () => void) {
  listeners.add(l)
  return () => { listeners.delete(l) }
}

export function voiceSupported() {
  return typeof window !== 'undefined' && ('speechSynthesis' in window || typeof Audio !== 'undefined')
}

export function setVoiceOn(next: boolean) {
  if (on === next) return
  on = next
  if (!on) stopVoice()
  emit()
}

/** Subscribe a component to the shared on/off state. */
export function useVoiceOn() {
  return useSyncExternalStore(subscribe, () => on, () => false)
}

/**
 * Unlock audio for the session, from inside a real click.
 *
 * Chrome grants a page sticky activation on any gesture, so a later
 * programmatic `play()` is fine. Safari and iOS are stricter: they want the
 * playback to begin *in* the gesture, and every clip here starts from a timer
 * a second or two after the button was pressed. Starting something silent
 * during the click itself is what buys the rest of the session.
 *
 * Call it from a click handler, never from an effect.
 */
let primed = false

export function primeVoice() {
  if (primed || typeof window === 'undefined') return
  primed = true
  try {
    // 0.05s of silence — enough to count as playback, too short to hear.
    const blip = new Audio(
      'data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAACAAABhgCAgICAgICAgICAgICAgICAgICAgICAgP////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAAYaCiFb/AAAAAAAAAAAAAAAAAAAA//sQxAADwAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVV//sQxCmDwAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVV',
    )
    blip.volume = 0
    void blip.play().catch(() => {})
  } catch { /* nothing to unlock, or the browser said no — not fatal */ }
  try {
    // speechSynthesis wants the same first push, for the fallback path.
    window.speechSynthesis?.speak(new SpeechSynthesisUtterance(''))
  } catch { /* no synthesis engine */ }
}

/* ---- picking a voice --------------------------------------------------- */

let voices: SpeechSynthesisVoice[] = []

function loadVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  voices = window.speechSynthesis.getVoices()
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices()
  // getVoices() is empty until the engine has enumerated them.
  window.speechSynthesis.addEventListener('voiceschanged', loadVoices)
}

/**
 * The best available voice for a language, and a *different* one for the
 * second speaker where the system has more than one. Where it does not,
 * pitch and rate still tell the two apart — which matters more than timbre
 * for following who is talking.
 */
function pickVoice(lang: string, alt: boolean) {
  if (!voices.length) return undefined
  const prefix = lang.slice(0, 2).toLowerCase()
  const exact = voices.filter((v) => v.lang.toLowerCase().replace('_', '-') === lang.toLowerCase())
  const loose = voices.filter((v) => v.lang.toLowerCase().startsWith(prefix))
  const pool = exact.length ? exact : loose.length ? loose : voices
  return pool[alt && pool.length > 1 ? 1 : 0]
}

const TONE: Record<Speaker, { pitch: number; rate: number; alt: boolean }> = {
  agent: { pitch: 1.06, rate: 1.06, alt: false },
  customer: { pitch: 0.9, rate: 1.0, alt: true },
  narrator: { pitch: 1.0, rate: 1.02, alt: false },
}

/* ---- playback ---------------------------------------------------------- */

let audio: HTMLAudioElement | null = null

export function stopVoice() {
  if (audio) {
    const el = audio
    // Drop the reference first: the handlers below check it to tell a real
    // failure apart from a clip we cancelled on purpose.
    audio = null
    el.pause()
    // `src = ''` is an invalid source and fires an error event. Removing the
    // attribute and reloading detaches cleanly instead.
    el.removeAttribute('src')
    el.load()
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}

function synth(text: string, who: Speaker, lang: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  const u = new SpeechSynthesisUtterance(text)
  const tone = TONE[who]
  const v = pickVoice(lang, tone.alt)
  if (v) u.voice = v
  u.lang = v?.lang ?? lang
  u.pitch = tone.pitch
  u.rate = tone.rate
  u.volume = 1
  window.speechSynthesis.speak(u)
}

/**
 * Say one line. Cancels whatever was saying before it — turns in a
 * conversation replace each other, they do not pile up.
 */
export function speak(key: string, text: string, who: Speaker, lang = 'en-IN') {
  if (!on || !text.trim()) return
  if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return

  stopVoice()

  const clip = CLIPS[key]
  if (clip) {
    const el = new Audio(clip)
    audio = el
    /*
     * A missing or unplayable file is not a reason to go silent — but a clip
     * we cancelled ourselves is not a failure. Both paths check that this is
     * still the current audio, or moving to the next turn would fire the
     * fallback for the line we just left and talk over the new one.
     */
    const fallback = () => {
      if (audio !== el) return
      audio = null
      synth(text, who, lang)
    }
    el.addEventListener('error', fallback, { once: true })
    el.play().catch(fallback)
    return
  }

  synth(text, who, lang)
}

/* Speech keeps going when a tab is hidden; nobody wants a page talking to
   them from a background tab. */
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') stopVoice()
  })
}
