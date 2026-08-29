import { INTEGRATIONS, OUTCOMES, SECURITY } from '../data/platform'
import { useReveal } from '../hooks'
import { Icon } from './Icon'

/* ---- Section 9 -------------------------------------------------------- */

export function BusinessOutcomes() {
  const { ref, className } = useReveal<HTMLDivElement>()
  return (
    <section className="section" id="outcomes">
      <div className="wrap">
        <div className="sec-head sec-head-split">
          <div>
            <span className="eyebrow">Business outcomes</span>
            <h2 className="h2">More than conversations</h2>
          </div>
          <p className="lede">
            The conversation is the mechanism. These are the things it is
            actually for — measured against a matched cohort that did not get
            the call.
          </p>
        </div>

        <div ref={ref} className={`out-grid ${className}`}>
          {OUTCOMES.map((o, n) => (
            <article key={o.title} className={`out card t-${o.tone}`} style={{ transitionDelay: `${n * 45}ms` }}>
              <span className="out-stat">{o.stat}</span>
              <h3 className="out-title">{o.title}</h3>
              <p className="out-body">{o.body}</p>
              <span className="out-foot mono">{o.foot}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---- Section 10 ------------------------------------------------------- */

export function Integrations() {
  const { ref, className } = useReveal<HTMLDivElement>()
  return (
    <section className="section section-alt" id="integrations">
      <div className="wrap">
        <div className="sec-head sec-head-split">
          <div>
            <span className="eyebrow t-steel">Integrations</span>
            <h2 className="h2">Connect with your existing systems</h2>
          </div>
          <p className="lede">
            Telenow reads from the systems that already hold your customers and
            writes the outcome straight back into them. Nothing gets re-keyed.
          </p>
        </div>

        <div ref={ref} className={`int-grid ${className}`}>
          {INTEGRATIONS.map((it, n) => (
            <article key={it.title} className="int card" style={{ transitionDelay: `${n * 40}ms` }}>
              <span className="chip t-steel"><Icon name={it.icon} size={18} /></span>
              <h3 className="int-title">{it.title}</h3>
              <ul className="int-names">
                {it.names.map((nm) => <li key={nm}>{nm}</li>)}
              </ul>
            </article>
          ))}
        </div>

        <p className="int-note">
          <Icon name="plug" size={16} />
          Anything else talks to us over REST, webhooks or a nightly file drop.
        </p>
      </div>
    </section>
  )
}

/* ---- Section 11 ------------------------------------------------------- */

export function Security() {
  const { ref, className } = useReveal<HTMLDivElement>()
  return (
    <section className="section" id="security">
      <div className="wrap">
        <div className="sec-head sec-head-split">
          <div>
            <span className="eyebrow t-steel">Security</span>
            <h2 className="h2">Built for enterprise teams</h2>
          </div>
          <p className="lede">
            Voice data is customer data. Access, retention and consent are
            controlled at the platform layer, so no campaign can quietly opt out
            of the rules.
          </p>
        </div>

        <div ref={ref} className={`sx-grid ${className}`}>
          {SECURITY.map((s, n) => (
            <article key={s.title} className="sx card" style={{ transitionDelay: `${n * 40}ms` }}>
              <span className="sx-icon"><Icon name={s.icon} size={19} /></span>
              <div>
                <h3 className="sx-title">{s.title}</h3>
                <p className="sx-body">{s.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
