import { useEffect, useState } from 'react'
import { CallButton } from './LiveAgent'
import { Icon } from './Icon'

export const WA_LINK =
  'https://wa.me/919110035665?text=Hi%20Shubham%20%E2%80%94%20I%20saw%20Telenow%20and%20want%20a%20demo%20for%20my%20brand.'
export const MAIL = 'shubham@telenow.ai'
export const PHONE = '+91 91100 35665'

/** The template library on telenow.ai — the index every agent card falls back to. */
export const TELENOW_TEMPLATES = 'https://telenow.ai/templates'

/**
 * A published template's page, e.g. .../templates/outbound-lead-qualifier.
 * Agents carry a `template` slug where a real published template does the same
 * job; those without one land on the library index rather than on a template
 * that does something else.
 */
export const templateUrl = (slug?: string) =>
  slug ? `${TELENOW_TEMPLATES}/${slug}` : TELENOW_TEMPLATES

/**
 * The published Post-Purchase Assistant. Deliberately NOT linked from the page:
 * the call simulator IS this agent, so visitors hear it here rather than being
 * sent away. Kept so re-enabling the redirect is a one-line change.
 */
export const MAYA_AGENT = 'https://telenow.ai/p/5d6a425fcd5f'

const LINKS = [
  { href: '#journey', label: 'Journey' },
  { href: '#conversation', label: 'Live demo' },
  { href: '#platform', label: 'Platform' },
  { href: '#agents', label: 'Agents' },
]

/**
 * The Telenow wordmark, as it is on telenow.ai: "Tele" reversed out of an ink
 * badge, "now" set beside it — one word, two halves.
 *
 * Built from text rather than the PNG the site ships. It stays crisp at any
 * size, inherits the type stack, costs no request, and can invert itself on
 * the dark footer, which a flat bitmap cannot.
 */
function BrandWord() {
  return (
    <span className="brand-word">
      <span className="brand-badge">Tele</span>now
    </span>
  )
}

export function Nav() {
  const [stuck, setStuck] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const on = () => setStuck(window.scrollY > 12)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  // The mobile sheet takes the whole viewport, so hold the page still.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <header className={stuck ? 'nav is-stuck' : 'nav'}>
      <div className="wrap">
        <div className="nav-in">
          <a href="#top" className="brand" aria-label="Telenow — home">
            <BrandWord />
          </a>

          <nav className="nav-links" aria-label="Sections">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href}>{l.label}</a>
            ))}
          </nav>

          <div className="nav-actions">
            <CallButton className="btn btn-ghost btn-sm nav-hide-sm">
              <Icon name="voice" size={15} />
              Live agent
            </CallButton>
            <a href="#demo" className="btn btn-primary btn-sm">Book demo</a>
            <button
              className="nav-burger"
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              <span className={open ? 'burger is-x' : 'burger'} aria-hidden="true"><i /><i /></span>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="nav-sheet" onClick={() => setOpen(false)}>
          <nav className="wrap nav-sheet-in" aria-label="Sections">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href}>{l.label}<Icon name="arrow" size={17} /></a>
            ))}
            <a href={WA_LINK} className="btn btn-primary btn-block" style={{ marginTop: 18 }}>
              Book a demo
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}

export function StickyCta() {
  return (
    <div className="sticky-cta">
      <CallButton className="btn btn-ghost btn-sm">
        <Icon name="voice" size={15} />
        Live agent
      </CallButton>
      <a href="#demo" className="btn btn-primary btn-sm">Book demo</a>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="#top" className="brand">
              <BrandWord />
            </a>
            <p>
              The AI customer engagement platform for teams who would rather hear
              from every customer than survey a handful of them.
            </p>
            <div className="footer-contact">
              <a href={WA_LINK}><Icon name="message" size={16} />{PHONE}</a>
              <a href={`mailto:${MAIL}`}><Icon name="mail" size={16} />{MAIL}</a>
            </div>
          </div>

          <div className="footer-cols">
            <div>
              <h4>Platform</h4>
              <a href="#platform">Voice AI</a>
              <a href="#platform">Messaging automation</a>
              <a href="#platform">Customer intelligence</a>
            </div>
            <div>
              <h4>Agents</h4>
              <a href="#agents">Feedback</a>
              <a href="#agents">Retention</a>
              <a href="#agents">Support</a>
              <a href="#agents">Reactivation</a>
            </div>
            <div>
              <h4>Company</h4>
              <a href="#security">Security</a>
              <a href="#integrations">Integrations</a>
              <a href="#demo">Book a demo</a>
            </div>
          </div>
        </div>

        <div className="footer-bot">
          <span>© {new Date().getFullYear()} Telenow. All rights reserved.</span>
          <span className="mono">Made for brands that talk to their customers.</span>
        </div>
      </div>
    </footer>
  )
}
