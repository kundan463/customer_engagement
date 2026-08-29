import { useEffect, useMemo, useRef, useState } from 'react'
import { CONVERSATIONS } from '../data/conversations'
import { usePrefersReducedMotion, useReveal } from '../hooks'

const BARS = 40
/** Plays faster than wall-clock so the demo doesn't drag; the clock shows call time. */
const RATE = 2.6

/** Deterministic per-conversation waveform, so it never reshuffles on re-render. */
function waveform(seed: string) {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return Array.from({ length: BARS }, (_, i) => {
    h = (h * 1664525 + 1013904223) >>> 0
    const base = 0.28 + ((h >>> 8) % 1000) / 1000 * 0.72
    const env = 0.55 + 0.45 * Math.sin((i / BARS) * Math.PI * 2.2)
    return Math.max(0.12, Math.min(1, base * env))
  })
}

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

export function Conversation() {
  const [tab, setTab] = useState(0)
  const [t, setT] = useState(0)
  const [playing, setPlaying] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const raf = useRef(0)
  const last = useRef(0)
  const reduced = usePrefersReducedMotion()
  const h = useReveal<HTMLHeadingElement>()
  const p = useReveal<HTMLParagraphElement>()

  const c = CONVERSATIONS[tab]
  const wave = useMemo(() => waveform(c.id), [c.id])

  useEffect(() => { setT(0); setPlaying(false) }, [tab])

  useEffect(() => {
    if (!playing) return
    last.current = performance.now()
    const tick = (now: number) => {
      // Clamp so a backgrounded tab resumes where it paused rather than jumping.
      const dt = Math.min((now - last.current) / 1000, 0.1)
      last.current = now
      setT((prev) => {
        const next = prev + dt * RATE
        if (next >= c.duration) { setPlaying(false); return c.duration }
        return next
      })
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [playing, c.duration])

  const shown = c.turns.filter((x) => x.at <= t)
  const nextTurn = c.turns.find((x) => x.at > t)
  const typing = playing && nextTurn?.who === 'AI' && nextTurn.at - t < 1.6
  const done = t >= c.duration

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [shown.length, typing])

  const sentiment = [...shown].reverse().find((x) => x.sentiment)?.sentiment ?? { pos: 0, neu: 100, neg: 0 }
  const intents = shown.map((x) => x.intent).filter(Boolean) as string[]
  const playhead = Math.floor((t / c.duration) * BARS)

  const toggle = () => {
    if (done) { setT(0); setPlaying(true); return }
    setPlaying((v) => !v)
  }

  return (
    <section className="section" id="conversation">
      <div className="eyebrow">Hear it yourself</div>
      <h2 className={`section-head ${h.className}`} ref={h.ref}>
        This is how she <span className="accent">actually</span> talks.
      </h2>
      <p className={`section-sub ${p.className}`} ref={p.ref}>
        Press play on a real conversation shape. She answers — then she asks something back. That
        second half is why she stays, and why the recommendation lands.
      </p>

      <div className="cv-tabs" role="tablist" aria-label="Conversation types">
        {CONVERSATIONS.map((x, n) => (
          <button
            key={x.id}
            role="tab"
            aria-selected={n === tab}
            className={`cv-tab${n === tab ? ' on' : ''}`}
            onClick={() => setTab(n)}
          >
            {x.tab}
          </button>
        ))}
      </div>

      <div className="cv">
        <div className="cv-bar">
          <span className="cv-av">{c.initial}</span>
          <span className="cv-who">
            <span className="nm">{c.agent}</span>
            <span className="rl">{c.role}</span>
          </span>
          <span className="cv-tags">
            <span className="cv-pill wa">{c.channel}</span>
            <span className="cv-pill">{c.lang}</span>
            <span className="cv-pill">{c.callId}</span>
          </span>
        </div>

        <div className="cv-body">
          {/* player */}
          <div className="cv-pane">
            <div className="cv-lbl">Playback</div>
            <div className="cv-wave" aria-hidden="true">
              {wave.map((hgt, n) => {
                const active = playing && !reduced && n === playhead
                const cls = n < playhead ? 'past' : n === playhead ? 'now' : ''
                return <i key={n} className={cls} style={{ height: `${(active ? Math.min(1, hgt * 1.25) : hgt) * 100}%` }} />
              })}
            </div>
            <div className="cv-play">
              <button className="cv-btn" onClick={toggle} aria-label={playing ? 'Pause conversation' : 'Play conversation'}>
                {playing ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                    <rect x="2.5" y="2" width="3.2" height="10" rx="1" />
                    <rect x="8.3" y="2" width="3.2" height="10" rx="1" />
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor" aria-hidden="true">
                    <path d="M4 2.6l8.4 4.9L4 12.4z" />
                  </svg>
                )}
              </button>
              <span className="cv-time">{mmss(t)} / {mmss(c.duration)}</span>
            </div>
            <div className="cv-track"><i style={{ width: `${(t / c.duration) * 100}%` }} /></div>
            <div className="cv-meta">
              {c.meta.map((m) => (
                <div className="r" key={m.k}>
                  <span className="k">{m.k}</span>
                  <span className="v">{m.v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* transcript */}
          <div className="cv-pane">
            <div className="cv-lbl">Live transcript</div>
            <div className="cv-scroll" ref={scrollRef} aria-live="polite">
              {shown.length === 0 && !typing ? (
                <div className="cv-idle">
                  Press play to run the conversation.<br />
                  Transcript, datapoints and her coupon build as it goes.
                </div>
              ) : (
                <>
                  {shown.map((x, n) => (
                    <div key={n} className={`bub ${x.who === 'AI' ? 'ai' : 'cx'}`}>
                      <span className="tag">{x.who === 'AI' ? 'Telenow AI' : 'Customer'}</span>
                      {x.text}
                    </div>
                  ))}
                  {typing && <div className="cv-typing" aria-label="Agent is replying"><i /><i /><i /></div>}
                </>
              )}
            </div>
          </div>

          {/* analysis */}
          <div className="cv-pane">
            <div className="cv-lbl">What you get back</div>

            <div className="cv-score">
              <b>{done ? c.score : shown.length ? (sentiment.pos / 10).toFixed(1) : '—'}</b>
              <span>Her sentiment</span>
            </div>
            <div className="cv-sent">
              <i className="pos" style={{ width: `${sentiment.pos}%` }} />
              <i className="neu" style={{ width: `${sentiment.neu}%` }} />
              <i className="neg" style={{ width: `${sentiment.neg}%` }} />
            </div>
            <div className="cv-legend">
              <span><em style={{ background: 'var(--wa-green-dark)' }} />Positive</span>
              <span><em style={{ background: 'var(--ink-soft)' }} />Neutral</span>
              <span><em style={{ background: '#DC2626' }} />Negative</span>
            </div>

            <div className="cv-lbl">Detected intent</div>
            <div className="cv-intents">
              {intents.length === 0
                ? <span className="cv-intent">Listening…</span>
                : intents.map((x, n) => <span className="cv-intent" key={n}>{x}</span>)}
            </div>

            <div className="cv-lbl">Summary</div>
            <div className="cv-sum">
              {done ? c.summary : 'Summary appears when the conversation finishes.'}
            </div>

            <div className={`cv-outcome${done ? '' : ' cv-pending'}`}>
              <span className="h">{done ? 'Outcome generated' : 'Outcome pending'}</span>
              {c.outcomes.map((o) => <div className="o" key={o}><span>{o}</span></div>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
