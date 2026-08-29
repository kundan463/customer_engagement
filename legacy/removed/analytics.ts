import type { CampaignRow, Kpi, RoiInput } from '../types'

/* =====================================================================
   SECTION 8 — the dashboard.

   Every series below is illustrative product data for a single 12-week
   window, shaped the way a real post-purchase programme actually runs:
   volume climbs as journeys switch on, redemption lags the offer that
   caused it, and sentiment barely moves week to week.
   ===================================================================== */

/** Exactly one hero figure on the view. Weekly revenue influenced, Rs lakh. */
export const REVENUE = {
  label: 'Revenue influenced',
  value: 42.6,
  unit: 'Rs lakh',
  delta: '+31% vs previous 12 weeks',
  weeks: [
    { w: 'W1', v: 1.4 },
    { w: 'W2', v: 1.9 },
    { w: 'W3', v: 2.2 },
    { w: 'W4', v: 2.1 },
    { w: 'W5', v: 2.9 },
    { w: 'W6', v: 3.4 },
    { w: 'W7', v: 3.2 },
    { w: 'W8', v: 4.1 },
    { w: 'W9', v: 4.6 },
    { w: 'W10', v: 5.0 },
    { w: 'W11', v: 5.6 },
    { w: 'W12', v: 6.2 },
  ],
}

export const KPIS: Kpi[] = [
  {
    label: 'Calls completed',
    to: 38412,
    delta: '+24%',
    up: true,
    spark: [18, 22, 25, 24, 29, 33, 31, 38, 42, 46, 51, 58],
  },
  {
    label: 'Conversations handled',
    to: 51908,
    delta: '+19%',
    up: true,
    spark: [26, 29, 33, 32, 38, 42, 41, 47, 52, 56, 61, 68],
  },
  {
    label: 'Customer satisfaction',
    to: 4.4,
    suffix: ' / 5',
    decimals: 1,
    delta: '+0.3',
    up: true,
    spark: [40, 40, 41, 41, 42, 42, 42, 43, 43, 44, 44, 44],
  },
  {
    label: 'Feedback collected',
    to: 29764,
    delta: '+34%',
    up: true,
    spark: [12, 15, 18, 17, 22, 26, 25, 31, 35, 39, 44, 50],
  },
  {
    label: 'Offers sent',
    to: 11240,
    delta: '+28%',
    up: true,
    spark: [5, 6, 8, 7, 10, 12, 11, 14, 16, 18, 20, 23],
  },
  {
    label: 'Offers redeemed',
    to: 3597,
    delta: '32.0% rate',
    up: true,
    spark: [1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 7, 8],
  },
  {
    label: 'Repeat purchases',
    to: 4821,
    delta: '+22%',
    up: true,
    spark: [2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 8],
  },
  {
    label: 'Retention rate',
    to: 68.4,
    suffix: '%',
    decimals: 1,
    delta: '+6.1 pts',
    up: true,
    spark: [58, 59, 60, 60, 62, 63, 63, 65, 66, 67, 68, 68],
  },
  {
    label: 'Avg call duration',
    to: 1.9,
    suffix: ' min',
    decimals: 1,
    delta: '-14s',
    up: false,
    spark: [24, 24, 23, 23, 22, 22, 21, 21, 20, 20, 19, 19],
  },
]

/**
 * Outcomes by week — three series, so the all-pairs gate applies and the
 * palette is capped at the first three validated dark slots.
 */
export const OUTCOME_SERIES = [
  { key: 'feedback', name: 'Feedback captured', slot: 1 },
  { key: 'resolved', name: 'Issues resolved', slot: 2 },
  { key: 'offers', name: 'Offers accepted', slot: 3 },
] as const

export const OUTCOME_WEEKS: { w: string; feedback: number; resolved: number; offers: number }[] = [
  { w: 'W5', feedback: 1980, resolved: 410, offers: 620 },
  { w: 'W6', feedback: 2240, resolved: 455, offers: 710 },
  { w: 'W7', feedback: 2110, resolved: 398, offers: 690 },
  { w: 'W8', feedback: 2680, resolved: 512, offers: 840 },
  { w: 'W9', feedback: 2910, resolved: 486, offers: 905 },
  { w: 'W10', feedback: 3180, resolved: 534, offers: 1010 },
  { w: 'W11', feedback: 3440, resolved: 501, offers: 1120 },
  { w: 'W12', feedback: 3820, resolved: 548, offers: 1265 },
]

/** Diverging polarity, not categorical: positive - neutral - negative. */
export const SENTIMENT = [
  { key: 'pos', name: 'Positive', pct: 71 },
  { key: 'neu', name: 'Neutral', pct: 21 },
  { key: 'neg', name: 'Negative', pct: 8 },
]

/** Ordinal funnel — one hue, light to dark, each stage of the offer path. */
export const FUNNEL = [
  { name: 'Offers sent', v: 11240 },
  { name: 'Offers opened', v: 8930 },
  { name: 'Offers redeemed', v: 3597 },
  { name: 'Repeat order placed', v: 2914 },
]

export const CAMPAIGNS: CampaignRow[] = [
  { name: 'Post-purchase feedback', agent: 'Feedback Agent', reached: 12480, connected: 71, outcome: 'CSAT 4.4', lift: '+34% feedback' },
  { name: 'Win-back · 90 days lapsed', agent: 'Reactivation Agent', reached: 6210, connected: 58, outcome: '11.2% reactivated', lift: '+Rs 8.1L' },
  { name: 'Cross-sell · serum buyers', agent: 'Recommendation Agent', reached: 4980, connected: 66, outcome: '31% accepted', lift: '+Rs 14.3L' },
  { name: 'Quarterly NPS wave', agent: 'Survey Agent', reached: 9040, connected: 62, outcome: 'NPS 61', lift: '+9 pts' },
  { name: 'Inbound support cover', agent: 'Support Agent', reached: 8320, connected: 100, outcome: '95% autonomous', lift: '-Rs 4.7L cost' },
]

/* =====================================================================
   SECTION 12 — ROI calculator inputs.
   ===================================================================== */

export const ROI_INPUTS: RoiInput[] = [
  {
    key: 'customers',
    label: 'Monthly customers',
    min: 500,
    max: 100000,
    step: 500,
    unit: '',
    hint: 'Orders delivered or services completed each month',
  },
  {
    key: 'aov',
    label: 'Average order value',
    min: 200,
    max: 15000,
    step: 100,
    unit: 'Rs',
    hint: 'What a typical order is worth to you',
  },
  {
    key: 'retention',
    label: 'Current retention rate',
    min: 5,
    max: 80,
    step: 1,
    unit: '%',
    hint: 'Share of customers who buy again within 90 days',
  },
  {
    key: 'redemption',
    label: 'Offer redemption rate',
    min: 2,
    max: 60,
    step: 1,
    unit: '%',
    hint: 'How often a discount you send gets used today',
  },
]
