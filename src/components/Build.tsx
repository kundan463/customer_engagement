import { useState } from 'react'
import { ARCH, LAUNCH } from '../data/platform'
import { useReveal } from '../hooks'
import { Icon } from './Icon'

/* =====================================================================
   SECTION 6 — launch in minutes.
   Each step swaps a small, realistic mock of the screen you would be on.
   ===================================================================== */

function MockImport() {
  const rows = [
    ['+91 98••• 41207', 'ananya@•••', 'CUS-4471', '3 orders'],
    ['+91 99••• 80114', 'rohit@•••', 'CUS-4472', '1 order'],
    ['+91 88••• 22093', 'meera@•••', 'CUS-4473', '7 orders'],
    ['+91 97••• 65510', 'kavya@•••', 'CUS-4474', '2 orders'],
  ]
  return (
    <div className="mock">
      <div className="mock-bar">
        <span className="mono">customers_march.csv</span>
        <span className="pill t-aqua">4,180 rows mapped</span>
      </div>
      <table className="mock-table">
        <thead>
          <tr><th>Phone</th><th>Email</th><th>Customer ID</th><th>History</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[2]}>{r.map((c, i) => <td key={i} className={i === 3 ? 'is-dim' : ''}>{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
      <div className="mock-foot mono">
        <span><Icon name="check" size={13} />4 columns auto-detected</span>
        <span><Icon name="shield" size={13} />consent column enforced</span>
      </div>
    </div>
  )
}

function MockAgent() {
  return (
    <div className="mock">
      <div className="mock-bar">
        <span className="mono">agent · feedback-maya</span>
        <span className="pill t-rev">draft</span>
      </div>
      <div className="mock-prompt">
        <span className="mono mock-label">SYSTEM PROMPT</span>
        <p>
          You are Maya, a customer experience executive. This is a post-purchase
          call — the customer already has the product. Your job is not to sell.
          Capture honest feedback, answer basic questions, and route complaints
          to a human…
        </p>
      </div>
      <div className="mock-toggles">
        {[
          ['One question per turn', true],
          ['Recommend only when rating ≥ 4', true],
          ['Offer discount before interest', false],
          ['Escalate skin reactions to a human', true],
        ].map(([l, on]) => (
          <div key={l as string} className={`mock-tog${on ? ' is-on' : ''}`}>
            <span className="mock-sw" aria-hidden="true" />
            {l as string}
          </div>
        ))}
      </div>
      <div className="mock-kb">
        <span className="mono mock-label">KNOWLEDGE BASE</span>
        <div>
          {['products.csv', 'faq.csv', 'returns-policy.pdf', 'recommendations.csv'].map((f) => (
            <span key={f} className="mock-file mono"><Icon name="book" size={12} />{f}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function MockChannels() {
  const chans = [
    { n: 'Voice', on: true, note: 'primary · 09:00–20:00' },
    { n: 'WhatsApp', on: true, note: 'fallback + coupon delivery' },
    { n: 'SMS', on: true, note: 'if WhatsApp undelivered' },
    { n: 'Email', on: false, note: 'off for this journey' },
  ]
  return (
    <div className="mock">
      <div className="mock-bar">
        <span className="mono">channel cascade</span>
        <span className="pill t-steel">hybrid</span>
      </div>
      <div className="mock-chans">
        {chans.map((c, i) => (
          <div key={c.n} className={`mock-chan${c.on ? ' is-on' : ''}`}>
            <span className="mock-chan-n mono">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <strong>{c.n}</strong>
              <span>{c.note}</span>
            </div>
            <span className="mock-sw" aria-hidden="true" />
          </div>
        ))}
      </div>
      <div className="mock-foot mono">
        <span><Icon name="clock" size={13} />quiet hours enforced</span>
        <span><Icon name="check" size={13} />2 attempts, then stop</span>
      </div>
    </div>
  )
}

function MockLaunch() {
  return (
    <div className="mock">
      <div className="mock-bar">
        <span className="mono">campaign · post-purchase feedback</span>
        <span className="pill t-aqua"><span className="dot dot-live" />running</span>
      </div>
      <div className="mock-launch">
        <div className="mock-launch-head">
          <span className="mock-big">2,847</span>
          <span className="mono">of 4,180 dialled</span>
        </div>
        <div className="mock-track"><span style={{ width: '68%' }} /></div>
        <div className="mock-stats">
          {[['Connected', '1,982'], ['Feedback', '1,610'], ['Escalated', '46'], ['Offers', '512']].map(([k, v]) => (
            <div key={k}><strong>{v}</strong><span>{k}</span></div>
          ))}
        </div>
      </div>
      <div className="mock-foot mono">
        <span><Icon name="voice" size={13} />18 concurrent lines</span>
        <span><Icon name="check" size={13} />pausable mid-campaign</span>
      </div>
    </div>
  )
}

function MockMonitor() {
  return (
    <div className="mock">
      <div className="mock-bar">
        <span className="mono">results · last 30 days</span>
        <span className="pill t-rev">+31%</span>
      </div>
      <div className="mock-tiles">
        {[
          ['Feedback collected', '29,764', 'aqua'],
          ['Offers redeemed', '3,597', 'rev'],
          ['Issues resolved', '4,102', 'steel'],
          ['Revenue influenced', 'Rs 42.6L', 'rev'],
        ].map(([l, v, t]) => (
          <div key={l} className={`mock-tile t-${t}`}>
            <span className="mock-tile-v">{v}</span>
            <span className="mock-tile-l">{l}</span>
          </div>
        ))}
      </div>
      <div className="mock-foot mono">
        <span><Icon name="sync" size={13} />synced to CRM</span>
        <span><Icon name="chart" size={13} />exportable</span>
      </div>
    </div>
  )
}

const VIEWS: Record<string, () => React.JSX.Element> = {
  import: MockImport,
  agent: MockAgent,
  channels: MockChannels,
  launch: MockLaunch,
  monitor: MockMonitor,
}

export function Launch() {
  const [i, setI] = useState(0)
  const { ref, className } = useReveal<HTMLDivElement>()
  const step = LAUNCH[i]
  const View = VIEWS[step.view]

  return (
    <section className="section section-alt" id="launch">
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

        <div ref={ref} className={`lx ${className}`}>
          <ol className="lx-steps">
            {LAUNCH.map((s, n) => (
              <li key={s.n}>
                <button
                  className={`lx-step${n === i ? ' is-active' : ''}`}
                  onClick={() => setI(n)}
                  aria-expanded={n === i}
                >
                  <span className="lx-n mono">{s.n}</span>
                  <span className="lx-step-body">
                    <span className="lx-step-title">{s.title}</span>
                    {n === i && (
                      <>
                        <span className="lx-step-text">{s.body}</span>
                        <span className="lx-path mono">{s.path}</span>
                      </>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <div className="lx-view panel" key={step.view}>
            <View />
          </div>
        </div>
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
    <section className="section" id="architecture">
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
