import { useEffect, useRef, useState } from 'react'
import { JOURNEY } from '../data/journey'
import { useReveal } from '../hooks'
import { Icon } from './Icon'

export function Journey() {
  const [i, setI] = useState(0)
  /**
   * Which way the reader is travelling. The body enters from the side they
   * came from, so a step change reads as movement along the journey rather
   * than as a panel being swapped out.
   */
  const [dir, setDir] = useState<'next' | 'prev'>('next')
  const railRef = useRef<HTMLDivElement>(null)
  const { ref, className } = useReveal<HTMLDivElement>()
  const step = JOURNEY[i]
  const last = JOURNEY.length - 1

  const go = (n: number) => {
    const to = Math.max(0, Math.min(last, n))
    if (to === i) return
    setDir(to > i ? 'next' : 'prev')
    setI(to)
  }

  /**
   * Which ends of the rail have steps scrolled off them. The edge fade is
   * the only cue that there are more than fit, so it has to be honest — a
   * permanent fade over a rail that isn't scrolled reads as a rendering bug.
   */
  const [edge, setEdge] = useState('none')

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return

    const measure = () => {
      const max = rail.scrollWidth - rail.clientWidth
      if (max <= 4) return setEdge('none')
      const l = rail.scrollLeft > 4
      const r = rail.scrollLeft < max - 4
      setEdge(l && r ? 'both' : l ? 'left' : r ? 'right' : 'none')
    }

    measure()
    rail.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      rail.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [])

  useEffect(() => {
    const rail = railRef.current
    const node = rail?.querySelector<HTMLElement>('[data-active="true"]')
    if (!rail || !node || rail.scrollWidth <= rail.clientWidth + 4) return
    rail.scrollTo({ left: node.offsetLeft - rail.clientWidth / 2 + node.offsetWidth / 2, behavior: 'smooth' })
  }, [i])

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1) }
  }

  return (
    <section className="section section-alt" id="journey">
      <div className="wrap">
        <div className="sec-head sec-head-split">
          <div>
            <span className="eyebrow t-aqua">The customer journey</span>
            <h2 className="h2">See how the entire journey works</h2>
          </div>
          <p className="lede">
            Ten steps from a parcel landing on a doorstep to a number on your
            dashboard. Every one of them shows the actual conversation and the
            outcome the business gets out of it.
          </p>
        </div>

        <div ref={ref} className={`jn ${className}`} onKeyDown={onKey}>
          {/* stepper — the track sits outside the scroller so it spans the
              full width rather than scrolling away with the steps */}
          <div className="jn-railwrap">
            <div
              className="jn-rail"
              ref={railRef}
              data-edge={edge}
              role="tablist"
              aria-label="Journey steps"
            >
              {JOURNEY.map((s, n) => (
                <button
                  key={s.n}
                  role="tab"
                  aria-selected={n === i}
                  data-active={n === i}
                  className={`jn-step${n === i ? ' is-active' : ''}${n < i ? ' is-done' : ''}`}
                  onClick={() => go(n)}
                >
                  <span className="jn-step-n mono" aria-hidden="true">
                    {n < i ? <Icon name="tick" size={13} /> : s.n}
                  </span>
                  <span className="jn-step-name">{s.name}</span>
                </button>
              ))}
            </div>
            <span className="jn-rail-track" aria-hidden="true">
              <span className="jn-rail-fill" style={{ width: `${(i / last) * 100}%` }} />
            </span>
          </div>

          {/* body */}
          <div className="jn-body" data-dir={dir} key={step.n}>
            <div className="jn-copy">
              <div className="jn-copy-top">
                <span className="jn-big mono">{step.n}</span>
                <span className="jn-copy-rule" aria-hidden="true" />
                <span className="pill t-steel">{step.channel}</span>
              </div>

              <h3 className="jn-title">{step.title}</h3>
              <p className="jn-text">{step.body}</p>

              <div className="jn-metrics">
                <span className="jn-metrics-label mono">BUSINESS OUTCOME</span>
                <div className="jn-metrics-row">
                  {step.metrics.map((m, n) => (
                    <div key={m.label} className="jn-metric" style={{ '--i': n } as React.CSSProperties}>
                      <span className="jn-metric-v">{m.value}</span>
                      <span className="jn-metric-l">{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="jn-nav">
                <button
                  className="jn-arrow"
                  onClick={() => go(i - 1)}
                  disabled={i === 0}
                  aria-label="Previous step"
                >
                  <Icon name="arrow" size={17} />
                </button>
                <span className="jn-nav-count mono">{step.n} / {JOURNEY.length}</span>
                <button
                  className="jn-arrow jn-arrow-next"
                  onClick={() => go(i + 1)}
                  disabled={i === last}
                  aria-label="Next step"
                >
                  <Icon name="arrow" size={17} />
                </button>
              </div>
            </div>

            <div className="jn-visuals">
              {/* visual card */}
              <div className="jn-card panel">
                <div className="jn-card-head">
                  <span className="mono">{step.vis.caption}</span>
                  <span className="jn-card-live"><span className="dot dot-live" /></span>
                </div>
                <dl className="jn-rows">
                  {step.vis.rows.map((r, n) => (
                    <div key={r.k} className="jn-row" style={{ '--i': n } as React.CSSProperties}>
                      <dt className="mono">{r.k}</dt>
                      <dd className={r.tone ? `is-${r.tone}` : ''}>{r.v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="jn-prog">
                  <span className="jn-prog-l mono">JOURNEY PROGRESS</span>
                  <div className="jn-prog-track">
                    <span className={`jn-prog-fill t-${step.vis.barTone}`} style={{ width: `${step.vis.bar}%` }} />
                  </div>
                  <span className="jn-prog-v mono">{step.vis.bar}%</span>
                </div>
              </div>

              {/* example conversation */}
              <div className="jn-chat panel">
                <div className="jn-chat-head">
                  <span className="mono">EXAMPLE CONVERSATION</span>
                </div>
                <div className="jn-chat-body">
                  {step.chat.map((c, n) => (
                    <div
                      key={n}
                      className={`jc jc-${c.who.toLowerCase()}`}
                      style={{ '--i': n } as React.CSSProperties}
                    >
                      {c.who !== 'SYS' && (
                        <span className="jc-who mono">{c.who === 'AI' ? 'AI AGENT' : 'CUSTOMER'}</span>
                      )}
                      <p className="jc-bubble">{c.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
