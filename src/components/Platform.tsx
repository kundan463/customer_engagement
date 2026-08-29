import { useState } from 'react'
import { AGENTS, CAPABILITIES } from '../data/platform'
import { useReveal } from '../hooks'
import { TELENOW_APP } from './Chrome'
import { Icon } from './Icon'

/* ---- Section 4 -------------------------------------------------------- */

export function Platform() {
  const { ref, className } = useReveal<HTMLDivElement>()

  return (
    <section className="section section-alt" id="platform">
      <div className="wrap">
        <div className="sec-head sec-head-split">
          <div>
            <span className="eyebrow">Platform capabilities</span>
            <h2 className="h2">One platform for every customer interaction</h2>
          </div>
          <p className="lede">
            Inbound and outbound, voice and messaging, the intelligence that reads
            the conversation and the automation that acts on it — one system, not
            five tools taped together.
          </p>
        </div>

        <div ref={ref} className={`cap-grid ${className}`}>
          {CAPABILITIES.map((c, n) => (
            <article
              key={c.title}
              className={`cap card t-${c.tone}${c.wide ? ' is-wide' : ''}`}
              style={{ transitionDelay: `${n * 55}ms` }}
            >
              <div className="cap-top">
                <span className={`chip t-${c.tone}`}><Icon name={c.icon} /></span>
                <h3 className="cap-title">{c.title}</h3>
              </div>
              <ul className="cap-list">
                {c.items.map((it) => (
                  <li key={it}><span className="cap-tick" aria-hidden="true" />{it}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---- Section 5 -------------------------------------------------------- */

export function Agents() {
  const [open, setOpen] = useState<string | null>(AGENTS[0].name)
  const { ref, className } = useReveal<HTMLDivElement>()

  return (
    <section className="section" id="agents">
      <div className="wrap">
        <div className="sec-head sec-head-split">
          <div>
            <span className="eyebrow t-steel">Agent types</span>
            <h2 className="h2">Deploy AI agents for any use case</h2>
          </div>
          <p className="lede">
            Every agent is a different job with a different definition of a good
            call. Start with one, add the next when the first is earning its keep.
          </p>
        </div>

        <div ref={ref} className={`ag-grid ${className}`}>
          {AGENTS.map((a, n) => (
            /* The whole card is the link — one target, no overlay to trap
               clicks, and the keyboard gets the same affordance as the mouse. */
            <a
              key={a.name}
              className={`ag card${open === a.name ? ' is-open' : ''}`}
              style={{ transitionDelay: `${n * 40}ms` }}
              href={TELENOW_APP}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setOpen(a.name)}
              onFocus={() => setOpen(a.name)}
            >
              <span className="chip t-steel ag-chip"><Icon name={a.icon} /></span>
              <h3 className="ag-name">{a.name}</h3>
              <p className="ag-purpose">{a.purpose}</p>

              <div className="ag-channels">
                {a.channels.map((ch) => (
                  <span key={ch} className="ag-ch">{ch}</span>
                ))}
              </div>

              <div className="ag-outcome">
                <span className="mono">EXPECTED OUTCOME</span>
                <p>{a.outcome}</p>
              </div>

              <span className="ag-use">
                Use this template
                <Icon name="arrow" size={14} />
              </span>
            </a>
          ))}
        </div>

        <div className="ag-foot">
          <p>
            Not sure which one to start with? Most brands start with feedback and add
            revenue agents once the transcripts are believable.
          </p>
          <div className="cta-row">
            <a href={TELENOW_APP} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Browse all templates
              <Icon name="arrow" size={16} />
            </a>
            <a href="#demo" className="btn btn-ghost">Talk it through</a>
          </div>
        </div>
      </div>
    </section>
  )
}
