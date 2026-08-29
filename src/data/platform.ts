import type {
  AgentCard,
  ArchTier,
  Capability,
  Integration,
  LaunchStep,
  Outcome,
  SecurityItem,
} from '../types'

/* ---- Section 4 · platform capabilities --------------------------------- */

export const CAPABILITIES: Capability[] = [
  {
    title: 'Voice AI',
    icon: 'voice',
    tone: 'aqua',
    wide: true,
    items: [
      'Human-like conversations, not menu trees',
      'Natural interruption and barge-in',
      'Ten Indian languages, Hinglish included',
      'Real-time responses under 900ms',
    ],
  },
  {
    title: 'Inbound automation',
    icon: 'inbound',
    tone: 'aqua',
    items: [
      'Customer support, answered on the first ring',
      'FAQs from your own knowledge base',
      'Product and order enquiries',
      'Appointment booking and confirmation',
    ],
  },
  {
    title: 'Outbound automation',
    icon: 'outbound',
    tone: 'aqua',
    items: [
      'Feedback campaigns at delivery scale',
      'Customer follow-ups that actually happen',
      'CSAT, NPS and structured surveys',
      'Reminder and renewal calls',
    ],
  },
  {
    title: 'Messaging automation',
    icon: 'message',
    tone: 'steel',
    items: [
      'WhatsApp — templates and free-form',
      'SMS fallback with delivery receipts',
      'Email for long-form and receipts',
      'One journey, every channel in step',
    ],
  },
  {
    title: 'Customer intelligence',
    icon: 'brain',
    tone: 'steel',
    wide: true,
    items: [
      'Sentiment read from how they spoke',
      'Satisfaction scoring per conversation',
      'Intent detection across 12 outcome codes',
      'Lead qualification with structured capture',
    ],
  },
  {
    title: 'Revenue automation',
    icon: 'revenue',
    tone: 'rev',
    items: [
      'Product recommendations off real mappings',
      'Personalised offers, gated on interest',
      'Coupon delivery with consent on file',
      'Retention and win-back workflows',
    ],
  },
  {
    title: 'Analytics',
    icon: 'chart',
    tone: 'steel',
    items: [
      'Campaign reporting by cohort',
      'Conversion and redemption tracking',
      'Call analytics with QA scoring',
      'Customer insight, exportable',
    ],
  },
]

/* ---- Section 5 · the live agent, then the template library ------------- */

/**
 * The published agent behind every example on this page. `vars` mirrors the
 * agent's own `apiVariables` — the two marked required are the minimum a
 * campaign must supply before it can dial anyone.
 */
export const FEATURED_AGENT = {
  name: 'Post-Purchase Assistant',
  persona: 'Maya',
  blurb:
    'The agent this whole page is built around, and the one playing in the call simulator above. She calls after delivery, asks openly, captures the rating and the verbatim behind it, escalates anything serious to a human, and earns at most one recommendation.',
  channels: ['Voice', 'WhatsApp'],
  languages: 'English · Hindi · Hinglish',
  vars: [
    { name: 'customer_first_name', required: true, note: 'greets her by name' },
    { name: 'phone_number', required: true, note: 'the number to reach' },
    { name: 'product_names', required: false, note: 'what to ask about' },
    { name: 'order_id', required: false, note: 'ties the call to the order' },
  ],
  outcomes: ['12 outcome codes', 'rating + verbatim', 'one earned offer'],
}

/* ---- Section 5 · agent types ------------------------------------------- */

export const AGENTS: AgentCard[] = [
  {
    name: 'Feedback Agent',
    icon: 'star',
    purpose: 'Calls after delivery, asks openly, captures the rating and the verbatim behind it.',
    channels: ['Voice', 'WhatsApp'],
    outcome: 'Rated feedback on 3.4x more customers than an email survey',
  },
  {
    name: 'Retention Agent',
    icon: 'heart',
    purpose: 'Reaches customers whose signals point at churn before they quietly stop buying.',
    channels: ['Voice', 'WhatsApp', 'Email'],
    outcome: 'Churn intent caught while it is still reversible',
  },
  {
    name: 'Survey Agent',
    icon: 'poll',
    purpose: 'Runs CSAT and NPS waves as conversations, with the reason attached to the score.',
    channels: ['Voice', 'SMS', 'Email'],
    outcome: 'Scores with a why, not a naked number',
  },
  {
    name: 'Recommendation Agent',
    icon: 'sparkle',
    purpose: 'Suggests the one product that genuinely complements what they already bought.',
    channels: ['Voice', 'WhatsApp'],
    outcome: '31% ask to hear more about the suggestion',
  },
  {
    name: 'Offer Agent',
    icon: 'tag',
    purpose: 'Generates a personalised, time-boxed discount once interest is real — not before.',
    channels: ['Voice', 'WhatsApp', 'SMS'],
    outcome: 'Margin spent only where it changes the decision',
  },
  {
    name: 'Support Agent',
    icon: 'support',
    purpose: 'Answers the common questions from your knowledge base and escalates the rest.',
    channels: ['Voice', 'WhatsApp'],
    outcome: '95% resolved without a person; 5% handed over in 30s',
  },
  {
    name: 'Reactivation Agent',
    icon: 'refresh',
    purpose: 'Reconnects customers who have gone past their normal repurchase cycle.',
    channels: ['Voice', 'WhatsApp', 'Email'],
    outcome: 'Dormant cohorts brought back without blanket discounting',
  },
  {
    name: 'Appointment Agent',
    icon: 'calendar',
    purpose: 'Books, confirms, reschedules and reminds — writing straight into your calendar.',
    channels: ['Voice', 'SMS'],
    outcome: 'No-shows cut by confirming the day before',
  },
  {
    name: 'Inbound Reception Agent',
    icon: 'inbound',
    purpose: 'Picks up every incoming call, at any hour, in the caller’s own language.',
    channels: ['Voice'],
    outcome: 'Zero missed calls, including nights and Sundays',
  },
  {
    name: 'Lead Qualification Agent',
    icon: 'filter',
    purpose: 'Collects requirements, budget and timeline, then routes only the ready ones.',
    channels: ['Voice', 'WhatsApp'],
    outcome: 'Sales time spent on qualified conversations only',
  },
]

/* ---- Section 6 · how businesses launch --------------------------------- */

export const LAUNCH: LaunchStep[] = [
  {
    n: '01',
    title: 'Import your customer data',
    body: 'A CSV, a CRM sync, or your order webhook. Phone, email, customer ID and purchase history are enough to make the first conversation specific rather than generic.',
    path: 'Phone · Email · Customer ID · Purchase history',
    view: 'import',
  },
  {
    n: '02',
    title: 'Create or generate an AI agent',
    body: 'Describe the call in plain language and the builder drafts it — questions, offers, branching logic, business rules, and the knowledge base it is allowed to answer from. Then you edit every line of it.',
    path: 'Questions · Offers · Logic · Business rules · Knowledge base',
    view: 'agent',
  },
  {
    n: '03',
    title: 'Choose your channels',
    body: 'Voice first, or messaging first, or a hybrid journey that steps down a channel when a call goes unanswered. Quiet hours, attempt caps and consent rules apply across all of them.',
    path: 'Voice · WhatsApp · SMS · Email · Hybrid',
    view: 'channels',
  },
  {
    n: '04',
    title: 'Launch the engagement',
    body: 'Outbound campaigns, inbound cover, retention journeys and survey waves run side by side. Start with a hundred customers, watch the transcripts, then open the tap.',
    path: 'Outbound · Inbound · Retention · Surveys',
    view: 'launch',
  },
  {
    n: '05',
    title: 'Monitor what came back',
    body: 'Feedback, conversions, offers redeemed, issues resolved and revenue influenced — per campaign, per agent, per cohort. Everything syncs onward to the systems you already run.',
    path: 'Feedback · Conversions · Redemptions · Revenue',
    view: 'monitor',
  },
]

/* ---- Section 7 · automation architecture ------------------------------- */

export const ARCH: ArchTier[] = [
  {
    tier: 'Ingest',
    nodes: [
      { name: 'Business data', detail: 'CRM, OMS, POS, subscriptions', tone: 'steel', icon: 'database' },
      { name: 'AI agent builder', detail: 'Prompt, logic, guardrails', tone: 'steel', icon: 'agent' },
      { name: 'Knowledge base', detail: 'Products, FAQ, policies', tone: 'steel', icon: 'book' },
    ],
  },
  {
    tier: 'Orchestrate',
    nodes: [
      { name: 'Workflow engine', detail: 'Triggers, journeys, caps, consent', tone: 'steel', icon: 'flow', hero: true },
    ],
  },
  {
    tier: 'Converse',
    nodes: [
      { name: 'Voice AI', detail: 'STT, reasoning, TTS, barge-in', tone: 'aqua', icon: 'voice' },
      { name: 'Messaging engine', detail: 'WhatsApp, SMS, email', tone: 'aqua', icon: 'message' },
    ],
  },
  {
    tier: 'Customer',
    nodes: [
      { name: 'The customer', detail: 'One conversation, any channel', tone: 'aqua', icon: 'user', hero: true },
    ],
  },
  {
    tier: 'Decide',
    nodes: [
      { name: 'Decision engine', detail: 'Sentiment, intent, gates, routing', tone: 'rev', icon: 'brain' },
      { name: 'Offers', detail: 'Recommendation, discount, coupon', tone: 'rev', icon: 'tag' },
    ],
  },
  {
    tier: 'Return',
    nodes: [
      { name: 'CRM sync', detail: 'Outcomes written back, real time', tone: 'steel', icon: 'sync' },
      { name: 'Analytics', detail: 'Cohorts, revenue, QA scoring', tone: 'steel', icon: 'chart' },
    ],
  },
]

/* ---- Section 9 · business outcomes ------------------------------------- */

export const OUTCOMES: Outcome[] = [
  {
    stat: '3.4x',
    title: 'Collect more feedback',
    body: 'A voice call gets answered where an email survey gets archived. Same customers, more of them heard.',
    foot: 'vs matched email cohort',
    tone: 'aqua',
  },
  {
    stat: '+18%',
    title: 'Improve satisfaction',
    body: 'Problems surface in the first week instead of in a public review three weeks later.',
    foot: 'CSAT, first quarter of use',
    tone: 'aqua',
  },
  {
    stat: '+22%',
    title: 'Increase repeat purchases',
    body: 'One earned recommendation on a call that was already happening, at the moment the product is on their mind.',
    foot: 'repeat rate, engaged cohort',
    tone: 'rev',
  },
  {
    stat: '11%',
    title: 'Recover lost revenue',
    body: 'Lapsed customers reactivated before a competitor gets there, mostly without spending margin on it.',
    foot: 'of dormant base, per quarter',
    tone: 'rev',
  },
  {
    stat: '95%',
    title: 'Reduce support costs',
    body: 'Routine questions handled autonomously. The five percent that need a person get one in thirty seconds.',
    foot: 'inbound resolved without a human',
    tone: 'steel',
  },
  {
    stat: '2.6x',
    title: 'Increase offer redemption',
    body: 'A code the customer asked for on a call beats a code blasted to a list that never opted into it.',
    foot: 'vs untargeted campaign',
    tone: 'rev',
  },
  {
    stat: '40k+',
    title: 'Scale engagement',
    body: 'Conversations a month with no hiring, no scripts to re-brief, no quality drift on the thousandth call.',
    foot: 'conversations in production',
    tone: 'steel',
  },
  {
    stat: '24/7',
    title: 'Operate around the clock',
    body: 'Inbound answered at 2am. Outbound held to daylight hours because that is the courteous thing to do.',
    foot: 'quiet hours enforced per region',
    tone: 'steel',
  },
]

/* ---- Section 10 · integrations ----------------------------------------- */

export const INTEGRATIONS: Integration[] = [
  { title: 'CRM', icon: 'database', names: ['Salesforce', 'HubSpot', 'Zoho', 'LeadSquared'] },
  { title: 'Helpdesk', icon: 'support', names: ['Zendesk', 'Freshdesk', 'Intercom', 'Gorgias'] },
  { title: 'E-commerce', icon: 'cart', names: ['Shopify', 'WooCommerce', 'Magento', 'Unicommerce'] },
  { title: 'Communication', icon: 'message', names: ['WhatsApp Business', 'Twilio', 'Exotel', 'Gupshup'] },
  { title: 'Marketing', icon: 'sparkle', names: ['Klaviyo', 'MoEngage', 'CleverTap', 'WebEngage'] },
  { title: 'Custom APIs', icon: 'code', names: ['REST', 'Webhooks', 'GraphQL', 'Batch SFTP'] },
  { title: 'ERP', icon: 'box', names: ['SAP', 'NetSuite', 'Odoo', 'Tally'] },
  { title: 'Knowledge bases', icon: 'book', names: ['Notion', 'Confluence', 'Google Drive', 'PDF & CSV'] },
]

/* ---- Section 11 · security --------------------------------------------- */

export const SECURITY: SecurityItem[] = [
  {
    title: 'Role-based access',
    body: 'Scoped roles for agents, campaigns, recordings and exports. Nobody sees a customer record their job does not need.',
    icon: 'key',
  },
  {
    title: 'Audit logs',
    body: 'Every prompt change, campaign launch, export and permission grant is attributed and timestamped.',
    icon: 'log',
  },
  {
    title: 'Call recording controls',
    body: 'Recording on or off per campaign, with disclosure honoured and retention windows you set.',
    icon: 'record',
  },
  {
    title: 'Encryption',
    body: 'TLS 1.3 in transit, AES-256 at rest, with key rotation on your schedule.',
    icon: 'lock',
  },
  {
    title: 'Data privacy',
    body: 'Consent and opt-out enforced at the workflow layer, so a suppressed customer cannot be dialled by any campaign.',
    icon: 'shield',
  },
  {
    title: 'Compliance ready',
    body: 'DPDP-aligned processing, configurable data residency, and DPAs for your enterprise review.',
    icon: 'check',
  },
  {
    title: 'Secure infrastructure',
    body: 'Isolated tenancy, least-privilege service accounts, and continuous dependency and access review.',
    icon: 'server',
  },
]
