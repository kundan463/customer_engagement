import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Icon } from './Icon'

/* =====================================================================
   The live Post-Purchase Assistant, called from inside our own UI.

   Telenow ships a widget.js that injects a fixed indigo bubble and an
   iframe to /embed/<slug>?var_…  — it exposes no JS API, so there is
   nothing to drive it with. Its only real contribution is that URL, so
   we build the URL ourselves and wrap it in our own chrome instead of
   loading the script and then hiding its button.

   The embed itself is Telenow's page in a cross-origin iframe: we own
   everything around it, not the call surface inside it.
   ===================================================================== */

const SLUG = '5d6a425fcd5f'

/** Exactly the variable set the agent declares. */
const VAR_KEYS = [
  'customer_first_name',
  'customer_id',
  'phone_number',
  'city',
  'preferred_language',
  'order_id',
  'order_date',
  'delivered_date',
  'product_names',
  'order_channel',
  'entry_channel',
  'helpline_number',
] as const

type Vars = Partial<Record<(typeof VAR_KEYS)[number], string>>

/** Mirrors widget.js: every declared key is sent, blank ones included. */
export function embedUrl(vars: Vars) {
  const q = VAR_KEYS.map(
    (k) => `var_${encodeURIComponent(k)}=${encodeURIComponent(vars[k] ?? '')}`,
  ).join('&')
  return `https://telenow.ai/embed/${encodeURIComponent(SLUG)}?${q}`
}

/* ---- opening the call from anywhere on the page ------------------------ */

const CallCtx = createContext<{ open: () => void }>({ open: () => {} })

export const useCall = () => useContext(CallCtx)

export function CallProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const open = useCallback(() => setIsOpen(true), [])
  const value = useMemo(() => ({ open }), [open])

  return (
    <CallCtx.Provider value={value}>
      {children}
      {isOpen && <CallModal onClose={() => setIsOpen(false)} />}
    </CallCtx.Provider>
  )
}

/* ---- the modal --------------------------------------------------------- */

function CallModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [order, setOrder] = useState('')
  const [live, setLive] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const firstRef = useRef<HTMLInputElement>(null)
  const returnTo = useRef<HTMLElement | null>(null)

  // Hold the page still, park focus in the dialog, and put it back on close.
  useEffect(() => {
    returnTo.current = document.activeElement as HTMLElement
    document.body.style.overflow = 'hidden'
    firstRef.current?.focus()
    return () => {
      document.body.style.overflow = ''
      returnTo.current?.focus?.()
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key !== 'Tab') return
      // Keep tabbing inside the dialog while it owns the screen.
      const f = panelRef.current?.querySelectorAll<HTMLElement>(
        'button, input, a[href], iframe, [tabindex]:not([tabindex="-1"])',
      )
      if (!f || !f.length) return
      const first = f[0]
      const last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const ready = name.trim().length > 0 && phone.trim().length >= 6

  const start = (e: React.FormEvent) => {
    e.preventDefault()
    if (ready) setLive(true)
  }

  const src = live
    ? embedUrl({
        customer_first_name: name.trim(),
        phone_number: phone.trim(),
        order_id: order.trim(),
        preferred_language: 'en-IN',
        entry_channel: 'website',
      })
    : ''

  return (
    <div className="cm" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div
        className={`cm-panel${live ? ' is-live' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Talk to Maya, the Post-Purchase Assistant"
        ref={panelRef}
      >
        <div className="cm-head">
          <span className="cm-avatar">M</span>
          <div className="cm-id">
            <strong>Post-Purchase Assistant</strong>
            <span>
              {live ? <><span className="dot dot-live" />On the call · Maya</> : 'Maya · voice'}
            </span>
          </div>
          <button className="cm-close" onClick={onClose} aria-label="Close the call">
            <Icon name="arrow" size={17} />
          </button>
        </div>

        {live ? (
          <>
            <iframe
              className="cm-frame"
              src={src}
              allow="microphone"
              title="Talk to Maya, the Post-Purchase Assistant"
            />
            <div className="cm-foot">
              <button className="cm-back" onClick={() => setLive(false)}>
                <Icon name="refresh" size={13} />
                Change details
              </button>
              <span className="mono">Live agent · Telenow</span>
            </div>
          </>
        ) : (
          <form className="cm-form" onSubmit={start}>
            <p className="cm-lede">
              Maya will greet you by name and talk about the order you give her —
              the same call your customers get 48 hours after delivery.
            </p>

            <label className="cm-field">
              <span>First name <i>required</i></span>
              <input
                ref={firstRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ananya"
                autoComplete="given-name"
                required
              />
              <em className="mono">{'{customer_first_name}'}</em>
            </label>

            <label className="cm-field">
              <span>Phone number <i>required</i></span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 90000 00000"
                autoComplete="tel"
                required
              />
              <em className="mono">{'{phone_number}'}</em>
            </label>

            <label className="cm-field">
              <span>Order reference <i className="is-opt">optional</i></span>
              <input
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                placeholder="#48211"
              />
              <em className="mono">{'{order_id}'}</em>
            </label>

            <button type="submit" className="btn btn-primary btn-block cm-go" disabled={!ready}>
              Start the call
              <Icon name="voice" size={16} />
            </button>

            <p className="cm-note">
              <Icon name="lock" size={13} />
              Your browser will ask for microphone access — the call runs in this
              window and nothing is stored by this page.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

/** The button that opens it. Used in the nav, the hero and the agent card. */
export function CallButton({ className, children }: { className?: string; children: React.ReactNode }) {
  const { open } = useCall()
  return (
    <button type="button" className={className} onClick={open}>
      {children}
    </button>
  )
}
