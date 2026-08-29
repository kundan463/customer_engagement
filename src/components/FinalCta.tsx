import { useReveal } from '../hooks'
import { MAIL, PHONE, WA_LINK } from './Chrome'
import { Icon } from './Icon'

export function FinalCta() {
  const { ref, className } = useReveal<HTMLDivElement>()

  return (
    <section className="section fc" id="contact">
      <div className="wrap">
        <div ref={ref} className={`fc-box ${className}`}>
          <span className="pill t-rev fc-badge">
            <span className="dot dot-live" />
            Now onboarding pilot brands
          </span>

          <h2 className="fc-h2">Transform customer interactions into growth</h2>

          <p className="fc-sub">
            Automate feedback collection, customer engagement, retention, support
            and revenue generation using AI-powered conversations — starting with
            one campaign and a hundred customers.
          </p>

          <div className="cta-row fc-cta">
            <a href={WA_LINK} className="btn btn-primary btn-lg">
              Book demo
              <Icon name="arrow" size={17} />
            </a>
            <a href={`mailto:${MAIL}?subject=Telenow%20—%20talk%20to%20an%20expert`} className="btn btn-ghost btn-lg">
              <Icon name="mail" size={16} />
              Talk to an expert
            </a>
          </div>

          <div className="fc-contact">
            <span><strong>Shubham Kumar</strong></span>
            <span className="fc-sep" />
            <a href={WA_LINK}>{PHONE}</a>
            <span className="fc-sep" />
            <a href={`mailto:${MAIL}`}>{MAIL}</a>
          </div>

          <ul className="fc-notes">
            <li><Icon name="check" size={15} />Pilot on one campaign before you commit</li>
            <li><Icon name="check" size={15} />Your transcripts reviewed with you, not summarised at you</li>
            <li><Icon name="check" size={15} />Live in days, not an integration quarter</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
