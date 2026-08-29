import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence, LazyMotion, animate, domMax, m,
  useMotionValue, useReducedMotion, useTransform,
} from 'framer-motion'
import { ARCH, LAUNCH } from '../data/platform'
import { useInView, useInterval, usePageVisible, useReveal } from '../hooks'
import { Icon } from './Icon'

/* =====================================================================
   SECTION 6 — launch in minutes.
   Each step swaps a small, realistic mock of the screen you would be on.
   ===================================================================== */

const EASE = [0.22, 1, 0.36, 1] as const

/* ---- the two things that make a mock read as footage, not a picture ---- */

/**
 * A number that runs up to its value. The count lives in a MotionValue and is
 * rendered as a motion child, so ticking never re-renders React.
 */
function Count({
  to,
  dur = 1.4,
  delay = 0,
  format = (v: number) => Math.round(v).toLocaleString('en-IN'),
}: {
  to: number
  dur?: number
  delay?: number
  format?: (v: number) => string
}) {
  const mv = useMotionValue(0)
  const text = useTransform(mv, format)
  useEffect(() => {
    const controls = animate(mv, to, { duration: dur, delay, ease: EASE })
    return () => controls.stop()
  }, [mv, to, dur, delay])
  return <m.span>{text}</m.span>
}

/** Text that types itself, one character at a time. */
function Typed({ text, dur, delay = 0 }: { text: string; dur: number; delay?: number }) {
  const mv = useMotionValue(0)
  const out = useTransform(mv, (v: number) => text.slice(0, Math.round(v)))
  useEffect(() => {
    const controls = animate(mv, text.length, { duration: dur, delay, ease: 'linear' })
    return () => controls.stop()
  }, [mv, text, dur, delay])
  return <m.span>{out}</m.span>
}

/**
 * Lights rows one after another, `gap` ms apart, starting `from` ms in.
 *
 * The switches are driven by adding `.is-on`, not by tweening a colour: the
 * track and the knob are one CSS transition already, and animating only the
 * track in JS would slide the knob without it.
 */
function useCascade(count: number, from: number, gap: number) {
  const [lit, setLit] = useState(0)
  useEffect(() => {
    const ids = Array.from({ length: count }, (_, n) =>
      window.setTimeout(() => setLit(n + 1), from + n * gap),
    )
    return () => ids.forEach((id) => window.clearTimeout(id))
  }, [count, from, gap])
  return lit
}

/** Each act plays its contents in, in the order you would read them. */
const ACT = { hidden: {}, show: { transition: { staggerChildren: 0.085, delayChildren: 0.1 } } }
const ROW = {
  hidden: { opacity: 0, y: 9 },
  show: { opacity: 1, y: 0, transition: { duration: 0.42, ease: EASE } },
}

function Stage({ children }: { children: React.ReactNode }) {
  return (
    <m.div className="mock" variants={ACT} initial="hidden" animate="show">
      {children}
    </m.div>
  )
}

/* =====================================================================
   ACT 01 — the list arrives
   ===================================================================== */

function MockImport() {
  const rows = [
    ['+91 98••• 41207', 'ananya@•••', 'CUS-4471', '3 orders'],
    ['+91 99••• 80114', 'rohit@•••', 'CUS-4472', '1 order'],
    ['+91 88••• 22093', 'meera@•••', 'CUS-4473', '7 orders'],
    ['+91 97••• 65510', 'kavya@•••', 'CUS-4474', '2 orders'],
  ]
  return (
    <Stage>
      <m.div className="mock-bar" variants={ROW}>
        <span className="mono">customers_march.csv</span>
        <span className="pill t-aqua">
          <Count to={4180} dur={1.6} delay={0.4} />&nbsp;rows mapped
        </span>
      </m.div>
      <table className="mock-table">
        <thead>
          <tr><th>Phone</th><th>Email</th><th>Customer ID</th><th>History</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <m.tr key={r[2]} variants={ROW}>
              {r.map((c, i) => <td key={i} className={i === 3 ? 'is-dim' : ''}>{c}</td>)}
            </m.tr>
          ))}
        </tbody>
      </table>
      <m.div className="mock-foot mono" variants={ROW}>
        <span><Icon name="check" size={13} />4 columns auto-detected</span>
        <span><Icon name="shield" size={13} />consent column enforced</span>
      </m.div>
    </Stage>
  )
}

/* =====================================================================
   ACT 02 — the agent writes itself, then the rules snap on
   ===================================================================== */

const PROMPT =
  'You are Maya, a customer experience executive. This is a post-purchase ' +
  'call — the customer already has the product. Your job is not to sell. ' +
  'Capture honest feedback, answer basic questions, and route complaints ' +
  'to a human…'

function MockAgent() {
  /* The rules snap on only once the prompt has finished writing itself. */
  const lit = useCascade(4, 4150, 190)
  const rules: [string, boolean][] = [
    ['One question per turn', true],
    ['Recommend only when rating >= 4', true],
    ['Offer discount before interest', false],
    ['Escalate skin reactions to a human', true],
  ]
  return (
    <Stage>
      <m.div className="mock-bar" variants={ROW}>
        <span className="mono">agent · feedback-maya</span>
        <span className="pill t-rev">draft</span>
      </m.div>
      <m.div className="mock-prompt" variants={ROW}>
        <span className="mono mock-label">SYSTEM PROMPT</span>
        <p>
          <Typed text={PROMPT} dur={3.4} delay={0.3} />
          <span className="mock-caret" aria-hidden="true" />
        </p>
      </m.div>
      <div className="mock-toggles">
        {rules.map(([l, on], i) => (
          <m.div
            key={l}
            className={`mock-tog${on && i < lit ? ' is-on' : ''}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.36, ease: EASE, delay: 3.9 + i * 0.16 }}
          >
            <span className="mock-sw" aria-hidden="true" />
            {l}
          </m.div>
        ))}
      </div>
      <m.div
        className="mock-kb"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE, delay: 4.8 }}
      >
        <span className="mono mock-label">KNOWLEDGE BASE</span>
        <div>
          {['products.csv', 'faq.csv', 'returns-policy.pdf', 'recommendations.csv'].map((f, i) => (
            <m.span
              key={f}
              className="mock-file mono"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: EASE, delay: 5 + i * 0.11 }}
            >
              <Icon name="book" size={12} />{f}
            </m.span>
          ))}
        </div>
      </m.div>
    </Stage>
  )
}

/* =====================================================================
   ACT 03 — the cascade wires itself up
   ===================================================================== */

function MockChannels() {
  /* Each channel comes up as the line reaches it. */
  const lit = useCascade(4, 700, 280)
  const chans = [
    { n: 'Voice', on: true, note: 'primary · 09:00 to 20:00' },
    { n: 'WhatsApp', on: true, note: 'fallback + coupon delivery' },
    { n: 'SMS', on: true, note: 'if WhatsApp undelivered' },
    { n: 'Email', on: false, note: 'off for this journey' },
  ]
  return (
    <Stage>
      <m.div className="mock-bar" variants={ROW}>
        <span className="mono">channel cascade</span>
        <span className="pill t-steel">hybrid</span>
      </m.div>
      <div className="mock-chans">
        {/* The line that makes it a cascade rather than a list. */}
        <m.span
          className="mock-chan-line"
          aria-hidden="true"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.35 }}
        />
        {chans.map((c, i) => (
          <m.div
            key={c.n}
            className={`mock-chan${c.on && i < lit ? ' is-on' : ''}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: EASE, delay: 0.4 + i * 0.28 }}
          >
            <span className="mock-chan-n mono">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <strong>{c.n}</strong>
              <span>{c.note}</span>
            </div>
            <span className="mock-sw" aria-hidden="true" />
          </m.div>
        ))}
      </div>
      <m.div
        className="mock-foot mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.7 }}
      >
        <span><Icon name="clock" size={13} />quiet hours enforced</span>
        <span><Icon name="check" size={13} />2 attempts, then stop</span>
      </m.div>
    </Stage>
  )
}

/* =====================================================================
   ACT 04 — the line rings, somebody picks up, and the campaign runs

   This is the beat the whole section is built around. Nothing counts
   until the call is answered.
   ===================================================================== */

const WAVE = Array.from({ length: 22 }, (_, i) => 0.3 + Math.abs(Math.sin(i * 1.7)) * 0.7)

const STATS: [string, number][] = [
  ['Connected', 1982],
  ['Feedback', 1610],
  ['Escalated', 46],
  ['Offers', 512],
]

function MockLaunch() {
  const [answered, setAnswered] = useState(false)
  useEffect(() => {
    const t = window.setTimeout(() => setAnswered(true), 1500)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <Stage>
      <m.div className="mock-bar" variants={ROW}>
        <span className="mono">campaign · post-purchase feedback</span>
        <span className="pill t-aqua"><span className="dot dot-live" />running</span>
      </m.div>

      <m.div className={`mock-call${answered ? ' is-live' : ''}`} variants={ROW}>
        <span className="mock-call-ico">
          <Icon name={answered ? 'voice' : 'outbound'} size={14} />
        </span>
        <span className="mock-call-id">
          <strong>+91 98••• 41207</strong>
          <span>Ananya R · Pune</span>
        </span>
        <span className="mock-wave" aria-hidden="true">
          {WAVE.map((h, i) => (
            <m.i
              key={i}
              animate={answered ? { scaleY: [h * 0.35, h, h * 0.45] } : { scaleY: 0.16 }}
              transition={
                answered
                  ? {
                      duration: 0.85,
                      repeat: Infinity,
                      repeatType: 'mirror' as const,
                      delay: i * 0.035,
                      ease: 'easeInOut' as const,
                    }
                  : { duration: 0.3 }
              }
            />
          ))}
        </span>
        <span className="mock-call-state mono">{answered ? 'answered' : 'ringing'}</span>
      </m.div>

      <div className="mock-launch">
        <div className="mock-launch-head">
          <span className="mock-big">{answered ? <Count to={2847} dur={2.2} /> : '0'}</span>
          <span className="mono">of 4,180 dialled</span>
        </div>
        <div className="mock-track">
          <m.span
            initial={{ width: '0%' }}
            animate={{ width: answered ? '68%' : '0%' }}
            transition={{ duration: 2.2, ease: EASE }}
          />
        </div>
        <div className="mock-stats">
          {STATS.map(([k, v], i) => (
            <m.div
              key={k}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.36, ease: EASE, delay: 1.95 + i * 0.1 }}
            >
              <strong>{answered ? <Count to={v} dur={1.5} delay={0.3 + i * 0.1} /> : '0'}</strong>
              <span>{k}</span>
            </m.div>
          ))}
        </div>
      </div>

      <m.div
        className="mock-foot mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 2.65 }}
      >
        <span><Icon name="voice" size={13} />18 concurrent lines</span>
        <span><Icon name="check" size={13} />pausable mid-campaign</span>
      </m.div>
    </Stage>
  )
}

/* =====================================================================
   ACT 05 — what came back
   ===================================================================== */

const TILES: [string, number, (v: number) => string, string][] = [
  ['Feedback collected', 29764, (v) => Math.round(v).toLocaleString('en-IN'), 'aqua'],
  ['Offers redeemed', 3597, (v) => Math.round(v).toLocaleString('en-IN'), 'rev'],
  ['Issues resolved', 4102, (v) => Math.round(v).toLocaleString('en-IN'), 'steel'],
  ['Revenue influenced', 42.6, (v) => 'Rs ' + v.toFixed(1) + 'L', 'rev'],
]

function MockMonitor() {
  return (
    <Stage>
      <m.div className="mock-bar" variants={ROW}>
        <span className="mono">results · last 30 days</span>
        <span className="pill t-rev">
          <Count to={31} dur={1.2} delay={0.5} format={(v) => '+' + Math.round(v) + '%'} />
        </span>
      </m.div>
      <div className="mock-tiles">
        {TILES.map(([l, v, fmt, t], i) => (
          <m.div
            key={l}
            className={`mock-tile t-${t}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, ease: EASE, delay: 0.15 + i * 0.12 }}
          >
            <span className="mock-tile-v">
              <Count to={v} dur={1.7} delay={0.3 + i * 0.12} format={fmt} />
            </span>
            <span className="mock-tile-l">{l}</span>
          </m.div>
        ))}
      </div>
      <m.div
        className="mock-foot mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.2 }}
      >
        <span><Icon name="sync" size={13} />synced to CRM</span>
        <span><Icon name="chart" size={13} />exportable</span>
      </m.div>
    </Stage>
  )
}

const VIEWS: Record<string, () => React.JSX.Element> = {
  import: MockImport,
  agent: MockAgent,
  channels: MockChannels,
  launch: MockLaunch,
  monitor: MockMonitor,
}

/** Each act holds for as long as its own animation needs, not a flat count. */
const DWELL: Record<string, number> = {
  import: 6000,
  agent: 9600,
  channels: 6600,
  launch: 9600,
  monitor: 7000,
}

/** The list reveals itself once, one step after another. */
const LIST = { rest: {}, in: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } }
const ITEM = {
  rest: { opacity: 0, y: 14 },
  in: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
}

export function Launch() {
  const [i, setI] = useState(0)
  /** Hover pauses the walkthrough; a click hands it over for good. */
  const [held, setHeld] = useState(false)
  const [took, setTook] = useState(false)
  const reduced = useReducedMotion()
  const onScreen = usePageVisible()
  const [ref, seen] = useInView<HTMLDivElement>(0.25)

  const step = LAUNCH[i]
  const View = VIEWS[step.view]
  const dwell = DWELL[step.view] ?? 7000
  const playing = seen && onScreen && !held && !took && !reduced

  /**
   * The dwell clock. Elapsed time lives in a ref and only the bar's
   * percentage is state, so pausing freezes the bar where it stands instead
   * of restarting it — and advancing never happens inside a state updater,
   * which StrictMode would run twice.
   */
  const elapsed = useRef(0)
  const last = useRef<number | null>(null)
  const [pct, setPct] = useState(0)

  useInterval(() => {
    const now = performance.now()
    // Clamp the delta so a throttled tab resumes rather than jumping a step.
    const dt = Math.min(240, now - (last.current ?? now))
    last.current = now
    elapsed.current += dt
    if (elapsed.current >= dwell) {
      elapsed.current = 0
      setPct(0)
      setI((v) => (v + 1) % LAUNCH.length)
    } else {
      setPct(elapsed.current / dwell)
    }
  }, playing ? 60 : null)

  useEffect(() => { elapsed.current = 0; last.current = null; setPct(0) }, [i])
  useEffect(() => { last.current = null }, [playing])

  const pick = (n: number) => { setTook(true); setI(n) }

  return (
    <section className="section" id="launch">
      <div className="wrap">
        <div className="sec-head sec-head-split">
          <div>
            <span className="eyebrow">How businesses use it</span>
            <h2 className="h2">Launch customer engagement in minutes</h2>
          </div>
          <p className="lede">
            No integration project, no six-week onboarding. Import, describe the
            call, pick your channels, and watch the first hundred transcripts
            before you open the tap.
          </p>
        </div>

        <LazyMotion features={domMax} strict>
          <div
            ref={ref}
            className="lx"
            onMouseEnter={() => setHeld(true)}
            onMouseLeave={() => setHeld(false)}
          >
            <m.ol
              className="lx-steps"
              initial="rest"
              whileInView="in"
              viewport={{ once: true, amount: 0.25 }}
              variants={LIST}
            >
              {LAUNCH.map((s, n) => (
                <m.li key={s.n} variants={ITEM} className="lx-item">
                  <button
                    className={`lx-step${n === i ? ' is-active' : ''}`}
                    onClick={() => pick(n)}
                    onFocus={() => setHeld(true)}
                    onBlur={() => setHeld(false)}
                    aria-expanded={n === i}
                  >
                    {/* One element shared across all five steps, so the card
                        slides to the step you picked rather than blinking out
                        of one and into another. */}
                    {n === i && (
                      <m.span
                        className="lx-mark"
                        layoutId="lx-mark"
                        aria-hidden="true"
                        transition={{ type: 'spring', stiffness: 420, damping: 38, mass: 0.9 }}
                      />
                    )}

                    <span className="lx-n mono">{s.n}</span>

                    <span className="lx-step-body">
                      <span className="lx-step-title">{s.title}</span>
                      <AnimatePresence initial={false}>
                        {n === i && (
                          <m.span
                            key="detail"
                            className="lx-reveal"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.34, ease: EASE }}
                          >
                            <span className="lx-step-text">{s.body}</span>
                            <span className="lx-path mono">{s.path}</span>
                          </m.span>
                        )}
                      </AnimatePresence>
                    </span>
                  </button>

                  {/* The dwell clock, drawn. Nothing moves without saying so. */}
                  {n === i && playing && (
                    <span className="lx-tick" aria-hidden="true">
                      <i style={{ transform: `scaleX(${pct})` }} />
                    </span>
                  )}
                </m.li>
              ))}
            </m.ol>

            {/* Both panels share one grid cell, so the outgoing screen fades
                under the incoming one instead of the column collapsing. */}
            <div className="lx-viewport">
              <AnimatePresence initial={false}>
                <m.div
                  key={step.view}
                  className="lx-view panel"
                  initial={{ opacity: 0, y: 12, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.99 }}
                  transition={{ duration: 0.32, ease: EASE }}
                >
                  <View />
                </m.div>
              </AnimatePresence>
            </div>
          </div>
        </LazyMotion>
      </div>
    </section>
  )
}

/* =====================================================================
   SECTION 7 — automation architecture
   ===================================================================== */

export function Architecture() {
  const { ref, className } = useReveal<HTMLDivElement>()

  return (
    <section className="section section-alt" id="architecture">
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow t-steel">Automation architecture</span>
          <h2 className="h2">Everything works together automatically</h2>
          <p className="lede">
            Your data goes in at the top. A conversation happens in the middle. The
            outcome comes back out into the systems you already run — with no one
            copying anything between them.
          </p>
        </div>

        <div ref={ref} className={`arch ${className}`}>
          {ARCH.map((tier, ti) => (
            <div key={tier.tier} className="arch-tier" style={{ transitionDelay: `${ti * 90}ms` }}>
              <span className="arch-tier-label mono">{tier.tier}</span>

              <div className="arch-nodes" data-count={tier.nodes.length}>
                {tier.nodes.map((nd) => (
                  <div key={nd.name} className={`arch-node t-${nd.tone}${nd.hero ? ' is-hero' : ''}`}>
                    <span className={`chip t-${nd.tone}`}><Icon name={nd.icon} size={18} /></span>
                    <div className="arch-node-body">
                      <strong>{nd.name}</strong>
                      <span>{nd.detail}</span>
                    </div>
                  </div>
                ))}
              </div>

              {ti < ARCH.length - 1 && (
                <div className="arch-link" aria-hidden="true">
                  <span className="arch-link-line">
                    <span className="arch-pulse" style={{ animationDelay: `${ti * 0.42}s` }} />
                  </span>
                  <Icon name="down" size={15} />
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="arch-note mono">
          <Icon name="lock" size={14} />
          CONSENT, QUIET HOURS AND ATTEMPT CAPS ARE ENFORCED AT THE WORKFLOW LAYER — NOT PER CAMPAIGN
        </p>
      </div>
    </section>
  )
}
