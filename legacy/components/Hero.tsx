import { useReveal } from '../hooks'
import { WA } from './Chrome'

const WAVE = [6, 10, 14, 16, 12, 16, 10, 14, 16, 8, 12, 14]

export function Hero() {
  const visual = useReveal<HTMLDivElement>()
  const head = useReveal<HTMLHeadingElement>()
  const hindi = useReveal<HTMLDivElement>()
  const sub = useReveal<HTMLParagraphElement>()
  const verbs = useReveal<HTMLDivElement>()
  const ctas = useReveal<HTMLDivElement>()

  return (
    <section className="hero" id="top">
      <div className="hero-grid">
        {/* phone first on mobile, right-hand side on desktop */}
        <div className={`hero-visual ${visual.className}`} ref={visual.ref}>
          <div className="hero-bg-rings" aria-hidden="true" />

          <div className="ai-sparkle" aria-hidden="true">
            <div className="ai-sparkle-text">Voice AI</div>
          </div>

          <div className="hero-phone">
            <div className="hero-phone-notch" aria-hidden="true" />
            <div className="hero-phone-screen">
              <div className="hero-phone-header">
                <div className="hero-phone-avatar">P</div>
                <div className="hero-phone-title">
                  <span className="name">Priya · Ember &amp; Root</span>
                  <span className="status">
                    <span className="status-dot" /> online · Hindi
                  </span>
                </div>
              </div>

              {/* the voice call is the headline act — everything else follows it */}
              <div className="hero-phone-callbar">
                <span className="cb-ic" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="11" height="11">
                    <path d="M6.6 10.8a15 15 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.6 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.6a1 1 0 01-.24 1z" />
                  </svg>
                </span>
                <span className="cb-txt">Telenow AI · voice call</span>
                <span className="cb-time">01:24</span>
              </div>

              <div className="hero-phone-body">
                <div className="mini-msg mini-msg-in">
                  Hi Priya! Serum kaisa laga?
                  <span className="mini-msg-time">10:24</span>
                </div>

                <div className="mini-msg mini-msg-out mini-voice">
                  <span className="mini-voice-play" aria-hidden="true">▶</span>
                  <span className="mini-voice-wave" aria-hidden="true">
                    {WAVE.map((h, i) => (
                      <span className="bar" key={i} style={{ height: h }} />
                    ))}
                  </span>
                  <span className="mini-voice-duration">0:08</span>
                </div>

                <div className="mini-msg mini-msg-in">
                  Bilkul normal hai. Every other day try karein.
                  <span className="mini-msg-time">10:26</span>
                </div>

                <div className="mini-coupon">
                  <span className="mini-coupon-label">Your reward</span>
                  <span className="mini-coupon-amt">₹200 off</span>
                  <span className="mini-coupon-code">PRIYA200</span>
                </div>
              </div>
            </div>
          </div>

          {/* surfaces visible on every breakpoint */}
          <div className="surface surface-crosssell">
            <div className="surf-icon green" aria-hidden="true">✓</div>
            <div className="surf-body">
              <div className="surf-label">Cross-sell</div>
              <div className="surf-value">₹1,420 order</div>
              <div className="surf-caption">via Telenow · Shopify</div>
            </div>
          </div>

          <div className="surface surface-datapoints">
            <div className="surf-label">Datapoints extracted</div>
            <div className="surf-value">30+</div>
            <div className="surf-pill-row">
              <span className="surf-pill">Hindi</span>
              <span className="surf-pill">via IG</span>
              <span className="surf-pill">Age 28-35</span>
            </div>
          </div>

          {/* desktop-only surfaces */}
          <div className="surface surface-desktop surface-answers">
            <div className="surf-label">Live · Just now</div>
            <div className="surf-answers">
              <div className="surf-answer-row"><span className="surf-answer-q">Q1</span><span className="surf-answer-a">Usage: high confidence</span></div>
              <div className="surf-answer-row"><span className="surf-answer-q">Q2</span><span className="surf-answer-a">NPS: 9</span></div>
              <div className="surf-answer-row"><span className="surf-answer-q">Q3</span><span className="surf-answer-a">Refer: yes, sister</span></div>
            </div>
          </div>

          <div className="surface surface-desktop surface-call">
            <div className="surf-icon dark" aria-hidden="true">📞</div>
            <div className="surf-body">
              <div className="surf-label">Inbound · answered in 1 ring</div>
              <div className="surf-value">No queue, no IVR</div>
              <div className="surf-caption">24/7 · 10 languages</div>
            </div>
          </div>

          <div className="surface surface-desktop surface-campaign">
            <div className="surf-camp-header">
              <span className="surf-camp-title">Outbound campaign</span>
              <span className="surf-camp-status">Live</span>
            </div>
            <div className="surf-camp-row"><span>Agent</span><strong>Feedback</strong></div>
            <div className="surf-camp-row"><span>Channels</span><strong>Voice + WA</strong></div>
            <div className="surf-camp-row"><span>Languages</span><strong>Hindi + 4</strong></div>
          </div>

          <div className="surface surface-desktop surface-recommend">
            <div className="surf-icon white" aria-hidden="true">✦</div>
            <div className="surf-body">
              <div className="surf-label">Recommended &amp; bought</div>
              <div className="surf-value">Brightening SPF</div>
              <div className="surf-caption">Cross-sell converted</div>
            </div>
          </div>
        </div>

        <div className="hero-copy">
          <h1 className={`hero-headline ${head.className}`} ref={head.ref}>
            Built For D2C.<br />
            Powered By <span className="accent-dot">Voice</span>.
          </h1>
          <div className={`hero-hindi ${hindi.className}`} ref={hindi.ref}>
            हर ग्राहक, सुनी गई.
          </div>
          <p className={`hero-sub ${sub.className}`} ref={sub.ref}>
            Answer every inbound call, run every outbound campaign, and follow through on WhatsApp,
            SMS and email. Feedback, support, upsell, retention — one voice AI platform, 24/7.
          </p>
          <div className={`hero-verbs ${verbs.className}`} ref={verbs.ref}>
            <span className="verb">Answer</span>
            <span className="verb-sep">|</span>
            <span className="verb">Engage</span>
            <span className="verb-sep">|</span>
            <span className="verb">Resolve</span>
            <span className="verb-sep">|</span>
            <span className="verb">Retain</span>
          </div>
          <div className={`hero-ctas ${ctas.className}`} ref={ctas.ref}>
            <a href={WA} className="btn btn-primary">BOOK A DEMO</a>
            <a href="#conversation" className="btn btn-outline">HEAR A CALL</a>
          </div>
        </div>
      </div>
    </section>
  )
}

export function TrustBar() {
  return (
    <div className="trust-bar">
      <div className="trust-bar-inner">
        <div className="trust-label">
          <strong>30,000+ voice conversations</strong>
          Already running in production
        </div>
        <div className="trust-logos">
          <span className="trust-logo">BFSI</span>
          <span className="trust-logo">HEALTHCARE</span>
          <span className="trust-logo script">retail &amp; d2c</span>
          <span className="trust-logo">EDTECH</span>
          <span className="trust-logo serif">Logistics</span>
          <span className="trust-logo">SERVICES</span>
        </div>
      </div>
    </div>
  )
}
