import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CALLS } from '../data/calls'
import { usePrefersReducedMotion, useReveal } from '../hooks'
import { CallButton } from './LiveAgent'
import { Icon } from './Icon'
import { VoiceToggle } from './VoiceToggle'
import { primeVoice, speak, stopVoice, useVoiceOn } from '../voice'

/**
 * Demo speed. Silent, a 48-second call replays in about 22 seconds.
 *
 * With sound on it drops to real time, because the voice cannot be
 * compressed with it: each turn cancels the one before, so a transcript
 * running at 2.2x would cut every line off mid-sentence. The clips are cut
 * to the real gaps in `calls.ts`, so at 1x each one has exactly its slot.
 */
const SPEED = 2.2
const SPEED_VOICED = 1
const BARS = 64

const clock = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`

/** Deterministic waveform so the shape is stable across renders. */
const waveform = (seed: number) =>
  Array.from({ length: BARS }, (_, i) => {
    const n = Math.sin((i + seed) * 1.7) * Math.cos((i + seed) * 0.53) + Math.sin(i * 0.31 + seed)
    return 0.24 + Math.abs(n) * 0.38
  })

export function LiveCall() {
  const [tab, setTab] = useState(0)
  const [t, setT] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [started, setStarted] = useState(false)
  const reduced = usePrefersReducedMotion()
  const voiceOn = useVoiceOn()
  const { ref, className } = useReveal<HTMLDivElement>()
  const bodyRef = useRef<HTMLDivElement>(null)
  /** The last turn spoken, so a re-render never says the same line twice. */
  const said = useRef(-1)

  const call = CALLS[tab]
  const bars = useMemo(() => waveform(tab * 3 + 1), [tab])
  const end = call.duration + 2

  // Playback clock — a timer, deliberately not requestAnimationFrame. This is
  // a transcript clock, not a 60fps animation, and rAF is starved whenever the
  // tab isn't painting: that would leave the player reading "On call" while
  // nothing actually advanced. The delta is measured against the wall clock and
  // clamped, so a backgrounded tab resumes where it paused instead of jumping.
  const speed = voiceOn ? SPEED_VOICED : SPEED

  useEffect(() => {
    if (!playing) return
    let prev = performance.now()
    const id = window.setInterval(() => {
      const now = performance.now()
      const dt = Math.min((now - prev) / 1000, 0.5)
      prev = now
      setT((v) => {
        const next = v + dt * speed
        if (next >= end) { setPlaying(false); return end }
        return next
      })
    }, 60)
    return () => window.clearInterval(id)
  }, [playing, end, speed])

  const select = useCallback((n: number) => {
    stopVoice()
    said.current = -1
    setTab(n)
    setT(0)
    setStarted(false)
    setPlaying(false)
  }, [])

  const toggle = () => {
    // Inside the click, while the gesture still counts.
    primeVoice()
    if (t >= end) { setT(0); said.current = -1 }
    if (playing) stopVoice()
    setStarted(true)
    setPlaying((v) => !v)
  }

  const restart = () => {
    primeVoice()
    stopVoice()
    said.current = -1
    setT(0)
    setStarted(true)
    setPlaying(true)
  }

  const visible = call.turns.filter((x) => x.at <= t)
  const nextTurn = call.turns[visible.length]
  const done = t >= end
  // The last read that actually landed; the meter holds it in between.
  const sentiment = [...visible].reverse().find((x) => x.sentiment)?.sentiment ?? { pos: 30, neu: 64, neg: 6 }
  const intent = [...visible].reverse().find((x) => x.intent)?.intent
  const progress = Math.min(1, t / call.duration)
  const speaking = visible.length ? visible[visible.length - 1].who : null

  useEffect(() => {
    const el = bodyRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [visible.length])

  /**
   * Say the line that just landed. Keyed on how many turns are showing, so
   * scrubbing backwards and forwards re-speaks correctly and a re-render on
   * its own never repeats a line.
   */
  useEffect(() => {
    if (!voiceOn || !playing || !visible.length) return
    const n = visible.length - 1
    if (n === said.current) return
    said.current = n
    const turn = visible[n]
    speak(
      `call:${call.callId}:${n}`,
      turn.text,
      turn.who === 'CX' ? 'customer' : 'agent',
      call.lang.toLowerCase().includes('hindi') || call.lang.toLowerCase().includes('hinglish')
        ? 'hi-IN'
        : 'en-IN',
    )
  }, [visible.length, voiceOn, playing, call.callId, call.lang])

  /* Leaving the section, or the page, should not leave a voice running. */
  useEffect(() => () => stopVoice(), [])
  useEffect(() => { if (!playing) stopVoice() }, [playing])

  const revealed = (n: number) => started && (done || visible.length > call.turns.length - 3 + n)

  return (
    <section className="section" id="conversation">
      <div className="wrap">
        <div className="sec-head sec-head-split">
          <div>
            <span className="eyebrow t-aqua">Live conversation</span>
            <h2 className="h2">Experience a real AI conversation</h2>
          </div>
          <p className="lede">
            Press play. The transcript, the sentiment read, the outcome fields and
            the actions taken are the same ones your team would see after a real
            call — five different call types, five different jobs.
          </p>
        </div>

        <div ref={ref} className={`lc ${className}`}>
          <div className="lc-tabs" role="tablist" aria-label="Call types">
            {CALLS.map((c, n) => (
              <button
                key={c.id}
                role="tab"
                aria-selected={n === tab}
                className={`lc-tab${n === tab ? ' is-active' : ''}`}
                onClick={() => select(n)}
              >
                {c.tab}
              </button>
            ))}
          </div>

          <div className="lc-grid">
            {/* ---------- player ---------- */}
            <div className="lc-player panel">
              <div className="lc-head">
                <span className={`lc-avatar${playing ? ' is-live' : ''}`}>{call.initial}</span>
                <div className="lc-who">
                  <strong>{call.agent}</strong>
                  <span>{call.role} · {call.channel}</span>
                </div>
                <span className={`pill ${playing ? 't-aqua' : ''} lc-state`}>
                  {playing && <span className="dot dot-live" />}
                  {playing ? 'On call' : done && started ? 'Ended' : 'Ready'}
                </span>
              </div>

              <div className="lc-wave-wrap">
                <button
                  className="lc-wave"
                  onClick={(e) => {
                    const r = e.currentTarget.getBoundingClientRect()
                    setStarted(true)
                    setT(Math.max(0, Math.min(call.duration, ((e.clientX - r.left) / r.width) * call.duration)))
                  }}
                  aria-label="Scrub the call"
                >
                  {bars.map((h, n) => {
                    const on = n / BARS <= progress
                    return (
                      <span
                        key={n}
                        className={`lc-bar${on ? ' is-on' : ''}${on && playing && !reduced ? ' is-live' : ''}`}
                        style={{
                          height: `${h * 100}%`,
                          animationDelay: `${(n % 9) * 70}ms`,
                          background: on
                            ? speaking === 'CX'
                              ? 'var(--ink)'
                              : 'var(--orange)'
                            : undefined,
                        }}
                      />
                    )
                  })}
                </button>
                <div className="lc-wave-foot">
                  <p className="lc-wave-note mono">
                    {voiceOn
                      ? 'REAL-TIME PLAYBACK · TELENOW VOICES'
                      : 'TRANSCRIPT PLAYBACK · 2.2×'}
                  </p>
                  <VoiceToggle />
                </div>
              </div>

              <div className="lc-controls">
                <button className="lc-play" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
                  <Icon name={playing ? 'pause' : 'play'} size={18} />
                </button>
                <button className="lc-mini" onClick={restart} aria-label="Restart the call">
                  <Icon name="refresh" size={15} />
                </button>
                <span className="lc-time mono">{clock(Math.min(t, call.duration))} / {clock(call.duration)}</span>
                <span className="lc-lang mono">{call.lang} · {call.callId}</span>
              </div>

              <div className="lc-transcript" ref={bodyRef}>
                {!started && (
                  <div className="lc-empty">
                    <span className="lc-empty-ring"><Icon name="voice" size={22} /></span>
                    <p>Press play to hear how a <strong>{call.tab.toLowerCase()}</strong> runs.</p>
                  </div>
                )}

                {visible.map((turn, n) => (
                  <div key={n} className={`lt lt-${turn.who.toLowerCase()}`}>
                    <span className="lt-who mono">{turn.who === 'AI' ? call.agent.toUpperCase() : 'CUSTOMER'}</span>
                    <p className="lt-bubble">{turn.text}</p>
                    <span className="lt-at mono">{clock(turn.at)}</span>
                  </div>
                ))}

                {started && !done && nextTurn && (
                  <div className={`lt lt-${nextTurn.who.toLowerCase()} lt-typing`}>
                    <span className="lt-dots"><i /><i /><i /></span>
                  </div>
                )}
              </div>
            </div>

            {/* ---------- analysis rail ---------- */}
            <div className="lc-rail">
              <div className="lc-box panel">
                <h4 className="lc-box-h mono">DETECTED SENTIMENT</h4>
                <div className="lc-sent">
                  <div className="lc-sent-bar" role="img" aria-label={`Positive ${sentiment.pos}%, neutral ${sentiment.neu}%, negative ${sentiment.neg}%`}>
                    <span className="lc-seg lc-pos" style={{ width: `${sentiment.pos}%` }} />
                    <span className="lc-seg lc-neu" style={{ width: `${sentiment.neu}%` }} />
                    <span className="lc-seg lc-neg" style={{ width: `${sentiment.neg}%` }} />
                  </div>
                  <ul className="lc-sent-key">
                    <li><span className="lc-key lc-pos" />Positive<b>{Math.round(sentiment.pos)}%</b></li>
                    <li><span className="lc-key lc-neu" />Neutral<b>{Math.round(sentiment.neu)}%</b></li>
                    <li><span className="lc-key lc-neg" />Negative<b>{Math.round(sentiment.neg)}%</b></li>
                  </ul>
                </div>
                <div className="lc-intent">
                  <span className="mono">INTENT</span>
                  <code>{intent ?? '—'}</code>
                </div>
              </div>

              <div className="lc-box panel">
                <h4 className="lc-box-h mono">CALL SUMMARY</h4>
                {done && started ? (
                  <p className="lc-summary">{call.summary}</p>
                ) : (
                  <p className="lc-summary is-pending">
                    <span className="lc-skel" /><span className="lc-skel" /><span className="lc-skel short" />
                    Generated when the call ends.
                  </p>
                )}
                <div className="lc-score">
                  <span className="mono">SCORE</span>
                  <strong>{done && started ? call.score : '—'}</strong>
                </div>
              </div>

              <div className="lc-box panel">
                <h4 className="lc-box-h mono">POST-CALL ANALYSIS</h4>
                <dl className="lc-fields">
                  {call.meta.map((m, n) => (
                    <div key={m.k} className={`lc-field${revealed(n) ? ' is-in' : ''}`}>
                      <dt className="mono">{m.k}</dt>
                      <dd className="mono">{revealed(n) ? m.v : '···'}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="lc-box panel">
                <h4 className="lc-box-h mono">OUTCOME GENERATED</h4>
                <ul className="lc-outcomes">
                  {call.outcomes.map((o, n) => (
                    <li key={o} className={revealed(n) ? 'is-in' : ''}>
                      <Icon name="check" size={15} />
                      {o}
                    </li>
                  ))}
                </ul>
                <CallButton className="btn btn-primary btn-sm btn-block lc-cta">
                  Talk to Maya yourself
                  <Icon name="voice" size={15} />
                </CallButton>
                <a href="#demo" className="lc-cta-alt">Or book a demo for your brand</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
