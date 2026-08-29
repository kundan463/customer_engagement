import { useEffect, useState } from 'react'
import { CallButton } from './LiveAgent'
import { Icon } from './Icon'

export const WA_LINK =
  'https://wa.me/919110035665?text=Hi%20Shubham%20%E2%80%94%20I%20saw%20Telenow%20and%20want%20a%20demo%20for%20my%20brand.'
export const MAIL = 'shubham@telenow.ai'
export const PHONE = '+91 91100 35665'

/**
 * Where "use this template" sends people. Only the telenow.ai domain is known
 * for certain, so this points at the root — repoint it at the real console
 * (e.g. https://app.telenow.ai/agents) and every template link follows.
 */
export const TELENOW_APP = 'https://telenow.ai'

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
      <div className="wrap nav-in">
        <a href="#top" className="brand" aria-label="Telenow — home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 28 28" width="26" height="26" fill="none" aria-hidden="true">
              <rect x="1" y="1" width="26" height="26" rx="8" fill="url(#bg)" />
              <path d="M8.5 10.5a5.5 5.5 0 0 1 11 0v3a5.5 5.5 0 0 1-11 0Z" stroke="#12060A" strokeWidth="1.7" />
              <path d="M14 19.5v3M10.5 22.5h7" stroke="#12060A" strokeWidth="1.7" strokeLinecap="round" />
              <defs>
                <linearGradient id="bg" x1="0" y1="0" x2="28" y2="28">
                  <stop stopColor="#FFA153" />
                  <stop offset="1" stopColor="#FF7A1A" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <span className="brand-word">telenow</span>
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
              <span className="brand-word">telenow</span>
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
