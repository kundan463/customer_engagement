import { useMemo, useState } from 'react'
import { ROI_INPUTS } from '../data/analytics'
import { useReveal } from '../hooks'
import { Icon } from './Icon'

/* =====================================================================
   SECTION 12 — ROI calculator.

   Every coefficient below is a stated assumption, printed under the
   result. The point is a defensible order of magnitude, not a promise.
   ===================================================================== */

const A = {
  reach: 0.62,        // share of customers actually reached on some channel
  feedback: 0.78,     // share of reached conversations that yield usable feedback
  gate: 0.58,         // share of conversations positive enough to earn a recommendation
  accept: 0.31,       // share of recommendations the customer asks to hear more about
  redeemLift: 2.6,    // redemption multiple vs an untargeted blast
  redeemCap: 0.65,
  basket: 0.85,       // recommended SKU value as a share of AOV
  retentionPts: 6.1,  // percentage points added to repeat rate
  retentionCap: 92,
  supportContacts: 0.22, // share of customers who raise an inbound contact
  deflected: 0.95,
  costPerContact: 42,    // rupees saved per contact handled without a person
  emailBaseline: 0.12,   // response rate of the email survey being replaced
}

const money = (n: number) => {
  if (n >= 1e7) return `Rs ${(n / 1e7).toFixed(2)} Cr`
  if (n >= 1e5) return `Rs ${(n / 1e5).toFixed(1)} L`
  return `Rs ${Math.round(n).toLocaleString('en-IN')}`
}

const count = (n: number) =>
  n >= 1e5 ? `${(n / 1e5).toFixed(1)} L` : Math.round(n).toLocaleString('en-IN')

export function Roi() {
  const [v, setV] = useState({ customers: 12000, aov: 1200, retention: 24, redemption: 9 })
  const { ref, className } = useReveal<HTMLDivElement>()

  const out = useMemo(() => {
    const reached = v.customers * A.reach
    const feedback = reached * A.feedback
    const offers = reached * A.gate * A.accept
    const redeemRate = Math.min(A.redeemCap, (v.redemption / 100) * A.redeemLift)
    const redeemed = offers * redeemRate
    const upsell = redeemed * v.aov * A.basket

    const newRetention = Math.min(A.retentionCap, v.retention + A.retentionPts)
    const gainedPts = newRetention - v.retention
    const retentionRevenue = v.customers * (gainedPts / 100) * v.aov

    const savings = v.customers * A.supportContacts * A.deflected * A.costPerContact
    const growth = A.reach / A.emailBaseline

    return {
      revenue: upsell + retentionRevenue,
      upsell,
      retentionRevenue,
      feedback,
      redeemed,
      newRetention,
      gainedPts,
      savings,
      growth,
      annual: (upsell + retentionRevenue + savings) * 12,
    }
  }, [v])

  return (
    <section className="section section-alt" id="roi">
      <div className="wrap">
        <div className="sec-head sec-head-split">
          <div>
            <span className="eyebrow">ROI calculator</span>
            <h2 className="h2">Estimate your growth potential</h2>
          </div>
          <p className="lede">
            Move the four numbers you already know. Everything else is derived
            from rates we have actually measured — and every one of them is
            printed below the result so you can argue with it.
          </p>
        </div>

        <div ref={ref} className={`roi ${className}`}>
          <div className="roi-inputs panel">
            {ROI_INPUTS.map((f) => (
              <div key={f.key} className="roi-field">
                <label htmlFor={`roi-${f.key}`}>
                  <span className="roi-field-l">{f.label}</span>
                  <span className="roi-field-v mono">
                    {f.unit === 'Rs' ? 'Rs ' : ''}
                    {v[f.key].toLocaleString('en-IN')}
                    {f.unit === '%' ? '%' : ''}
                  </span>
                </label>
                <input
                  id={`roi-${f.key}`}
                  type="range"
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  value={v[f.key]}
                  onChange={(e) => setV((s) => ({ ...s, [f.key]: Number(e.target.value) }))}
                />
                <span className="roi-hint">{f.hint}</span>
              </div>
            ))}
          </div>

          <div className="roi-out">
            <div className="roi-hero panel">
              <span className="roi-hero-l">Additional monthly revenue</span>
              <span className="roi-hero-v">{money(out.revenue)}</span>
              <span className="roi-hero-sub">
                {money(out.upsell)} from recommendations · {money(out.retentionRevenue)} from retention
              </span>
              <div className="roi-hero-foot">
                <span className="mono">≈ {money(out.annual)} a year including support savings</span>
              </div>
            </div>

            <div className="roi-tiles">
              {[
                { l: 'Feedback volume', v: `${count(out.feedback)}`, s: 'conversations a month with usable feedback', t: 'aqua' },
                { l: 'Retention increase', v: `+${out.gainedPts.toFixed(1)} pts`, s: `${v.retention}% to ${out.newRetention.toFixed(1)}% repeat rate`, t: 'rev' },
                { l: 'Support savings', v: money(out.savings), s: 'contacts resolved without a person', t: 'steel' },
                { l: 'Engagement growth', v: `${out.growth.toFixed(1)}x`, s: 'reach vs the email survey it replaces', t: 'aqua' },
                { l: 'Offers redeemed', v: count(out.redeemed), s: 'earned on calls, not blasted to a list', t: 'rev' },
              ].map((t) => (
                <div key={t.l} className={`roi-tile t-${t.t}`}>
                  <span className="roi-tile-l">{t.l}</span>
                  <span className="roi-tile-v">{t.v}</span>
                  <span className="roi-tile-s">{t.s}</span>
                </div>
              ))}
            </div>

            <div className="cta-row roi-cta">
              <a href="#demo" className="btn btn-primary">
                Book demo
                <Icon name="arrow" size={16} />
              </a>
              <a href="#demo" className="btn btn-ghost">Get this modelled on your data</a>
            </div>
          </div>
        </div>

        <p className="roi-assume mono">
          ASSUMPTIONS · {Math.round(A.reach * 100)}% of customers reached · {Math.round(A.feedback * 100)}% of those
          leave usable feedback · {Math.round(A.gate * 100)}% earn a recommendation ·{' '}
          {Math.round(A.accept * 100)}% ask to hear more · redemption improves {A.redeemLift}x vs an untargeted
          blast (capped at {Math.round(A.redeemCap * 100)}%) · recommended SKU worth{' '}
          {Math.round(A.basket * 100)}% of AOV · +{A.retentionPts} pts repeat rate · Rs {A.costPerContact} saved per
          deflected contact. Early pilot figures, not a guarantee.
        </p>
      </div>
    </section>
  )
}
