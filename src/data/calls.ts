import type { Conversation } from '../types'

/* =====================================================================
   SECTION 3 — five real conversation shapes.

   `at` is the second of the call the turn lands on, so the player can
   run a transcript against a clock, a waveform and a sentiment meter.
   `sentiment` is only attached where the read actually moves; the
   player holds the last value in between.

   The outcome codes are the real ones a post-purchase agent records:
   exactly one per call, most-serious-first.
   ===================================================================== */

export const CALLS: Conversation[] = [
  {
    id: 'feedback',
    tab: 'Feedback call',
    agent: 'Maya',
    role: 'Post-Purchase Assistant',
    initial: 'M',
    channel: 'Outbound voice',
    lang: 'English',
    callId: 'CX-8841',
    duration: 48,
    score: '4 / 5',
    summary:
      'Checked in 48 hours after delivery. Customer is happy with the serum, rated it four out of five, and flagged a stiff dropper. Rating gate opened, one recommendation offered and accepted, 20% code queued to WhatsApp. Packaging note routed to Quality.',
    meta: [
      { k: 'outcome_code', v: 'RECOMMENDATION_ACCEPTED' },
      { k: 'rating', v: '4' },
      { k: 'sentiment', v: 'positive' },
      { k: 'issue_type', v: 'quality_concern (minor)' },
      { k: 'escalation_queue', v: 'Quality Team' },
      { k: 'discount_offered', v: 'true · MSK-014' },
    ],
    outcomes: [
      'Verbatim feedback captured',
      'Quality ticket QLT-2291 raised',
      '20% coupon sent on WhatsApp',
      'CRM updated · 17 fields',
    ],
    turns: [
      { who: 'AI', at: 0, text: 'Hi Ananya, this is Maya calling about your recent order. Thank you for choosing us — how has your experience been so far?', sentiment: { pos: 34, neu: 60, neg: 6 }, intent: 'GREETING' },
      { who: 'CX', at: 8, text: 'It has been great, actually. The serum absorbs really fast.', sentiment: { pos: 72, neu: 25, neg: 3 }, intent: 'POSITIVE_FEEDBACK' },
      { who: 'AI', at: 14, text: 'That is wonderful to hear. Could you rate your experience from one to five?' },
      { who: 'CX', at: 21, text: 'I would say a four. The dropper is a bit stiff, that is the only thing.', sentiment: { pos: 58, neu: 28, neg: 14 }, intent: 'RATING + PRODUCT_FRICTION' },
      { who: 'AI', at: 27, text: 'Noted — the dropper felt stiff, I will flag that. A lot of people who like that serum use the overnight mask with it. Want me to tell you a bit more?' },
      { who: 'CX', at: 36, text: 'Sure, go on.', sentiment: { pos: 66, neu: 31, neg: 3 }, intent: 'RECOMMENDATION_INTEREST' },
      { who: 'AI', at: 40, text: 'Since you are on the call, I can arrange twenty percent off it for the next seven days. Shall I send it on WhatsApp?' },
      { who: 'CX', at: 45, text: 'Yes, please.', sentiment: { pos: 74, neu: 24, neg: 2 }, intent: 'OFFER_ACCEPTED' },
      { who: 'AI', at: 48, text: 'Done — it will reach you in a few minutes. Thanks so much, Ananya, your feedback is logged. Take care.' },
    ],
  },
  {
    id: 'upsell',
    tab: 'Upsell call',
    agent: 'Maya',
    role: 'Recommendation Agent',
    initial: 'M',
    channel: 'Outbound voice',
    lang: 'Hinglish',
    callId: 'CX-9014',
    duration: 44,
    score: '5 / 5',
    summary:
      'Third repeat buyer, unmistakably positive. One complementary product suggested off the SKU mapping, customer asked for the price, discount offered and accepted on email. No second product mentioned, no pressure applied.',
    meta: [
      { k: 'outcome_code', v: 'RECOMMENDATION_ACCEPTED' },
      { k: 'rating', v: '5' },
      { k: 'sentiment', v: 'positive' },
      { k: 'recommendation_offered', v: 'Hair Mask · MSK-014' },
      { k: 'discount_channel', v: 'email' },
      { k: 'discount_sku', v: 'MSK-014' },
    ],
    outcomes: [
      'Repeat intent confirmed',
      'One SKU recommended, accepted',
      'Code emailed · valid 7 days',
      'Cart pre-filled on the storefront',
    ],
    turns: [
      { who: 'AI', at: 0, text: 'Hi Rohit, Maya here. Aapka teesra order tha is mahine — bas yeh poochna tha, shampoo kaisa chal raha hai?', sentiment: { pos: 40, neu: 56, neg: 4 }, intent: 'GREETING' },
      { who: 'CX', at: 7, text: 'Bahut accha hai. Ghar pe sab use kar rahe hain ab.', sentiment: { pos: 79, neu: 19, neg: 2 }, intent: 'STRONG_POSITIVE' },
      { who: 'AI', at: 13, text: 'Sun kar accha laga. Ek se paanch mein rate karein toh?' },
      { who: 'CX', at: 18, text: 'Paanch. Koi complaint nahi.', sentiment: { pos: 88, neu: 11, neg: 1 }, intent: 'RATING_5' },
      { who: 'AI', at: 22, text: 'Jo log yeh shampoo lete hain, kaafi log hafte mein ek baar hair mask bhi use karte hain. Batau uske baare mein?' },
      { who: 'CX', at: 30, text: 'Haan batao. Price kya hai uska?', sentiment: { pos: 71, neu: 27, neg: 2 }, intent: 'PRICE_ENQUIRY' },
      { who: 'AI', at: 35, text: 'Chaar sau ninety nine rupaye. Aap call pe hain toh bees percent off kara deta hoon, saat din ke liye. Email pe bhejun?' },
      { who: 'CX', at: 41, text: 'Haan, email theek hai.', sentiment: { pos: 76, neu: 22, neg: 2 }, intent: 'OFFER_ACCEPTED' },
      { who: 'AI', at: 44, text: 'Bhej diya samajhiye. Thank you Rohit, aapka feedback note kar liya hai.' },
    ],
  },
  {
    id: 'support',
    tab: 'Support call',
    agent: 'Maya',
    role: 'Support Agent',
    initial: 'M',
    channel: 'Inbound voice',
    lang: 'English',
    callId: 'CX-9188',
    duration: 52,
    score: 'escalated',
    summary:
      'Customer reported a skin reaction two turns in. The feedback flow stopped immediately. No diagnosis offered, no alternative product suggested, no refund or replacement promised. Routed to Medical Escalation with a same-day callback window captured.',
    meta: [
      { k: 'outcome_code', v: 'SKIN_REACTION_ESCALATED' },
      { k: 'sentiment', v: 'negative' },
      { k: 'issue_type', v: 'skin_reaction' },
      { k: 'escalation_queue', v: 'Medical Escalation' },
      { k: 'callback_requested', v: 'true · today after 6pm' },
      { k: 'discount_offered', v: 'false' },
    ],
    outcomes: [
      'Feedback flow halted mid-call',
      'Priority: high · human callback',
      'Zero offers made on this call',
      'Batch flagged for Quality review',
    ],
    turns: [
      { who: 'AI', at: 0, text: 'Thanks for calling. This is Maya — how can I help you today?', sentiment: { pos: 30, neu: 64, neg: 6 }, intent: 'INBOUND_OPEN' },
      { who: 'CX', at: 6, text: 'I used the face wash you sent and my skin has been itching for two days.', sentiment: { pos: 4, neu: 26, neg: 70 }, intent: 'SKIN_REACTION' },
      { who: 'AI', at: 14, text: 'I am really sorry to hear that, and I understand how worrying that is. Please stop using it right away. Have you been able to speak to a doctor?' },
      { who: 'CX', at: 23, text: 'Not yet. Is it an allergy or something?', sentiment: { pos: 5, neu: 33, neg: 62 }, intent: 'MEDICAL_QUESTION' },
      { who: 'AI', at: 29, text: 'That is not something I should guess at, and I would not want to. Our care team will call you back today with the right person on the line. Would that be alright?' },
      { who: 'CX', at: 38, text: 'Yes. After six in the evening works.', sentiment: { pos: 14, neu: 52, neg: 34 }, intent: 'CALLBACK_ACCEPTED' },
      { who: 'AI', at: 44, text: 'Logged — today after six. I have recorded exactly what you described, and the batch number from your order is attached to it.' },
      { who: 'CX', at: 50, text: 'Okay, thank you.', sentiment: { pos: 28, neu: 58, neg: 14 } },
      { who: 'AI', at: 52, text: 'Thank you for telling us. Please do see a doctor in the meantime. Take care.' },
    ],
  },
  {
    id: 'survey',
    tab: 'Survey call',
    agent: 'Arjun',
    role: 'Survey Agent',
    initial: 'A',
    channel: 'Outbound voice',
    lang: 'English',
    callId: 'CX-9302',
    duration: 39,
    score: 'NPS 9',
    summary:
      'Quarterly NPS wave. Score captured with the reason behind it in the customer’s own words, plus one structured driver. No recommendation offered — this journey does not carry one. Promoter routed to the review-request flow.',
    meta: [
      { k: 'outcome_code', v: 'POSITIVE_FEEDBACK' },
      { k: 'nps', v: '9 · promoter' },
      { k: 'sentiment', v: 'positive' },
      { k: 'driver', v: 'delivery_speed' },
      { k: 'recommendation_offered', v: 'not_offered' },
      { k: 'next_action', v: 'review_request' },
    ],
    outcomes: [
      'NPS 9 recorded with a reason',
      'Driver tagged: delivery speed',
      'Promoter to review-request flow',
      'Cohort NPS recalculated live',
    ],
    turns: [
      { who: 'AI', at: 0, text: 'Hi Meera, this is Arjun — two quick questions about your last few orders, about a minute in total. Is that alright?', sentiment: { pos: 32, neu: 62, neg: 6 }, intent: 'CONSENT' },
      { who: 'CX', at: 7, text: 'Sure, go ahead.', sentiment: { pos: 55, neu: 43, neg: 2 } },
      { who: 'AI', at: 11, text: 'On a scale of nought to ten, how likely are you to recommend us to a friend?' },
      { who: 'CX', at: 18, text: 'Nine, I would say.', sentiment: { pos: 74, neu: 24, neg: 2 }, intent: 'NPS_PROMOTER' },
      { who: 'AI', at: 22, text: 'Thank you. What is the main reason for that nine?' },
      { who: 'CX', at: 27, text: 'Delivery is always fast, and nothing has ever arrived damaged.', sentiment: { pos: 80, neu: 18, neg: 2 }, intent: 'DRIVER_DELIVERY' },
      { who: 'AI', at: 34, text: 'That is good to know — I have logged delivery speed as the reason. That is everything, Meera. Thank you for the minute.' },
    ],
  },
  {
    id: 'reorder',
    tab: 'Reorder call',
    agent: 'Maya',
    role: 'Reactivation Agent',
    initial: 'M',
    channel: 'Outbound voice',
    lang: 'English',
    callId: 'CX-9455',
    duration: 41,
    score: 'reactivated',
    summary:
      'Customer lapsed 94 days on a product with a roughly 60-day cycle. One reason asked, one objection heard and answered honestly, reorder link sent on WhatsApp. No discount — she did not need one, and the journey does not spend margin it does not have to.',
    meta: [
      { k: 'outcome_code', v: 'RECOMMENDATION_ACCEPTED' },
      { k: 'days_lapsed', v: '94' },
      { k: 'sentiment', v: 'neutral to positive' },
      { k: 'objection', v: 'forgot_to_reorder' },
      { k: 'discount_offered', v: 'false' },
      { k: 'channel_sent', v: 'whatsapp' },
    ],
    outcomes: [
      'Lapsed customer reactivated',
      'Reorder link sent · no discount',
      'Refill reminder set to 55 days',
      'Margin protected on the win-back',
    ],
    turns: [
      { who: 'AI', at: 0, text: 'Hi Kavya, Maya here. It has been a while since your last hair oil order — I wanted to check whether everything was alright with it.', sentiment: { pos: 30, neu: 64, neg: 6 }, intent: 'REACTIVATION_OPEN' },
      { who: 'CX', at: 9, text: 'Oh, no, it was fine. I just forgot to order again, honestly.', sentiment: { pos: 52, neu: 44, neg: 4 }, intent: 'LAPSE_REASON_FORGOT' },
      { who: 'AI', at: 16, text: 'That happens more than you would think. Would it help if I sent you a link to reorder the same one?' },
      { who: 'CX', at: 23, text: 'Is there any offer on it right now?', sentiment: { pos: 48, neu: 48, neg: 4 }, intent: 'PRICE_PROBE' },
      { who: 'AI', at: 27, text: 'Not on that one today — I would rather tell you straight than invent one. The price is the same as last time.' },
      { who: 'CX', at: 34, text: 'Fair enough. Send the link, I will do it tonight.', sentiment: { pos: 66, neu: 31, neg: 3 }, intent: 'REORDER_INTENT' },
      { who: 'AI', at: 39, text: 'Sending it on WhatsApp now. I will also set a quiet reminder for around eight weeks so it does not slip again. Thanks, Kavya.' },
    ],
  },
]
