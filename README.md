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

Light and airy, modelled on **gokwik.co** — white ground, a warm bone alternating
band, light-weight display type, pill buttons, hairline rules and small radii.
The palette stays **Telenow**: `#F97316` orange on `#0A0A0A` ink.

| Token | Value | Role |
| --- | --- | --- |
| `--white` | `#FFFFFF` | page ground |
| `--bone` | `#F5F4EE` | alternating band (`.section-alt`), footer |
| `--paper` | `#FAFAF8` | inset panels inside cards |
| `--ink` | `#0A0A0A` | headings |
| `--body` | `#2F2F2F` | body copy |
| `--mut` | `#5C5C5C` | secondary — 6.5:1 on white |
| `--faint` | `#6E6E6E` | small labels — 4.6:1 on the bone band |
| `--rule` / `--rule-2` | `#E6E4DD` / `#D6D3CA` | hairlines |
| `--orange` | `#F97316` | fills — buttons, dots, bars |
| `--orange-display` | `#EF6C0A` | orange text ≥24px (3.1:1) |
| `--orange-text` | `#C2410C` | orange text <24px (5.9:1) |

Type is **Inter at weight 300** for display (GoKwik's most recognisable trait),
400–600 for UI. **Hind** covers the Devanagari in the Hinglish call script.

### Three oranges, on purpose

`#F97316` measures **3.0:1 on white** and **2.8:1 against white text** — it works
as a *fill* but fails as text in both directions. So:

- **fills** (buttons, the active rail dot, progress bars) use `--orange` with
  **ink** text on top, never white;
- **display text ≥24px** uses `--orange-display`;
- **small text** uses `--orange-text`.

The page passes a full-page contrast sweep with **zero AA failures**.

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

- **Hero rail** — ten lifecycle stages, auto-advancing every 4.2s, pausable, each
  with a transcript preview and the outcome that stage produces.
- **Journey stepper** — the same ten beats opened up: visual card, example
  conversation, business outcome. Arrow keys work.
- **Call simulator** — five call types (feedback, upsell, support, survey,
  reorder) playing at 2.2×, with a scrubbable waveform, live sentiment, detected
  intent, and the post-call analysis fields filling in as the call closes.
- **Demo generator** — builds a personalised workflow diagram client-side.
  Nothing is transmitted; the CTA opens WhatsApp for the user to send.

### Agent templates link into the product

Every card in §5 is a link to `TELENOW_APP` in `Chrome.tsx`, as is the "Browse
all templates" button under the grid. Only the `telenow.ai` domain was known, so
that constant points at the root — **repoint it at the real console** (e.g.
`https://app.telenow.ai/agents`) and all eleven links follow.

### The call clock is a timer, not rAF

`LiveCall` drives playback with `setInterval`, deliberately. It is a transcript
clock, not a 60fps animation, and `requestAnimationFrame` is starved in any tab
that isn't painting — which left the player reading "On call" while nothing
advanced. The delta is measured against the wall clock and clamped to 0.5s, so a
backgrounded tab resumes where it paused instead of jumping to the end.

## Depth, not borders

What separates this from a flat template is the shadow scale (`--sh-1` …
`--sh-lift`), tinted warm — `rgba(16,14,10,…)`, never pure black, which reads
grey and cheap against a warm white. Cards rest on `--sh-1`, lift to `--sh-3` on
hover, and the primary button carries an orange-tinted `--sh-brand`. The
alternating band is a soft gradient into the bone rather than one flat fill.

The call simulator's sentiment bar is a **diverging** scale (blue → grey → red),
a polarity ramp rather than a categorical one, with every segment direct-labelled
and the in-fill label taking white or ink by the fill's luminance.

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
