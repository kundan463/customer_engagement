import { useState } from 'react'
import { useReveal } from '../hooks'
import { WA } from './Chrome'

const FAQS: [string, string][] = [
  [
    'What exactly is Telenow?',
    'A voice AI platform that runs your customer conversations end to end. It answers every inbound call 24/7, dials outbound campaigns on your triggers, and follows through on WhatsApp, SMS and email. Feedback, support, bookings, upsell, surveys, win-backs and collections all run on the same engine — and every outcome is written back to your CRM and helpdesk.',
  ],
  [
    'How is this different from an IVR or a chatbot?',
    'An IVR makes people press buttons through a tree. A chatbot deflects until they give up. Telenow has an actual conversation — it handles interruptions, switches language mid-call, answers the question the customer really asked, and completes the task on the call. In pilots, response rates ran 3.4× a matched survey cohort.',
  ],
  [
    'How long does it take to go live?',
    'No engineering lift. Describe the agent in plain language or start from a ready one, point it at your knowledge base, and give it a number. Most teams are live on their first use case within a day, and connected to their CRM in the first week.',
  ],
  [
    'What happens if a customer reports a problem?',
    'The campaign stops for that customer immediately. No more questions, no recommendation, no coupon. She is routed to your CX team in under 30 seconds with the full transcript, so she never repeats herself. Roughly 5% of conversations go this way.',
  ],
  [
    'What does it cost?',
    '₹5 per voice minute, ₹20 per completed WhatsApp review, and ₹1 per user reached for message delivery. You pay for conversations that complete, not for seats or platform access. Minimum 500 reviews or ₹10,000 to start.',
  ],
  [
    'Which languages does it actually handle?',
    'Ten Indian languages, voice-native rather than translated — including Hindi, Tamil and Bengali. She can also switch mid-conversation, which people do more often than you would expect.',
  ],
  [
    'Is my customer data shared with other brands?',
    'No. Conversations, transcripts and recordings are scoped to the brand that ran the campaign, stored in India, and never used to inform another brand. You can export everything or ask us to delete it at any point.',
  ],
]

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  const h = useReveal<HTMLHeadingElement>()

  return (
    <section className="section" id="faq">
      <div className="faq-grid">
        <div>
          <div className="eyebrow">Questions</div>
          <h2 className={`section-head ${h.className}`} ref={h.ref}>
            Straight <span className="accent">answers</span>.
          </h2>
          <p className="section-sub">
            The things teams ask on the first call. If yours is not here, message Shubham — he reads
            every one himself.
          </p>
          <a href={WA} className="btn btn-outline" style={{ marginTop: 24 }}>ASK US DIRECTLY</a>
        </div>

        <div className="faq-list">
          {FAQS.map(([q, a], i) => {
            const isOpen = open === i
            return (
              <div className={`faq-item${isOpen ? ' open' : ''}`} key={q}>
                <button
                  className="faq-q"
                  aria-expanded={isOpen}
                  aria-controls={`faq-a-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span>{q}</span>
                  <span className="faq-ic" aria-hidden="true"><i /><i /></span>
                </button>
                <div className="faq-a" id={`faq-a-${i}`} role="region" hidden={!isOpen}>
                  <p>{a}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
