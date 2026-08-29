export type Tone = 'aqua' | 'rev' | 'steel'

/** A line of dialogue in a compact transcript preview. */
export interface Line {
  who: 'AI' | 'CX' | 'SYS'
  text: string
}

/** Hero stage — one node on the animated customer-journey rail. */
export interface Stage {
  label: string
  title: string
  desc: string
  lines: Line[]
  outcomeLabel: string
  outcomeValue: string
  tone: Tone
}

/** A key/value row inside a journey step's visual card. */
export interface VisRow {
  k: string
  v: string
  tone?: 'hi' | 'rev'
}

export interface JourneyStep {
  n: string
  name: string
  title: string
  body: string
  channel: string
  vis: { caption: string; rows: VisRow[]; bar: number; barTone: Tone }
  chat: Line[]
  metrics: { value: string; label: string }[]
}

export interface CallTurn {
  who: 'AI' | 'CX'
  text: string
  /** Seconds into the call at which this turn lands. */
  at: number
  sentiment?: { pos: number; neu: number; neg: number }
  intent?: string
}

export interface Conversation {
  id: string
  tab: string
  agent: string
  role: string
  initial: string
  channel: string
  lang: string
  callId: string
  duration: number
  score: string
  summary: string
  meta: { k: string; v: string }[]
  outcomes: string[]
  turns: CallTurn[]
}

export interface Capability {
  title: string
  icon: string
  tone: Tone
  wide?: boolean
  items: string[]
}

export interface AgentCard {
  name: string
  icon: string
  purpose: string
  channels: string[]
  outcome: string
}

export interface LaunchStep {
  n: string
  title: string
  body: string
  path: string
  view: string
}

export interface ArchTier {
  tier: string
  nodes: { name: string; detail: string; tone: Tone; icon: string; hero?: boolean }[]
}

export interface Outcome {
  stat: string
  title: string
  body: string
  foot: string
  tone: Tone
}

export interface Integration {
  title: string
  icon: string
  names: string[]
}

export interface SecurityItem {
  title: string
  body: string
  icon: string
}

/* ---- Section 8 · analytics -------------------------------------------- */

/** A KPI tile. `to` is the count-up target; `suffix`/`prefix` frame it. */
export interface Kpi {
  label: string
  to: number
  prefix?: string
  suffix?: string
  decimals?: number
  delta: string
  /** true when a rising number is the good direction. */
  up: boolean
  spark: number[]
}

export interface CampaignRow {
  name: string
  agent: string
  reached: number
  connected: number
  outcome: string
  lift: string
}

/* ---- Section 12 · ROI calculator --------------------------------------- */

export interface RoiInput {
  key: 'customers' | 'aov' | 'retention' | 'redemption'
  label: string
  min: number
  max: number
  step: number
  unit: string
  hint: string
}

/* ---- Section 13 · demo generator --------------------------------------- */

export interface DemoForm {
  business: string
  industry: string
  volume: string
  useCase: string
  channels: string[]
  email: string
  phone: string
}
