import type { JourneyStep, Stage } from '../types'

/* =====================================================================
   SECTION 1 — the hero rail.
   Ten stages of one post-purchase lifecycle, from parcel delivered to
   the number on the dashboard. Each carries a short transcript preview
   and the outcome that stage produces.
   ===================================================================== */

export const STAGES: Stage[] = [
  {
    label: 'Delivered',
    title: 'Customer receives the product',
    desc: 'Your courier marks the order delivered. That webhook is the trigger — no list to upload, no team to brief.',
    lines: [
      { who: 'SYS', text: 'order #48211 · delivered 09:42 · Vitamin C Serum' },
      { who: 'SYS', text: 'engagement queued · +48h · voice, hi-EN' },
    ],
    outcomeLabel: 'Trigger latency',
    outcomeValue: 'under 2s',
    tone: 'steel',
  },
  {
    label: 'Voice call',
    title: 'An AI voice agent opens the conversation',
    desc: 'Not an IVR and not a robocall. It greets by name, says why it is calling, and asks whether now is a good time.',
    lines: [
      { who: 'AI', text: 'Hi Ananya, this is Maya — just checking in on your order. Is now an okay time?' },
      { who: 'CX', text: 'Yeah, go ahead.', kind: 'voice', value: '0:08' },
    ],
    outcomeLabel: 'Answer rate',
    outcomeValue: '3.4x survey',
    tone: 'aqua',
  },
  {
    label: 'Feedback',
    title: 'Feedback is collected in her own words',
    desc: 'An open question first, a rating only once she has said something real. Nobody is pushed for a five.',
    lines: [
      { who: 'AI', text: 'How are you finding the serum so far?' },
      { who: 'CX', text: 'Good — but the dropper is a bit stiff.' },
    ],
    outcomeLabel: 'Rating captured',
    outcomeValue: '4 / 5',
    tone: 'aqua',
  },
  {
    label: 'Intent',
    title: 'Intent and sentiment are detected live',
    desc: 'The platform scores satisfaction, spots the product complaint buried inside a positive review, and routes each one differently.',
    lines: [
      { who: 'SYS', text: 'sentiment positive 0.81 · intent PRODUCT_FEEDBACK' },
      { who: 'SYS', text: 'sub-issue: packaging · queue to Quality' },
    ],
    outcomeLabel: 'Signals per call',
    outcomeValue: '30+',
    tone: 'steel',
  },
  {
    label: 'Recommend',
    title: 'One recommendation — only if it was earned',
    desc: 'A rating of four or better unlocks a single suggestion mapped to what she actually bought. One. Framed as a suggestion, never a pitch.',
    lines: [
      { who: 'AI', text: 'A lot of people pair that serum with the overnight mask. Want me to tell you a bit more?' },
      { who: 'CX', text: 'Sure, what does it do?' },
    ],
    outcomeLabel: 'Accept rate',
    outcomeValue: '31%',
    tone: 'rev',
  },
  {
    label: 'Offer',
    title: 'The offer is generated on the call',
    desc: 'Interest first, offer second. The discount is tied to the one recommended SKU, time-boxed, and never used to patch over a complaint.',
    lines: [
      { who: 'AI', text: 'I can put 20% on that mask for the next seven days. WhatsApp or email?' },
      { who: 'CX', text: 'WhatsApp is fine.' },
    ],
    outcomeLabel: 'Offer value',
    outcomeValue: '20% · 7 days',
    tone: 'rev',
  },
  {
    label: 'Coupon',
    title: 'The coupon lands before she hangs up',
    desc: 'Generated post-call by the workflow engine — a real code against a real SKU, on the channel she chose, with consent recorded.',
    lines: [
      { who: 'AI', text: 'Your reward', kind: 'reward', value: '20% off', code: 'ANYA20' },
      { who: 'SYS', text: 'expires in 7d · single use · opt-in on file' },
    ],
    outcomeLabel: 'Delivery',
    outcomeValue: '11s post-call',
    tone: 'rev',
  },
  {
    label: 'Follow-up',
    title: 'Follow-up runs itself',
    desc: 'Unredeemed on day five gets one reminder. The stiff dropper gets a quality ticket. Silence gets nothing — restraint is configured too.',
    lines: [
      { who: 'SYS', text: 'day 5 · coupon unredeemed, WhatsApp reminder (1 of 1)' },
      { who: 'SYS', text: 'ticket QLT-2291 · packaging · dropper stiffness' },
    ],
    outcomeLabel: 'Reminder cap',
    outcomeValue: '1 per journey',
    tone: 'steel',
  },
  {
    label: 'Repeat',
    title: 'She buys again',
    desc: 'The second order is attributed to the conversation that caused it — call, recommendation, code, redemption, revenue.',
    lines: [
      { who: 'SYS', text: 'order #49730 · Rs 1,420 · code ANYA20 redeemed' },
      { who: 'SYS', text: 'attributed to call CX-8841 · +9 days' },
    ],
    outcomeLabel: 'Order value',
    outcomeValue: 'Rs 1,420',
    tone: 'rev',
  },
  {
    label: 'Insight',
    title: 'It all lands in your systems',
    desc: 'Transcript, rating, sentiment, outcome code and revenue sync to your CRM and helpdesk. The dashboard is the by-product, not the point.',
    lines: [
      { who: 'SYS', text: 'CRM upsert · 17 fields · helpdesk ticket linked' },
      { who: 'SYS', text: 'outcome_code = RECOMMENDATION_ACCEPTED' },
    ],
    outcomeLabel: 'Sync',
    outcomeValue: 'real time',
    tone: 'steel',
  },
]

/* =====================================================================
   SECTION 2 — the same ten beats, opened up.
   Visual card + example conversation + business outcome, per step.
   ===================================================================== */

export const JOURNEY: JourneyStep[] = [
  {
    n: '01',
    name: 'Delivered',
    title: 'A customer receives a product or a service',
    body: 'The lifecycle starts the moment fulfilment ends. Telenow listens to your order events — courier webhook, POS close, service completion, subscription renewal — and holds the customer until they are actually ready to talk.',
    channel: 'Event source',
    vis: {
      caption: 'Delivery event · order #48211',
      rows: [
        { k: 'Customer', v: 'Ananya R · Pune' },
        { k: 'Order', v: 'Vitamin C Serum · Rs 749' },
        { k: 'Delivered', v: 'Today, 09:42' },
        { k: 'Engage at', v: '+48h · voice first', tone: 'hi' },
      ],
      bar: 12,
      barTone: 'steel',
    },
    chat: [
      { who: 'SYS', text: 'Webhook received from your OMS — status delivered.' },
      { who: 'SYS', text: 'Customer matched, language set to Hindi/English, quiet hours applied.' },
    ],
    metrics: [
      { value: 'under 2s', label: 'Event to queue' },
      { value: '48h', label: 'Settle window' },
      { value: 'zero', label: 'Lists to upload' },
    ],
  },
  {
    n: '02',
    name: 'Triggered',
    title: 'The business triggers engagement automatically',
    body: 'A rule decides who gets contacted, when, on which channel, and in whose voice. First-time buyer, high-value order, third repeat, lapsed for ninety days — each gets its own journey, all running at once.',
    channel: 'Workflow engine',
    vis: {
      caption: 'Journey selector',
      rows: [
        { k: 'Segment', v: 'First order over Rs 500' },
        { k: 'Journey', v: 'Post-purchase feedback', tone: 'hi' },
        { k: 'Agent', v: 'Feedback Agent · Maya' },
        { k: 'Window', v: '09:00 to 20:00 local' },
      ],
      bar: 22,
      barTone: 'steel',
    },
    chat: [
      { who: 'SYS', text: 'Matched rule: first_order AND value > 500 AND channel_optin = true' },
      { who: 'SYS', text: 'Queued 1 of 4,180 in today’s feedback campaign.' },
    ],
    metrics: [
      { value: '4,180', label: 'Queued today' },
      { value: '6', label: 'Parallel journeys' },
      { value: '100%', label: 'Consent checked' },
    ],
  },
  {
    n: '03',
    name: 'Reach out',
    title: 'AI reaches out by voice, WhatsApp, SMS or email',
    body: 'Voice goes first, because voice gets answered. If she does not pick up, the journey steps down a channel instead of redialling her into irritation — voicemail, then WhatsApp, then nothing.',
    channel: 'Voice · WhatsApp · SMS · Email',
    vis: {
      caption: 'Channel cascade',
      rows: [
        { k: 'Attempt 1', v: 'Voice · connected 00:04', tone: 'hi' },
        { k: 'Fallback', v: 'Voicemail, then WhatsApp' },
        { k: 'Language', v: 'Detected: Hinglish' },
        { k: 'Cap', v: '2 attempts, then stop' },
      ],
      bar: 34,
      barTone: 'aqua',
    },
    chat: [
      { who: 'AI', text: 'Hi Ananya, this is Maya calling about your recent order. Is now an okay time for a quick two-minute chat?' },
      { who: 'CX', text: 'Yes, that’s fine.' },
    ],
    metrics: [
      { value: '10', label: 'Indian languages' },
      { value: '2', label: 'Attempt cap' },
      { value: '24/7', label: 'Inbound cover' },
    ],
  },
  {
    n: '04',
    name: 'Feedback',
    title: 'The AI collects feedback the way a person would',
    body: 'One question per turn. An open question before a numeric one. It echoes what she said once, then moves on — and a call that ends in "it is fine, thanks" is logged as a success, not a failure.',
    channel: 'Voice',
    vis: {
      caption: 'Live capture',
      rows: [
        { k: 'Rating', v: '4 / 5', tone: 'hi' },
        { k: 'Liked', v: 'Texture, absorbs fast' },
        { k: 'Friction', v: 'Dropper is stiff' },
        { k: 'Verbatim', v: 'Stored, unparaphrased' },
      ],
      bar: 46,
      barTone: 'aqua',
    },
    chat: [
      { who: 'AI', text: 'How are you finding the serum so far?' },
      { who: 'CX', text: 'It’s good, absorbs really fast. The dropper is a bit stiff though.' },
      { who: 'AI', text: 'Noted — the dropper felt stiff. On a scale of one to five, how would you rate it overall?' },
      { who: 'CX', text: 'I’d say a four.' },
    ],
    metrics: [
      { value: '3.4x', label: 'vs email survey' },
      { value: '61%', label: 'Leave a verbatim' },
      { value: '1', label: 'Question per turn' },
    ],
  },
  {
    n: '05',
    name: 'Satisfaction',
    title: 'It reads satisfaction, not just the score',
    body: 'A four with a complaint inside it is not the same as a plain four. Sentiment is scored on how she actually spoke, so a polite low rating and a warm high one get routed to different places.',
    channel: 'Customer intelligence',
    vis: {
      caption: 'Signal extraction',
      rows: [
        { k: 'Sentiment', v: 'Positive · 0.81', tone: 'hi' },
        { k: 'Intent', v: 'PRODUCT_FEEDBACK' },
        { k: 'Sub-issue', v: 'Packaging · dropper' },
        { k: 'Escalate', v: 'No — log to Quality' },
      ],
      bar: 56,
      barTone: 'steel',
    },
    chat: [
      { who: 'SYS', text: 'Satisfaction 4/5 · tone positive · one product-quality signal detected.' },
      { who: 'SYS', text: 'Recommendation gate: OPEN (rating 4 or more, no active complaint).' },
    ],
    metrics: [
      { value: '30+', label: 'Datapoints per call' },
      { value: '0.81', label: 'Sentiment score' },
      { value: '12', label: 'Outcome codes' },
    ],
  },
  {
    n: '06',
    name: 'Resolve',
    title: 'Complaints stop the script cold',
    body: 'Damage, a wrong item, a refund request or a skin reaction ends the feedback flow mid-sentence. It acknowledges specifically, captures once, promises nothing it cannot keep, and hands over to a human.',
    channel: 'Support · escalation',
    vis: {
      caption: 'Escalation path',
      rows: [
        { k: 'Trigger', v: 'Skin reaction mentioned', tone: 'rev' },
        { k: 'Action', v: 'Stop flow · no upsell' },
        { k: 'Queue', v: 'Medical escalation' },
        { k: 'Callback', v: 'Within 1 business day' },
      ],
      bar: 66,
      barTone: 'rev',
    },
    chat: [
      { who: 'CX', text: 'Actually my skin reacted to it — it has been itchy for two days.' },
      { who: 'AI', text: 'I’m really sorry to hear that. Please stop using it right away. Have you been able to speak to a doctor?' },
      { who: 'CX', text: 'Not yet.' },
      { who: 'AI', text: 'I’ll have our care team call you back today to sort this out properly. I have logged it — no offers, nothing else, just this.' },
    ],
    metrics: [
      { value: '95%', label: 'Handled autonomously' },
      { value: '30s', label: 'To a human when not' },
      { value: 'zero', label: 'Promises it cannot keep' },
    ],
  },
  {
    n: '07',
    name: 'Recommend',
    title: 'It recommends what genuinely fits',
    body: 'The recommendation comes off a mapping from what she bought, gated on a positive experience, capped at one product, and dropped the instant she says no. A bad recommendation costs more than the one you did not make.',
    channel: 'Revenue automation',
    vis: {
      caption: 'Recommendation engine',
      rows: [
        { k: 'Bought', v: 'Vitamin C Serum' },
        { k: 'Mapped', v: 'Overnight Repair Mask', tone: 'hi' },
        { k: 'Gate', v: 'Rating 4+ · no complaint' },
        { k: 'Limit', v: 'One, then never again' },
      ],
      bar: 74,
      barTone: 'rev',
    },
    chat: [
      { who: 'AI', text: 'A lot of people who like that serum use the overnight mask once a week with it. Want me to tell you a bit more?' },
      { who: 'CX', text: 'Yeah, actually — how much is it?' },
    ],
    metrics: [
      { value: '31%', label: 'Ask to hear more' },
      { value: '1', label: 'Max per call' },
      { value: 'zero', label: 'Repeats after a no' },
    ],
  },
  {
    n: '08',
    name: 'Offer',
    title: 'The offer is generated for that customer',
    body: 'Only after she shows interest. Tied to the one SKU that was recommended, time-boxed to seven days, checked against her marketing consent, and never offered as an apology for a bad experience.',
    channel: 'Revenue automation',
    vis: {
      caption: 'Offer generation',
      rows: [
        { k: 'SKU', v: 'MSK-014 · Repair Mask' },
        { k: 'Discount', v: '20% · 7 days', tone: 'rev' },
        { k: 'Consent', v: 'marketing_opt_in = yes' },
        { k: 'Channel', v: 'WhatsApp (her choice)' },
      ],
      bar: 82,
      barTone: 'rev',
    },
    chat: [
      { who: 'AI', text: 'Since you’re on the call, I can arrange 20% off that mask — good for the next seven days. WhatsApp or email?' },
      { who: 'CX', text: 'WhatsApp, please.' },
      { who: 'AI', text: 'Done. The team will send it across in a few minutes.' },
    ],
    metrics: [
      { value: '20%', label: 'Single authorised offer' },
      { value: '7d', label: 'Validity' },
      { value: '1', label: 'SKU, never a bundle' },
    ],
  },
  {
    n: '09',
    name: 'Follow-up',
    title: 'Follow-up happens without anyone remembering',
    body: 'The coupon goes out post-call. Day five, if it is unredeemed, one reminder — one. The quality note becomes a ticket. Everything that was promised on the call actually happens.',
    channel: 'WhatsApp · SMS · Email',
    vis: {
      caption: 'Follow-up ledger',
      rows: [
        { k: '+11s', v: 'Coupon ANYA20 delivered', tone: 'hi' },
        { k: '+5d', v: 'Reminder (1 of 1)' },
        { k: '+0h', v: 'Ticket QLT-2291 raised' },
        { k: 'Then', v: 'Stop. No third message.' },
      ],
      bar: 90,
      barTone: 'aqua',
    },
    chat: [
      { who: 'SYS', text: 'WhatsApp · "Here is your 20% code ANYA20 for the Overnight Repair Mask. Valid till the 5th."' },
      { who: 'SYS', text: 'Quality ticket opened and linked to call CX-8841.' },
    ],
    metrics: [
      { value: '11s', label: 'Call to coupon' },
      { value: '1', label: 'Reminder, capped' },
      { value: '98%', label: 'Promise-kept rate' },
    ],
  },
  {
    n: '10',
    name: 'Outcome',
    title: 'The business gets the outcome, not a transcript dump',
    body: 'One outcome code per conversation, the verbatim, the sentiment, the ticket, the coupon and — nine days later — the order it produced. Written into your CRM, ready to act on.',
    channel: 'CRM · analytics',
    vis: {
      caption: 'Outcome record · CX-8841',
      rows: [
        { k: 'outcome_code', v: 'RECOMMENDATION_ACCEPTED', tone: 'hi' },
        { k: 'rating', v: '4' },
        { k: 'discount_sku', v: 'MSK-014' },
        { k: 'revenue', v: 'Rs 1,420 · +9 days', tone: 'rev' },
      ],
      bar: 100,
      barTone: 'rev',
    },
    chat: [
      { who: 'SYS', text: '17 fields upserted to CRM. Ticket linked. Coupon redemption tracked to order #49730.' },
      { who: 'SYS', text: 'Campaign dashboard updated — this call is now one row in a cohort of 4,180.' },
    ],
    metrics: [
      { value: '17', label: 'Fields synced' },
      { value: 'Rs 1,420', label: 'Attributed revenue' },
      { value: '70x', label: 'Cost of the call' },
    ],
  },
]
