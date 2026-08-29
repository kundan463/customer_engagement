import { useEffect, useRef, useState } from 'react'
import { STAGES } from '../data/journey'
import { useInterval, usePrefersReducedMotion, useReveal } from '../hooks'
import { Icon } from './Icon'

const ADVANCE_MS = 4200

const VERTICALS = [
  'D2C & retail',
  'Beauty & personal care',
  'Health & wellness',
  'Food & beverage',
  'Fashion',
  'Consumer electronics',
]

export function Hero() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduced = usePrefersReducedMotion()
  const threadRef = useRef<HTMLDivElement>(null)

  useInterval(() => setI((v) => (v + 1) % STAGES.length), paused || reduced ? null : ADVANCE_MS)

  // The thread grows as the journey advances — keep the newest line in view.
  // Assigned directly rather than via smooth scrolling, which is driven by the
  // compositor and never lands in a tab that isn't painting; the newest message
  // must be visible, so this one can't be best-effort.
  useEffect(() => {
    const el = threadRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [i])

  const s = STAGES[i]
  const pct = ((i + 1) / STAGES.length) * 100

  // Everything said up to and including this stage.
  const thread = STAGES.slice(0, i + 1).flatMap((st, n) =>
    st.lines.map((l, k) => ({ ...l, key: `${n}-${k}`, fresh: n === i })),
  )

  return (
    <section className="hero" id="top">
      <div className="wrap hero-in">
        <div className="hero-copy">
          <span className="pill hero-badge">
            <span className="dot dot-live" />
            AI customer engagement platform
          </span>

          <h1 className="hero-h1">
            Built For D2C.<br />Powered By <span className="hero-em">Voice</span>.
          </h1>

          <p className="hero-hindi hindi">हर ग्राहक, सुनी गई.</p>

          <p className="hero-sub">
            Automate every customer conversation after purchase — collect feedback,
            resolve issues, recommend products, deliver offers and grow retention with
            AI voice agents across voice, WhatsApp, SMS and email.
          </p>

          <div className="hero-verbs">
            <span>Answer</span><i aria-hidden="true" />
            <span>Engage</span><i aria-hidden="true" />
            <span>Resolve</span><i aria-hidden="true" />
            <span>Retain</span>
          </div>

          <div className="cta-row hero-cta">
            <a href="#demo" className="btn btn-primary btn-lg">
              Book demo
              <Icon name="arrow" size={17} />
            </a>
            <a href="#conversation" className="btn btn-ghost btn-lg">
              <Icon name="play" size={16} />
              Hear a call
            </a>
          </div>

          <ul className="hero-proof">
            <li><strong>40,000+</strong> conversations in production</li>
            <li><strong>3.4×</strong> feedback vs email surveys</li>
            <li><strong>95%</strong> resolved without a human</li>
          </ul>
        </div>

        {/* ---- the customer journey, as a live conversation ---- */}
        <div
          className="hv"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* floating card · where we are */}
          <div className="hv-card hv-now">
            <span className="hv-now-step mono">STEP {String(i + 1).padStart(2, '0')} / 10</span>
            <strong className="hv-now-title">{s.label}</strong>
            <span className="hv-now-line">{s.title}</span>
            <span className="hv-now-track"><i style={{ width: `${pct}%` }} /></span>
          </div>

          {/* floating card · what the business gets */}
          <div className="hv-card hv-out" key={`out-${i}`}>
            <span className="hv-out-k mono">{s.outcomeLabel}</span>
            <strong className="hv-out-v">{s.outcomeValue}</strong>
          </div>

          {/* floating card · the campaign behind it */}
          <div className="hv-card hv-live">
            <div className="hv-live-top">
              <span className="mono">Outbound</span>
              <span className="hv-live-tag">LIVE</span>
            </div>
            <dl>
              <div><dt>Agent</dt><dd>Maya · Feedback</dd></div>
              <div><dt>Channels</dt><dd>Voice + WA</dd></div>
              <div><dt>Languages</dt><dd>Hindi + 4</dd></div>
            </dl>
          </div>

          {/* the phone */}
          <div className="hv-phone">
            <div className="hv-phone-head">
              <span className="hv-avatar">A</span>
              <div>
                <strong>Ananya R</strong>
                <span>online · Hindi + English</span>
              </div>
            </div>

            <div className="hv-callbar">
              <Icon name="phone" size={13} />
              <span>Telenow AI · voice call</span>
              <span className="hv-callbar-t mono">01:24</span>
            </div>

            <div className="hv-thread" ref={threadRef}>
              {thread.map((l) => (
                <div
                  key={l.key}
                  className={`hvm hvm-${l.who.toLowerCase()}${l.fresh ? ' is-fresh' : ''}`}
                >
                  {l.who === 'SYS' ? (
                    <span className="hvm-sys mono">{l.text}</span>
                  ) : (
                    <p className="hvm-bubble">{l.text}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* the ten stages */}
          <div className="hv-rail" role="tablist" aria-label="Customer journey stages">
            <span className="hv-rail-head mono">CUSTOMER JOURNEY</span>
            <div className="hv-dots">
              {STAGES.map((st, n) => (
                <button
                  key={st.label}
                  role="tab"
                  aria-selected={n === i}
                  aria-label={`${n + 1}. ${st.label}`}
                  title={st.label}
                  className={`hv-dot${n === i ? ' is-active' : ''}${n < i ? ' is-done' : ''}`}
                  onClick={() => { setI(n); setPaused(true) }}
                />
              ))}
            </div>
            <button
              className="hv-toggle"
              onClick={() => setPaused((v) => !v)}
              aria-label={paused ? 'Play the journey' : 'Pause the journey'}
            >
              <Icon name={paused ? 'play' : 'pause'} size={12} />
              {paused ? 'Play' : 'Auto'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export function TrustBar() {
  const { ref, className } = useReveal<HTMLDivElement>()
  return (
    <div className="trust">
      <div className="wrap trust-in">
        <span className="trust-label mono">RUNNING IN PRODUCTION ACROSS</span>
        <div ref={ref} className={`trust-list ${className}`}>
          {VERTICALS.map((v) => (
            <span key={v} className="trust-item">{v}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
