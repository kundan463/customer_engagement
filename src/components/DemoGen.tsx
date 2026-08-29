import { useState } from 'react'
import { useReveal } from '../hooks'
import type { DemoForm } from '../types'
import { WA_LINK } from './Chrome'
import { Icon } from './Icon'

const INDUSTRIES = [
  'Beauty & personal care',
  'Health & wellness',
  'Food & beverage',
  'Fashion & accessories',
  'Consumer electronics',
  'Home & living',
  'Services',
  'Other',
]

const VOLUMES = ['Under 1,000', '1,000 – 10,000', '10,000 – 50,000', '50,000 – 200,000', '200,000+']

const USE_CASES = [
  { k: 'feedback', label: 'Post-purchase feedback', agent: 'Feedback Agent', gate: 'Rating captured, verbatim stored' },
  { k: 'retention', label: 'Retention & win-back', agent: 'Reactivation Agent', gate: 'Lapse reason captured' },
  { k: 'upsell', label: 'Cross-sell & upsell', agent: 'Recommendation Agent', gate: 'One SKU, gated on a positive call' },
  { k: 'support', label: 'Inbound support', agent: 'Support Agent', gate: 'Resolved or escalated in 30s' },
  { k: 'survey', label: 'CSAT / NPS surveys', agent: 'Survey Agent', gate: 'Score plus the reason behind it' },
  { k: 'other', label: 'Other', agent: 'Custom agent', gate: 'Defined with you before launch' },
]

const CHANNELS = ['Voice', 'WhatsApp', 'SMS', 'Email']

const VOLUME_N: Record<string, number> = {
  'Under 1,000': 700,
  '1,000 – 10,000': 5500,
  '10,000 – 50,000': 30000,
  '50,000 – 200,000': 125000,
  '200,000+': 300000,
}

const empty: DemoForm = {
  useCaseOther: '',
  business: '',
  industry: INDUSTRIES[0],
  volume: VOLUMES[1],
  useCase: 'feedback',
  channels: ['Voice', 'WhatsApp'],
  email: '',
  phone: '',
}

const n = (x: number) => (x >= 1e5 ? `${(x / 1e5).toFixed(1)} L` : Math.round(x).toLocaleString('en-IN'))

export function DemoGen() {
  const [f, setF] = useState<DemoForm>(empty)
  const [built, setBuilt] = useState(false)
  const { ref, className } = useReveal<HTMLDivElement>()

  const uc = USE_CASES.find((u) => u.k === f.useCase)!
  // "Other" is only as specific as what they typed, so fall back gracefully.
  const ucLabel = f.useCase === 'other' && f.useCaseOther.trim() ? f.useCaseOther.trim() : uc.label
  const vol = VOLUME_N[f.volume] ?? 5500
  const name = f.business.trim() || 'your brand'

  const set = <K extends keyof DemoForm>(k: K, v: DemoForm[K]) => {
    setF((s) => ({ ...s, [k]: v }))
    setBuilt(false)
  }

  const toggleChannel = (c: string) =>
    set('channels', f.channels.includes(c) ? f.channels.filter((x) => x !== c) : [...f.channels, c])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setBuilt(true)
    requestAnimationFrame(() =>
      document.getElementById('dg-result')?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
    )
  }

  const reached = vol * 0.62
  const feedback = reached * 0.78
  const offers = reached * 0.58 * 0.31

  return (
    <section className="section section-alt" id="demo">
      <div className="wrap">
        <div className="sec-head sec-head-split">
          <div>
            <span className="eyebrow">Demo generator</span>
            <h2 className="h2">Build your AI customer engagement flow</h2>
          </div>
          <p className="lede">
            Six answers and you get the workflow we would actually build for you —
            triggers, agent, channels and outcomes. Nothing is sent anywhere until
            you press book a demo.
          </p>
        </div>

        <div ref={ref} className={`dg ${className}`}>
          <form className="dg-form panel" onSubmit={submit}>
            <div className="dg-row">
              <label className="dg-field">
                <span>Business name</span>
                <input
                  type="text"
                  value={f.business}
                  onChange={(e) => set('business', e.target.value)}
                  placeholder="e.g. Kaya Naturals"
                  autoComplete="organization"
                />
              </label>

              <label className="dg-field">
                <span>Industry</span>
                <select value={f.industry} onChange={(e) => set('industry', e.target.value)}>
                  {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
                </select>
              </label>
            </div>

            <label className="dg-field">
              <span>Monthly customer volume</span>
              <div className="dg-chips">
                {VOLUMES.map((v) => (
                  <button
                    type="button"
                    key={v}
                    className={`dg-chip${f.volume === v ? ' is-on' : ''}`}
                    onClick={() => set('volume', v)}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </label>

            <label className="dg-field">
              <span>Primary use case</span>
              <div className="dg-chips">
                {USE_CASES.map((u) => (
                  <button
                    type="button"
                    key={u.k}
                    className={`dg-chip${f.useCase === u.k ? ' is-on' : ''}`}
                    onClick={() => set('useCase', u.k)}
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </label>

            {f.useCase === 'other' && (
              <label className="dg-field dg-other">
                <span>Tell us the use case</span>
                <input
                  type="text"
                  value={f.useCaseOther}
                  onChange={(e) => set('useCaseOther', e.target.value)}
                  placeholder="e.g. delivery delay updates, subscription renewals"
                  autoFocus
                />
              </label>
            )}

            <label className="dg-field">
              <span>Preferred channels</span>
              <div className="dg-chips">
                {CHANNELS.map((c) => (
                  <button
                    type="button"
                    key={c}
                    className={`dg-chip${f.channels.includes(c) ? ' is-on' : ''}`}
                    onClick={() => toggleChannel(c)}
                    aria-pressed={f.channels.includes(c)}
                  >
                    {f.channels.includes(c) && <Icon name="check" size={13} />}
                    {c}
                  </button>
                ))}
              </div>
            </label>

            <div className="dg-row">
              <label className="dg-field">
                <span>Work email</span>
                <input
                  type="email"
                  value={f.email}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder="you@company.com"
                  autoComplete="email"
                />
              </label>
              <label className="dg-field">
                <span>Phone number</span>
                <input
                  type="tel"
                  value={f.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  placeholder="+91 …"
                  autoComplete="tel"
                />
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-lg btn-block">
              Generate my AI workflow
              <Icon name="bolt" size={16} />
            </button>

            <p className="dg-privacy">
              <Icon name="lock" size={13} />
              This runs entirely in your browser. Nothing leaves this page unless you
              choose to send it.
            </p>
          </form>

          <div className="dg-result" id="dg-result">
            {!built ? (
              <div className="dg-idle panel">
                <span className="dg-idle-ring"><Icon name="flow" size={24} /></span>
                <h3>Your workflow appears here</h3>
                <p>
                  Pick your use case and channels on the left, then generate. The
                  diagram is the same shape we would configure in the platform.
                </p>
              </div>
            ) : (
              <div className="dg-flow panel">
                <div className="dg-flow-head">
                  <div>
                    <span className="mono">GENERATED WORKFLOW</span>
                    <h3>{name} · {ucLabel}</h3>
                  </div>
                  <span className="pill t-aqua"><span className="dot dot-live" />ready</span>
                </div>

                <ol className="dg-nodes">
                  <li className="dg-node t-steel">
                    <span className="dg-node-n mono">01</span>
                    <div>
                      <strong>Trigger · {f.industry.toLowerCase()}</strong>
                      <span>Order delivered or service completed, pulled from your OMS</span>
                    </div>
                  </li>
                  <li className="dg-node t-steel">
                    <span className="dg-node-n mono">02</span>
                    <div>
                      <strong>{uc.agent}</strong>
                      <span>Knowledge base loaded from your catalogue, FAQ and policies</span>
                    </div>
                  </li>
                  <li className="dg-node t-aqua">
                    <span className="dg-node-n mono">03</span>
                    <div>
                      <strong>
                        {f.channels.length ? f.channels.join(' → ') : 'Voice'} cascade
                      </strong>
                      <span>
                        {f.channels[0] ?? 'Voice'} first, {f.channels.length > 1 ? `${f.channels.slice(1).join(' then ')} as fallback` : 'no fallback configured'} · 2 attempts, then stop
                      </span>
                    </div>
                  </li>
                  <li className="dg-node t-aqua">
                    <span className="dg-node-n mono">04</span>
                    <div>
                      <strong>Decision engine</strong>
                      <span>{uc.gate} · complaints stop the flow and route to a human</span>
                    </div>
                  </li>
                  <li className="dg-node t-rev">
                    <span className="dg-node-n mono">05</span>
                    <div>
                      <strong>Outcome &amp; follow-through</strong>
                      <span>Coupon or ticket issued on the channel they chose, capped at one reminder</span>
                    </div>
                  </li>
                  <li className="dg-node t-steel">
                    <span className="dg-node-n mono">06</span>
                    <div>
                      <strong>CRM sync &amp; analytics</strong>
                      <span>One outcome code per conversation, written back in real time</span>
                    </div>
                  </li>
                </ol>

                <div className="dg-proj">
                  <span className="mono dg-proj-l">PROJECTED AT {f.volume.toUpperCase()} CUSTOMERS A MONTH</span>
                  <div className="dg-proj-row">
                    <div><strong>{n(reached)}</strong><span>Conversations</span></div>
                    <div><strong>{n(feedback)}</strong><span>Feedback captured</span></div>
                    <div><strong>{n(offers)}</strong><span>Offers earned</span></div>
                  </div>
                </div>

                <div className="cta-row dg-cta">
                  <a href={WA_LINK} className="btn btn-primary btn-block">
                    Book a demo
                    <Icon name="arrow" size={16} />
                  </a>
                </div>
                <p className="dg-privacy">
                  <Icon name="message" size={13} />
                  Opens WhatsApp to Shubham with your details ready to paste — you send it, not us.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
