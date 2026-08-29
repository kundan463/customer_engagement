# Telenow — landing page

Marketing site for **Telenow**, the AI customer engagement platform that automates
post-purchase conversations across voice, WhatsApp, SMS and email.
React 19 + Vite 6 + TypeScript.

Headline: **Built For D2C. Powered By Voice.**

## Run it

```bash
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server on :5173 |
| `npm run build` | Typecheck + production build → `dist/` |
| `npm run build:artifact` | Single self-contained HTML → `dist-artifact/` |
| `npm run preview` | Serve the production build |
| `npm run typecheck` | Types only |

## Design system

The *look* is Telenow's own, taken from **telenow.ai**: a serif display face
over navy ink, `#F26B1D` orange, warm bone and peach tints, floating pill
chrome and a soft navy-tinted shadow scale.

The *structure* is **gokwik.co**'s business-site rhythm — alternating bands,
pill CTAs with a chevron badge, a trust strip, hairline rules, and the four
underscored verbs under the headline.

| Token | Value | Role |
| --- | --- | --- |
| `--white` | `#FFFFFF` | page ground |
| `--cream` / `--bone` | `#FBF8F3` / `#F5F1EA` | the alternating band, top to bottom |
| `--peach` / `--peach-2` / `--peach-3` | `#FDECDD` / `#FBDCC4` / `#FDE3CC` | brand tints and the hero wash |
| `--mist` | `#DFE7F5` | the cool half of the hero wash |
| `--ink` | `#13233F` | headings — Telenow navy |
| `--body` | `#35435C` | body copy — 10:1 on white |
| `--mut` | `#55637C` | secondary — 6.1:1 |
| `--faint` | `#616D85` | small labels — 5.2:1 on white, 4.5:1 on peach |
| `--navy` | `#0E2A55` | primary button fill — white on it is 14.2:1 |
| `--navy-deep` | `#0B1A33` | footer, the closing panel, text on orange |
| `--rule` / `--rule-2` | `#E8E3DA` / `#D8D2C7` | warm hairlines |
| `--orange` | `#F26B1D` | fills — accents, dots, bars |
| `--orange-display` | `#C04F0C` | orange text >=24px (4.8:1) |
| `--orange-text` | `#A8430C` | orange text <24px (6.1:1) |

Display type is **Georgia** — `Georgia, 'Iowan Old Style', 'Times New Roman',
ui-serif, serif`, the exact stack telenow.ai uses, at weight 500 with -0.02em
tracking. It is the single most recognisable Telenow trait and the thing that
separates this page from every other white SaaS template. **Inter** carries all
UI and body text; **Hind** covers the Devanagari in the Hinglish call script.

The rule is *serif for display, sans for chrome*: section headings, the hero,
step titles, the agent name and every stat figure are serif; card titles, labels,
buttons and table text are Inter 600 — the same split telenow.ai draws.

The **wordmark** is Telenow's own: "Tele" reversed out of an `--ink` badge with
"now" flush beside it. It is rebuilt from text rather than the PNG telenow.ai
ships, so it stays crisp at any size, costs no request, and inverts itself on
the navy footer — a white badge with navy text — which a flat bitmap cannot.

### Three oranges, on purpose

`#F26B1D` measures **3.05:1 on white** and **3.05:1 against white text** — it
works as a *fill* but fails as text in both directions. So:

- **fills** (the accent button, the active tab, progress bars) use `--orange`
  with `--on-orange` `#0B1A33` on top, never white — 5.7:1;
- **display text >=24px** uses `--orange-display`;
- **small text** uses `--orange-text`.

The **primary** button is not orange at all: it is `--navy`, because white on
`#0E2A55` is 14.2:1 where white on the orange is 3.05:1. The orange primary
appears only on the inverted closing panel, where navy would vanish — and there
it carries `--on-orange` ink.

Every gradient fill was checked stop by stop; `--orange-hover` `#E0641A` is the
darkest orange in the system that still clears 4.5:1 under `--on-orange`.

A full-page sweep — every text node against its resolved ground, taking the
worst stop of any gradient behind it — returns **zero AA failures**.

## Layout

```
src/
├─ App.tsx                 the 12 sections, in page order
├─ main.tsx                root + ordered stylesheet imports
├─ types.ts                shared content types
├─ hooks.ts                useInView, useReveal, useCountUp, useInterval
├─ data/
│  ├─ journey.ts           10 hero stages + 10 journey steps
│  ├─ calls.ts             5 call scripts, turn-timed for the simulator
│  └─ platform.ts          capabilities, agents, launch, architecture,
│                          outcomes, integrations, security
├─ components/
│  ├─ Icon.tsx             one 24×24 stroke-icon set, referenced by key
│  ├─ Chrome.tsx           nav, mobile sheet, sticky CTA, footer
│  ├─ Hero.tsx             §1 hero + animated journey rail, trust bar
│  ├─ Journey.tsx          §2 ten-step journey
│  ├─ LiveCall.tsx         §3 conversation simulator
│  ├─ Platform.tsx         §4 capabilities · §5 agent types
│  ├─ Build.tsx            §6 launch steps + mocks · §7 architecture
│  ├─ Outcomes.tsx         §9 outcomes · §10 integrations · §11 security
│  ├─ DemoGen.tsx          §13 demo generator
│  └─ FinalCta.tsx         §14 final CTA
└─ styles/                 6 ordered stylesheets, imported by main.tsx
```

`legacy/` holds the previous page this replaced, and `legacy/removed/` the
analytics dashboard and ROI calculator that were cut. Both sit outside
`tsconfig.app.json`'s `include`, so nothing there is compiled or bundled —
`legacy/removed/README.md` says how to put those two sections back.

## The interactive pieces

- **Hero phone** — ten lifecycle stages, auto-advancing every 4.2s, pausable.
  The thread *accumulates* as it advances (2 messages at stage 1, 20 at stage 10)
  with three cards floating at the phone's edges that swap per stage.
- **Journey stepper** — the same ten beats opened up: visual card, example
  conversation, business outcome. Arrow keys work.
- **Call simulator** — five call types (feedback, upsell, support, survey,
  reorder) playing at 2.2×, with a scrubbable waveform, live sentiment, detected
  intent, and the post-call analysis fields filling in as the call closes.
- **Demo generator** — builds a personalised workflow diagram client-side.
  Primary use case includes **Other**, which reveals a free-text field and titles
  the generated workflow with whatever they type (falling back to the label if
  they leave it blank). Nothing is transmitted; the CTA opens WhatsApp to send.

### The call runs on this page, in our own UI

`LiveAgent.tsx` puts the real agent behind a premium modal, opened from the nav,
the sticky mobile bar, the call simulator and the featured agent card (a React
context, so no prop-drilling through four components).

**It does not load `widget.js`.** That script only does two things: build an
iframe URL, and inject a fixed indigo bubble bottom-right. It exposes no JS API —
everything is inside a closure — so there is nothing to drive it with, and using
it would mean shipping a launcher we then had to hide. So `embedUrl()` builds the
same URL itself, exactly as the script does (`?var_<name>=<value>` for every
declared key, blanks included), and we wrap the iframe in our own chrome.

The modal collects the agent's two **required** variables before it will start —
`{customer_first_name}` and `{phone_number}`, submit stays disabled until both
are filled — plus `{order_id}` as optional. `preferred_language` and
`entry_channel` are set by the page. All twelve declared variables are sent every
time, blanks included, exactly as `widget.js` does. The iframe carries
`allow="microphone"`. Keep this form short: it is the thing standing between a
visitor and hearing the agent.

What is ours: the trigger, the modal, the form, the framing, the copy. What is
not: the call surface inside the iframe is Telenow's own page on their origin,
so it cannot be restyled from here. Changing how *that* looks means changing the
embed at `telenow.ai`.

### Nothing else redirects to the agent

Section 5 leads with Post-Purchase Assistant (Maya). It does **not** redirect —
the call simulator in §3 *is* that agent (`calls.ts`, first entry, role
`Post-Purchase Assistant`), so the card jumps to `#conversation` rather than
sending visitors away. Its card surfaces the agent's own `apiVariables`:
`{customer_first_name}` and `{phone_number}` are marked **required** — a campaign
cannot dial without them — with `{product_names}` / `{order_id}` optional.

`MAYA_AGENT` (`https://telenow.ai/p/5d6a425fcd5f`) is still defined in
`Chrome.tsx` but deliberately unlinked, so re-enabling the redirect is one line.

The ten cards below are templates, and each links to the **real published
template** on `telenow.ai/templates/<slug>` — the page the visitor actually
wants, not the site root. The slug lives on the agent in `data/platform.ts`:

| Card | Template |
| --- | --- |
| Feedback Agent | `post-call-csat-survey` |
| Retention Agent | `subscription-cancel-retain` |
| Survey Agent | `nps-followup` |
| Support Agent | `product-faq-assistant` |
| Reactivation Agent | `gym-membership-winback` |
| Appointment Agent | `appointment-reminder-confirm` |
| Inbound Reception Agent | `front-desk-receptionist` |
| Lead Qualification Agent | `outbound-lead-qualifier` |

**Recommendation Agent** and **Offer Agent** carry no slug: nothing in the
published library does cross-sell or discount delivery as its job, and sending
someone to a template about something else is worse than sending them to the
index. `templateUrl(undefined)` returns the library index, so adding a slug
later is a one-line change and needs no component edit.

The rule for adding one: link only where the template does the *same job*.
Vertical flavour is fine — a receptionist is a receptionist — a different job
is not.

### The phone is a device, not a rectangle

Bezel with a machined gradient edge, a notch over the screen, side buttons, and a
separate `.hv-screen` that clips the content (the frame can't, or the buttons
would be cut off). The thread carries real WhatsApp objects: a **voice note**
(play control, 26-bar waveform, duration — with the transcript in `sr-only` so
nothing is lost) and the coupon as a **reward card**, both driven by an optional
`kind` on `Line`. Timestamps run one minute per message from 10:24.

### The call clock is a timer, not rAF

`LiveCall` drives playback with `setInterval`, deliberately. It is a transcript
clock, not a 60fps animation, and `requestAnimationFrame` is starved in any tab
that isn't painting — which left the player reading "On call" while nothing
advanced. The delta is measured against the wall clock and clamped to 0.5s, so a
backgrounded tab resumes where it paused instead of jumping to the end.

## Depth, not borders

What separates this from a flat template is the shadow scale (`--sh-1` ...
`--sh-lift`), tinted with the ink navy — `rgba(19, 35, 63, ...)`, never pure
black, which reads grey and cheap against a warm white. Every shadow is a pair:
a 1px contact edge plus one wide, lifted pool. Cards rest on that pair, lift to
`--sh-3` on hover, carry a 1px inner highlight along their top edge, and fade
one shade warmer at the foot.

Nothing on the page is a flat fill. The hero ground is two temperatures at once
— a peach bloom falling from the top centre, a cool `--mist` one drifting in
from the right — resolved by a hairline horizon at the bottom so it reads as
design rather than a smudge. The alternating band is a cream ceiling falling
into the bone with a peach bloom off one shoulder. The nav is a floating pill
card, not a full-bleed bar.

The page is light for its whole length and then lands on two dark blocks: the
closing panel and the footer, both `--navy-deep` under an orange and a blue
radial, each with a brand hairline across the top edge. A long light document
needs somewhere to land.

The call simulator's sentiment bar is a **diverging** scale (blue -> grey ->
red), a polarity ramp rather than a categorical one, with every segment
direct-labelled and the in-fill label taking white or ink by the fill's
luminance.

## Content

The worked example throughout is one post-purchase conversation: Ananya, a
serum, a stiff dropper, a rating of four, one earned recommendation, a 20% code
on that one SKU, and ₹1,420 nine days later. It is drawn from the real
`mamaearth-post-purchase-assistant-maya.flow.json` agent — the guardrails
(one question per turn, rating gate before any recommendation, discount only
after interest, complaints stop the flow) are that agent's actual rules, and the
outcome codes are its real ones. **No customer brand is named**; the page targets
D2C generally.

| Figure | Source |
| --- | --- |
| 3.4× response rate | early pilot vs matched survey cohort |
| 40,000+ conversations | production volume |
| 95% autonomous / 5% escalated in 30s | product spec |
| ₹200 coupon, ₹1,420 cross-sell | per-conversation economics |

Contact is **Shubham Kumar · +91 91100 35665 · shubham@telenow.ai**, in
`Chrome.tsx` (`WA_LINK`, `MAIL`, `PHONE`). CTAs are "Book demo" / "Talk to an
expert" — never a lead form that posts somewhere.
# telenow_-customer_engagement
