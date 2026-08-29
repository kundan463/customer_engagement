import { useMemo, useState } from 'react'
import { CAMPAIGNS, FUNNEL, KPIS, OUTCOME_SERIES, OUTCOME_WEEKS, REVENUE, SENTIMENT } from '../data/analytics'
import { useCountUp, useReveal } from '../hooks'
import type { Kpi } from '../types'
import { Icon } from './Icon'

const fmt = (n: number, d = 0) =>
  n >= 10000 ? `${(n / 1000).toFixed(n >= 100000 ? 0 : 1)}K` : n.toLocaleString('en-IN', {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  })

/* ---- sparkline: 12 points, de-emphasised except the current period ----- */

function Spark({ points }: { points: number[] }) {
  const max = Math.max(...points)
  const min = Math.min(...points)
  const span = max - min || 1
  const d = points
    .map((p, i) => `${(i / (points.length - 1)) * 100},${100 - ((p - min) / span) * 88 - 6}`)
    .join(' L ')
  return (
    <svg className="spark" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path d={`M ${d}`} fill="none" stroke="var(--rule-2)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
      <path
        d={`M ${d.split(' L ').slice(-3).join(' L ')}`}
        fill="none"
        stroke="var(--s1)"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

function KpiTile({ k }: { k: Kpi }) {
  const [ref, v] = useCountUp<HTMLDivElement>(k.to, 1500)
  return (
    <div className="kpi" ref={ref}>
      <span className="kpi-label">{k.label}</span>
      <span className="kpi-value">
        {k.prefix}
        {k.decimals ? v.toFixed(k.decimals) : fmt(Math.round(v))}
        {k.suffix}
      </span>
      <span className={`kpi-delta${k.up ? ' is-up' : ' is-down'}`}>
        <Icon name={k.up ? 'arrow' : 'down'} size={12} />
        {k.delta}
      </span>
      <Spark points={k.spark} />
    </div>
  )
}

/* ---- hero line chart --------------------------------------------------- */

function RevenueChart() {
  const [hover, setHover] = useState<number | null>(null)
  const pts = REVENUE.weeks
  const max = Math.ceil(Math.max(...pts.map((p) => p.v)))
  const ticks = [0, max / 2, max]

  const xy = useMemo(
    () => pts.map((p, i) => ({ x: (i / (pts.length - 1)) * 100, y: 100 - (p.v / max) * 100, ...p })),
    [pts, max],
  )

  const line = xy.map((p) => `${p.x},${p.y}`).join(' L ')
  const area = `M 0,100 L ${line} L 100,100 Z`
  const last = xy[xy.length - 1]
  const act = hover === null ? null : xy[hover]

  return (
    <div className="rev">
      <div className="rev-head">
        <div>
          <span className="rev-label">{REVENUE.label}</span>
          <span className="rev-hero">
            <em>{REVENUE.unit.replace('lakh', '')}</em>
            {REVENUE.value}
            <i>lakh</i>
          </span>
          <span className="rev-delta"><Icon name="arrow" size={13} />{REVENUE.delta}</span>
        </div>
        <span className="pill t-rev">Last 12 weeks</span>
      </div>

      <div
        className="rev-plot"
        onPointerLeave={() => setHover(null)}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect()
          const p = (e.clientX - r.left) / r.width
          setHover(Math.max(0, Math.min(pts.length - 1, Math.round(p * (pts.length - 1)))))
        }}
      >
        <div className="rev-ticks" aria-hidden="true">
          {[...ticks].reverse().map((t) => (
            <span key={t}>{t.toFixed(0)}</span>
          ))}
        </div>

        <svg className="rev-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {ticks.map((t) => (
            <line
              key={t}
              x1="0"
              x2="100"
              y1={100 - (t / max) * 100}
              y2={100 - (t / max) * 100}
              stroke="var(--grid)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <path d={area} fill="var(--s1)" opacity="0.1" />
          <path d={`M ${line}`} fill="none" stroke="var(--s1)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
          {act && <line x1={act.x} x2={act.x} y1="0" y2="100" stroke="var(--rule-2)" strokeWidth="1" vectorEffect="non-scaling-stroke" />}
        </svg>

        {/* dots ride on top as HTML so they stay circular under the stretch */}
        <span className="rev-dot" style={{ left: `${last.x}%`, top: `${last.y}%` }} />
        {act && <span className="rev-dot is-hover" style={{ left: `${act.x}%`, top: `${act.y}%` }} />}

        <span className="rev-endlabel" style={{ left: `${last.x}%`, top: `${last.y}%` }}>
          {last.v}
        </span>

        {act && (
          <div className="rev-tip" style={{ left: `${act.x}%`, top: `${act.y}%` }}>
            <strong>Rs {act.v} lakh</strong>
            <span>{act.w}</span>
          </div>
        )}
      </div>

      <div className="rev-x" aria-hidden="true">
        {pts.map((p, i) => (
          <span key={p.w} className={i === hover ? 'is-on' : ''}>{i % 2 === 0 ? p.w : ''}</span>
        ))}
      </div>
    </div>
  )
}

/* ---- grouped columns --------------------------------------------------- */

function OutcomeChart() {
  const [hover, setHover] = useState<number | null>(null)
  const max = Math.max(...OUTCOME_WEEKS.map((w) => Math.max(w.feedback, w.resolved, w.offers)))

  return (
    <div className="ch">
      <div className="ch-head">
        <h4>Outcomes by week</h4>
        <ul className="legend">
          {OUTCOME_SERIES.map((s) => (
            <li key={s.key}><span className="legend-key" style={{ background: `var(--s${s.slot})` }} />{s.name}</li>
          ))}
        </ul>
      </div>

      <div className="ch-plot">
        {OUTCOME_WEEKS.map((w, i) => (
          <div
            key={w.w}
            className={`col-group${hover === i ? ' is-on' : ''}`}
            onPointerEnter={() => setHover(i)}
            onPointerLeave={() => setHover(null)}
          >
            <div className="cols">
              {OUTCOME_SERIES.map((s) => (
                <span
                  key={s.key}
                  className="col"
                  style={{ height: `${(w[s.key] / max) * 100}%`, background: `var(--s${s.slot})` }}
                />
              ))}
            </div>
            <span className="col-x">{w.w}</span>

            {hover === i && (
              <div className="ch-tip">
                <strong>{w.w}</strong>
                {OUTCOME_SERIES.map((s) => (
                  <span key={s.key}>
                    <i style={{ background: `var(--s${s.slot})` }} />
                    {s.name}
                    <b>{w[s.key].toLocaleString('en-IN')}</b>
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---- diverging sentiment ----------------------------------------------- */

function SentimentChart() {
  return (
    <div className="ch">
      <div className="ch-head"><h4>Sentiment distribution</h4></div>
      <div className="sent-bar" role="img" aria-label="Positive 71%, neutral 21%, negative 8%">
        {SENTIMENT.map((s) => (
          <span key={s.key} className={`sent-seg is-${s.key}`} style={{ width: `${s.pct}%` }}>
            <b>{s.pct}%</b>
          </span>
        ))}
      </div>
      <ul className="sent-key">
        {SENTIMENT.map((s) => (
          <li key={s.key}>
            <span className={`legend-key is-${s.key}`} />
            {s.name}
            <b>{s.pct}%</b>
          </li>
        ))}
      </ul>
      <p className="ch-note">Read from how the customer spoke, not the star rating alone.</p>
    </div>
  )
}

/* ---- ordinal funnel ---------------------------------------------------- */

function FunnelChart() {
  const max = FUNNEL[0].v
  return (
    <div className="ch">
      <div className="ch-head"><h4>Offer path</h4></div>
      <div className="funnel">
        {FUNNEL.map((f, i) => (
          <div key={f.name} className="fn-row">
            <span className="fn-label">{f.name}</span>
            <div className="fn-track">
              <span className="fn-bar" style={{ width: `${(f.v / max) * 100}%`, opacity: 1 - i * 0.17 }} />
            </div>
            <span className="fn-v">{f.v.toLocaleString('en-IN')}</span>
          </div>
        ))}
      </div>
      <p className="ch-note">32% of offers sent are redeemed; 81% of redemptions become an order.</p>
    </div>
  )
}

/* ---- section ----------------------------------------------------------- */

export function Dashboard() {
  const [table, setTable] = useState(false)
  const { ref, className } = useReveal<HTMLDivElement>()

  return (
    <section className="section section-alt" id="analytics">
      <div className="wrap">
        <div className="sec-head sec-head-split">
          <div>
            <span className="eyebrow">Analytics</span>
            <h2 className="h2">Track every interaction</h2>
          </div>
          <p className="lede">
            Every conversation resolves to a number you can act on — and every
            number opens back into the call that produced it.
          </p>
        </div>

        <div ref={ref} className={`db ${className}`}>
          <div className="db-bar">
            <span className="db-bar-l mono">
              <span className="dot dot-live" />
              LIVE WORKSPACE · ALL CAMPAIGNS
            </span>
            <button className="db-toggle" onClick={() => setTable((v) => !v)} aria-pressed={table}>
              <Icon name={table ? 'chart' : 'log'} size={14} />
              {table ? 'Chart view' : 'Table view'}
            </button>
          </div>

          {table ? (
            <div className="panel db-tablewrap">
              <table className="db-table">
                <caption className="sr-only">Analytics values in table form</caption>
                <thead>
                  <tr><th scope="col">Metric</th><th scope="col">Value</th><th scope="col">Change</th></tr>
                </thead>
                <tbody>
                  <tr><th scope="row">{REVENUE.label}</th><td>Rs {REVENUE.value} lakh</td><td>{REVENUE.delta}</td></tr>
                  {KPIS.map((k) => (
                    <tr key={k.label}>
                      <th scope="row">{k.label}</th>
                      <td>{k.decimals ? k.to.toFixed(k.decimals) : k.to.toLocaleString('en-IN')}{k.suffix ?? ''}</td>
                      <td>{k.delta}</td>
                    </tr>
                  ))}
                  {SENTIMENT.map((s) => (
                    <tr key={s.key}><th scope="row">Sentiment · {s.name}</th><td>{s.pct}%</td><td>—</td></tr>
                  ))}
                  {FUNNEL.map((f) => (
                    <tr key={f.name}><th scope="row">{f.name}</th><td>{f.v.toLocaleString('en-IN')}</td><td>—</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <>
              <div className="db-top">
                <div className="panel db-rev"><RevenueChart /></div>
                <div className="db-kpis">
                  {KPIS.slice(0, 4).map((k) => <KpiTile key={k.label} k={k} />)}
                </div>
              </div>

              <div className="db-kpis db-kpis-wide">
                {KPIS.slice(4).map((k) => <KpiTile key={k.label} k={k} />)}
              </div>

              <div className="db-charts">
                <div className="panel db-wide"><OutcomeChart /></div>
                <div className="panel"><SentimentChart /></div>
                <div className="panel"><FunnelChart /></div>
              </div>
            </>
          )}

          <div className="panel db-campaigns">
            <div className="ch-head"><h4>Campaign performance</h4></div>
            <div className="db-scroll">
              <table className="db-table">
                <thead>
                  <tr>
                    <th scope="col">Campaign</th>
                    <th scope="col">Agent</th>
                    <th scope="col">Reached</th>
                    <th scope="col">Connected</th>
                    <th scope="col">Outcome</th>
                    <th scope="col">Lift</th>
                  </tr>
                </thead>
                <tbody>
                  {CAMPAIGNS.map((c) => (
                    <tr key={c.name}>
                      <th scope="row">{c.name}</th>
                      <td className="is-dim">{c.agent}</td>
                      <td>{c.reached.toLocaleString('en-IN')}</td>
                      <td>
                        <span className="db-meter" aria-hidden="true">
                          <span style={{ width: `${c.connected}%` }} />
                        </span>
                        {c.connected}%
                      </td>
                      <td>{c.outcome}</td>
                      <td className="is-lift">{c.lift}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
