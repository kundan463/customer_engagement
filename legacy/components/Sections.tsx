import { useReveal } from '../hooks'

/* ============================================================
   HOW IT WORKS
   ============================================================ */
const HOW = [
  {
    n: '1',
    title: 'Build the agent.',
    desc: 'Describe the job in plain language, or start from a ready agent. Point it at your knowledge base and your rules.',
    items: [
      'Feedback, support, sales, bookings',
      'Your questions, offers and business rules',
      'Grounded in your own docs and catalogue',
      '10 Indian languages, voice-native',
    ],
  },
  {
    n: '2',
    title: 'Give it a number.',
    desc: 'It answers every inbound call on the first ring, and dials out on the campaigns you schedule. No queue, no IVR tree.',
    items: [
      'Inbound answered 24/7, never a voicemail',
      'Outbound campaigns on your triggers',
      'Follows through on WhatsApp, SMS, email',
      '95% autonomous · 5% warm human handoff',
    ],
  },
  {
    n: '3',
    title: 'Get outcomes, not minutes.',
    desc: 'Every call returns a result your systems can act on — answered, resolved, booked, sold, or escalated.',
    items: [
      'Transcript, sentiment and intent per call',
      '30+ datapoints inferred per conversation',
      'Writes back to your CRM and helpdesk',
      'Revenue attributed to the conversation',
    ],
  },
]

function HowCard({ n, title, desc, items }: (typeof HOW)[number]) {
  const r = useReveal<HTMLDivElement>()
  return (
    <div className={`how-card ${r.className}`} ref={r.ref}>
      <div className="how-num">{n}</div>
      <div className="how-title">{title}</div>
      <div className="how-desc">{desc}</div>
      <ul className="how-list">
        {items.map((i) => <li key={i}>{i}</li>)}
      </ul>
    </div>
  )
}

export function HowItWorks() {
  const h = useReveal<HTMLHeadingElement>()
  const p = useReveal<HTMLParagraphElement>()
  return (
    <section className="section" id="how">
      <div className="eyebrow">How it works</div>
      <h2 className={`section-head ${h.className}`} ref={h.ref}>
Three <span className="accent">steps</span> to a working AI agent.
      </h2>
      <p className={`section-sub ${p.className}`} ref={p.ref}>
Build the agent, give it a number, and it runs. Inbound and outbound, voice-first,
        with WhatsApp, SMS and email behind it.
      </p>
      <div className="how-grid">
        {HOW.map((c) => <HowCard key={c.n} {...c} />)}
      </div>
    </section>
  )
}

/* ============================================================
   FEATURES
   ============================================================ */
const FEATURES = [
  { icon: '📞', title: 'Inbound, answered', desc: 'Every call picked up on the first ring, 24/7. No queue, no voicemail, no rigid IVR.', tone: '' },
  { icon: '🗣️', title: 'Voice-first, Hindi-native', desc: '10 Indian languages, real interruptions, sub-second turns. Not a translated bot.', tone: 'orange' },
  { icon: '📤', title: 'Outbound at scale', desc: 'Feedback, surveys, reminders, win-backs and collections — dialled on your triggers.', tone: 'dark' },
  { icon: '💬', title: 'Omnichannel follow-through', desc: 'The call promises it; WhatsApp, SMS or email delivers it before she hangs up.', tone: '' },
  { icon: '🧠', title: 'Understands the call', desc: 'Sentiment, intent and satisfaction scored live, so the agent changes course mid-conversation.', tone: '' },
  { icon: '🎯', title: 'Books and resolves', desc: 'Appointments, tickets, replacements and orders — completed on the call, not queued.', tone: '' },
  { icon: '🔗', title: 'Lands in your stack', desc: 'CRM, helpdesk, commerce and Slack updated per interaction. Nothing re-keyed.', tone: '' },
  { icon: '💰', title: 'Measured on revenue', desc: 'Offers redeemed, repeat orders and recovered churn attributed to the conversation.', tone: '' },
]

function FeatureCard({ icon, title, desc, tone }: (typeof FEATURES)[number]) {
  const r = useReveal<HTMLDivElement>()
  return (
    <div className={`feature-card ${tone} ${r.className}`} ref={r.ref}>
      <div className="feature-icon" aria-hidden="true">{icon}</div>
      <div className="feature-title">{title}</div>
      <div className="feature-desc">{desc}</div>
    </div>
  )
}

export function Features() {
  const h = useReveal<HTMLHeadingElement>()
  const p = useReveal<HTMLParagraphElement>()
  return (
    <div className="section-alt" id="why">
      <div className="section-alt-wrap">
        <div className="eyebrow">Why brands pick us</div>
        <h2 className={`section-head ${h.className}`} ref={h.ref}>
One platform. <span className="accent">Every</span> customer conversation.
        </h2>
        <p className={`section-sub ${p.className}`} ref={p.ref}>
Call centres cost too much and sleep at night. Chatbots deflect and annoy. Telenow talks —
          properly — to every customer, on every channel, about anything you sell or support.
        </p>
        <div className="features-grid">
          {FEATURES.map((f) => <FeatureCard key={f.title} {...f} />)}
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   ECONOMICS
   ============================================================ */
export function Economics() {
  const h = useReveal<HTMLHeadingElement>()
  const p = useReveal<HTMLParagraphElement>()
  const her = useReveal<HTMLDivElement>()
  const you = useReveal<HTMLDivElement>()

  return (
    <section className="section" id="economics">
      <div className="eyebrow">The economics</div>
      <h2 className={`section-head ${h.className}`} ref={h.ref}>
Both sides win.<br /><span className="accent">That's why they answer.</span>
      </h2>
      <p className={`section-sub ${p.className}`} ref={p.ref}>
Every conversation is a two-sided transaction — she gets an answer and a reward, you get
        data and an order. Worked example: one post-purchase call.
      </p>

      <div className="econ-grid">
        <div className={`econ-card her ${her.className}`} ref={her.ref}>
          <span className="econ-card-label">Her side</span>
          <div className="econ-card-name">Priya&rsquo;s reward</div>
          <div className="econ-quote">
            &ldquo;Ye brand actually care karta hai. Bata bhi rahi hai kaise use karna hai. ₹200 bhi mila.&rdquo;
          </div>
          <div className="econ-metrics">
            <div className="econ-metric"><span className="econ-metric-label">Time invested</span><span className="econ-metric-value">90 sec</span></div>
            <div className="econ-metric"><span className="econ-metric-label">Coupon received</span><span className="econ-metric-value">₹200</span></div>
            <div className="econ-metric"><span className="econ-metric-label">Product guidance</span><span className="econ-metric-value">Yes</span></div>
          </div>
        </div>

        <div className="econ-arrow" aria-hidden="true">→</div>

        <div className={`econ-card you ${you.className}`} ref={you.ref}>
          <span className="econ-card-label">Your side</span>
          <div className="econ-card-name">What the brand gets</div>
          <div className="econ-quote">
            &ldquo;20 questions answered, 30+ datapoints, and she just bought the moisturizer we recommended.&rdquo;
          </div>
          <div className="econ-metrics">
            <div className="econ-metric"><span className="econ-metric-label">Cost per conversation</span><span className="econ-metric-value">₹20</span></div>
            <div className="econ-metric"><span className="econ-metric-label">Cross-sell revenue</span><span className="econ-metric-value">₹1,420</span></div>
            <div className="econ-metric"><span className="econ-metric-label">Payback</span><span className="econ-metric-value">70×</span></div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   PRICING
   ============================================================ */
const PLANS = [
  {
    tag: 'WhatsApp only',
    name: 'Per review',
    amt: '₹20',
    unit: '/ completed review',
    desc: 'Text and voice-note conversations on WhatsApp. Pay only when she completes.',
    items: [
      ['Up to 20 questions answered', false],
      ['30+ datapoints extracted', false],
      ['10 Indian languages', false],
      ['Coupon delivered instantly', false],
      ['Voice call minutes', true],
    ] as [string, boolean][],
    min: 'Minimum 500 reviews to start',
    featured: false,
  },
  {
    tag: 'Most brands pick this',
    name: 'Voice + WhatsApp',
    amt: '₹5',
    unit: '/ voice min + ₹20 / review',
    desc: 'Full stack — she picks whichever channel she prefers. Same 20 answers + 30 datapoints either way.',
    items: [
      ['Everything in WhatsApp plan', false],
      ['AI-driven voice calls', false],
      ['Live transcription', false],
      ['Human escalation on adverse events', false],
      ['Ready-to-post UGC', false],
    ] as [string, boolean][],
    min: 'Minimum 500 reviews or ₹10,000 to start',
    featured: true,
  },
  {
    tag: 'Per user reached',
    name: 'Delivery',
    amt: '₹1',
    unit: '/ user reached',
    desc: 'Transactional charge per WhatsApp message delivered — added on top.',
    items: [
      ['WhatsApp delivery fees included', false],
      ['Failed messages not charged', false],
      ['Transparent monthly billing', false],
      ['No hidden platform costs', false],
    ] as [string, boolean][],
    min: 'Combined with review or voice pricing',
    featured: false,
  },
]

function PriceCard(p: (typeof PLANS)[number]) {
  const r = useReveal<HTMLDivElement>()
  return (
    <div className={`price-card${p.featured ? ' featured' : ''} ${r.className}`} ref={r.ref}>
      <span className="price-tag">{p.tag}</span>
      <div className="price-name">{p.name}</div>
      <div className="price-amt">
        <span className="price-amt-num">{p.amt}</span>
        <span className="price-amt-unit">{p.unit}</span>
      </div>
      <div className="price-desc">{p.desc}</div>
      <ul className="price-features">
        {p.items.map(([label, excluded]) => (
          <li key={label} className={excluded ? 'excluded' : ''}>{label}</li>
        ))}
      </ul>
      <div className="price-min">{p.min}</div>
    </div>
  )
}

export function Pricing() {
  const h = useReveal<HTMLHeadingElement>()
  const p = useReveal<HTMLParagraphElement>()
  return (
    <div className="section-alt">
      <div className="section-alt-wrap" id="pricing">
        <div className="eyebrow">Pricing</div>
        <h2 className={`section-head ${h.className}`} ref={h.ref}>
          Simple, <span className="accent">honest</span> pricing.
        </h2>
        <p className={`section-sub ${p.className}`} ref={p.ref}>
          Pay only for conversations that complete. Voice by the minute, WhatsApp by the review.
          Minimum 500 to start.
        </p>
        <div className="pricing-grid">
          {PLANS.map((x) => <PriceCard key={x.name} {...x} />)}
        </div>
      </div>
    </div>
  )
}
