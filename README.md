# Telenow — landing page

Marketing site for **Telenow**, the AI customer engagement platform that automates
post-purchase conversations across voice, WhatsApp, SMS and email.
React 19 + Vite 6 + TypeScript.

Headline: **Built For D2C. Powered By Voice AI.** — three lines, the last
set in italic orange under a brand rule.

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
UI and body text. **Hind** sits *behind* Inter in the stack rather than beside
it: Inter has no Devanagari, so the browser falls through to Hind for exactly
those glyphs and leaves the Latin alone. That is what lets the Hinglish call
mix scripts inside one sentence without tagging spans.

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
│  ├─ Build.tsx            §2 how businesses use it · §7 architecture
│  ├─ Journey.tsx          §3 ten-step journey
│  ├─ LiveCall.tsx         §4 conversation simulator
│  ├─ Platform.tsx         §5 capabilities · §6 agent types
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

- **How businesses use it** (§2) — a five-step walkthrough that plays itself,
  7s a step, each step swapping a realistic mock of the screen you would be on.
  The only section built on **Framer Motion**; see below.
- **Hero phone** — ten lifecycle stages, auto-advancing every 4.2s, pausable.
  Proportioned like a real handset (1:2.05 against an iPhone's 1:2.17); the
  thread height is the only number that sets that, since everything above it
  is fixed chrome. Messages stack from the bottom the way a chat app does.
  The thread *accumulates* as it advances (2 messages at stage 1, 20 at stage 10)
  with three cards floating at the phone's edges that swap per stage.
- **Journey stepper** — the same ten beats opened up: visual card, example
  conversation, business outcome. Arrow keys work.
- **Call simulator** — five call types (feedback, upsell, support, survey,
  reorder) playing at 2.2×, with a scrubbable waveform, live sentiment, detected
  intent, and the post-call analysis fields filling in as the call closes. Turn
  **Sound on** and it reads the transcript aloud; see below.
- **Demo generator** — builds a personalised workflow diagram client-side.
  Primary use case includes **Other**, which reveals a free-text field and titles
  the generated workflow with whatever they type (falling back to the label if
  they leave it blank). Nothing is transmitted; the CTA opens WhatsApp to send.

### Framer Motion, in one section only

`Launch` (§2) is the page's showcase and the one place that pulls in **Framer
Motion**. Everything else animates with CSS. It is written as **five acts of a
film, not five screenshots** — each act plays its own contents rather than
fading a finished picture in:

| Act | What actually happens |
| --- | --- |
| 01 Import | rows land one by one; `4,180 rows mapped` counts up |
| 02 Agent | the system prompt **types itself** behind a caret, then the four rules snap on in sequence — the one that is off stays off |
| 03 Channels | the cascade line draws downward and each channel comes up as the line reaches it |
| 04 Launch | **the line rings, a customer picks up**, the waveform goes live, and only then do 2,847 dialled, the progress bar and the four stats start moving |
| 05 Monitor | the four result tiles count up to their real figures |

Act 04 is the beat the section is built around: nothing counts until somebody
answers. `answered` is a plain 1.5s timeout, and every number downstream is
gated on it.

Two helpers do most of the work. `Count` runs a number up inside a
`MotionValue` rendered as a motion child, so ticking a counter never
re-renders React. `Typed` animates a character index and slices the string.

The stepper itself uses three more:

- **The active card is one shared element.** `layoutId="lx-mark"` means the
  white card *travels* to the step you picked instead of blinking out of one
  and into another. The steps are different heights — the active one expands —
  so the card has to be measured, not tweened between fixed offsets.
- **The detail opens and closes** on a real `height: auto` animation via
  `AnimatePresence`, which CSS still cannot do without a magic max-height.
- **The acts cross-fade** in a shared grid cell, under a stage that holds its
  height, so the column never resizes between screens. One take, one frame.

Switches are cascaded by adding `.is-on`, not by tweening a colour: the track
and the knob are already one CSS transition, and animating only the track in
JS would slide the knob without it.

Each act holds for as long as its own animation needs — `DWELL`, 6s to 9.6s —
rather than a flat count that would cut the typing off mid-sentence.

It is wrapped in `LazyMotion … features={domMax} strict`. `strict` makes the
build fail on a stray `motion.div` (which would pull in the full component
surface) rather than silently shipping it — every element here is `m.*`.

**It costs 47.4 kB gzip** (88.5 → 136.0 kB of JS). Roughly 29.5 kB of that is
Framer's base and **14 kB is `domMax`**, bought purely for `layoutId`; swapping
`domMax` → `domAnimation` gets that 14 kB back and costs only the travelling
card.

**The walkthrough stops the moment you touch it.** Hover or focus pauses it;
a click hands it over for good (`took`), and the dwell bar under the active
step disappears so nothing moves without having said it would. It is gated on
`useInView`, `usePageVisible` and `useReducedMotion`.

That visibility gate is not decorative. `setInterval` keeps firing in a hidden
tab; `requestAnimationFrame` — which drives Framer — does not. Left ungated,
a backgrounded tab advances the act every few seconds while no enter or exit
animation can complete, and the panels pile up in the DOM. I watched five
stack up before adding the gate.

### The demo voice

The call simulator speaks its transcript in **Telenow's own voices**. All 41
lines are pre-rendered by `tts.telenow.ai` (`telenow-voice-indic-v2`) and
served as static MP3s — 1.3 MB for the five calls. **Nothing is synthesised at
runtime**: the page loads finished audio, so a model still in training cannot
produce a surprise on a visitor's screen.

```bash
npm run audio            # generate what is missing
node scripts/tts-generate.mjs --force
node scripts/tts-generate.mjs --only feedback,upsell
```

**The key never reaches the browser.** It lives in `.env.local` (gitignored)
and is read only by `scripts/tts-generate.mjs`, which runs on a machine.
Nothing under `src/` touches it — anything there is bundled and shipped, so a
key in that tree is a key published to every visitor. The page only ever
loads finished audio.

The script writes `src/data/clips.ts`, the manifest `voice.ts` imports, so
regenerating audio keeps the two in step without anyone hand-editing 41 paths.
Any line without a clip falls back to the browser's own voice, and a clip that
404s falls back too — which is what keeps `build:artifact` working, since the
single-file build inlines JS and CSS but cannot carry `public/`.

**The cast, read out of the transcripts themselves** — not every customer is
Ananya, and the Hinglish call is not Maya's:

| Call | Agent | Customer | Voices (agent · customer) |
| --- | --- | --- | --- |
| feedback | Maya | Ananya | `sarah-approachable-and-informative-en` · `lisa-women-en` |
| support | Maya | unnamed | `sarah-approachable-and-informative-en` · `lisa-women-en` |
| reorder | Maya | Kavya | `sarah-approachable-and-informative-en` · `lisa-women-en` |
| survey | Maya | Meera | `sarah-approachable-and-informative-en` · `lisa-women-en` |
| upsell (Hinglish) | **Priya** | **Rohit (m)** | `anu-sweet-warm-sdr-voice` · `sunny-young-expressive-excited-youthful` |

Maya is `sarah-approachable-and-informative-en` and the women customers
`lisa-women-en`, both chosen by the brand. Two exceptions, both deliberate:

- **The Hinglish call keeps a Hindi-trained agent voice.** Its script is
  Roman-script Hinglish — *"aapka teesra order tha is mahine"* — and an
  English voice reads that with English phonics. `anu-sweet-warm-sdr-voice` is
  a Hindi SDR voice, so Maya sounds different on that one call: correct
  pronunciation bought at the cost of a consistent Maya.

  `devi-smooth-polished-commercial-confident-persuasive-attention` was offered
  alongside Anu and is unused. It reads as a commercial voice where this is a
  post-purchase check-in, and there is no second Hindi part for it: the only
  other Hindi speaker on the page is Rohit, who is a man.
- **The Hinglish call has its own agent.** Its script is Devanagari, which an
  English voice reads badly, so it needs a Hindi-trained voice. Rather than
  have Maya sound like two different people across the tabs, that call is
  Priya's — a different agent doing a different job in a different language.
- **The survey has been through three casts**: Arjun on `hussen-men-hi`, then
  Priya on `kunto-engaging-young-female-voice-en` — which did not deliver a
  female read — and now Maya, since it carries her voice. A differently-named
  agent using Maya's exact voice would be the same defect in reverse. Both
  earlier voices are now unused.
Every part is cast by the brand; nothing in `VOICES` is a stand-in.

#### The Hinglish call is written in Devanagari

The upsell call is scripted the way Indians actually write Hinglish — Hindi in
Devanagari, English words in Latin, inside one sentence:

> Hi Rohit, Maya here. आपका तीसरा order था इस महीने — बस यह पूछना था, shampoo
> कैसा चल रहा है?

It was Roman transliteration first (*"Aapka teesra order tha is mahine"*), which
an Indic model reads as if it were English spelling. In native script it reads
as Hindi, and the difference shows in the output: every line of that call now
fits its slot at natural pace, where the transliterated versions had to be
compressed to 1.06–1.10x to fit.

One rule, learned by listening then confirmed by measuring: **an English word
absorbed into Hindi grammar goes in Devanagari too.** `use कर रहे हैं` lost the
"use" in synthesis — the model skipped an isolated Latin token doing Hindi verb
work. `यूज कर रहे हैं` keeps it, and comes back **10% longer** for it. Latin
stays for words still behaving as English (*order*, *shampoo*, *hair mask*,
*email*); Devanagari takes the ones doing Hindi work.

`rate करें` and `note कर लिया है` measured clean at ±1%, so they were left in
Latin — but duration only proves a word is *present*, never that it is well
pronounced. That still needs an ear.

The same text serves the screen and the speech, so what a visitor reads is what
they hear. Any future Hindi call should be written the same way.

#### The model is still training — check the clips

`npm run audio` also writes **`public/audio-review.html`**: every clip beside
the line it is meant to say, with a player. Run `npm run dev` and open
`/audio-review.html`.

That page exists because **nothing in the pipeline can catch a hallucination.**
The service's own word-miss detector compares *durations* — it flags dropped
words, not wrong ones — and the only transcription the API exposes is a side
effect of registering a voice, which would mean creating 41 junk voices in the
production catalog to read them back. So the clips shipped here are
**unverified by ear**. If one is wrong, drop your own recording at
`public/audio/<name>.mp3` or delete it and re-run — the page needs no code
change either way, because it loads whatever is at that path.

The review sheet has to sit in `public/` for the dev server to serve it, so a
small Vite plugin (`dropInternalPages`) removes it from `dist/` and the
artifact. It is a tool, not a page.

#### Render settings, chosen by A/B rather than by taste

The `quality` presets stop at 48 diffusion steps (`standard`). `num_step` goes
to **128**, and since nobody is waiting on an offline render, that is what we
use. Two defaults also needed moving, both found by measuring:

| Setting | Default | Here | Why |
| --- | --- | --- | --- |
| `num_step` | 48 (preset ceiling) | **128** | the API's real ceiling |
| `position_temperature` | **5.0** | **1.0** | it randomises which mask positions get filled — this is how words go missing |
| `guidance_scale` | 2.0 | **3.0** | tighter adherence to the voice reference (the accent) and to the text |

Neither was guesswork. Taking `position_temperature` to **0** is *worse*, not
better: fully deterministic came back **17% shorter** on a Hindi line, meaning
it dropped content. And `guidance_scale` is load-bearing — at 2.5 the same line
lost 10% of its length. At 128 / 3.0 / 1.0 the durations match the 48-step
renders, so the extra fidelity costs no content.

The render settings and each line's slot are both part of a clip's identity in
`.render-state.json`. Leave them out and raising the step count re-renders
nothing, and retiming a turn leaves stale audio behind — both of which happened
before they were added.

#### Sound changes the clock

Silent, the player runs at **2.2×** — a 48-second call in about 22. With sound
on it drops to **real time**, because speech cannot be compressed with it:
each turn cancels the one before, so a transcript racing ahead would cut every
line off mid-sentence. At 1× each clip has exactly the gap `calls.ts` gives it.

The generator enforces that. It renders each line naturally, measures it, and
re-cuts anything that overruns its slot at up to **1.35×** — past which it
stops sounding like someone talking and starts sounding like someone in a
hurry. Four lines needed it; the rest are natural.

Getting that measurement right mattered. We ask for 24 kHz, which is **MPEG-2,
and MPEG-2 carries 576 samples per frame with its own bitrate table**. Read
with the MPEG-1 table, every clip reports half its true length — which is
exactly what happened first time round: the script cheerfully declared all 41
comfortably short while **27 of them were being cut off**.

Two more things the browser makes you handle:

- **Sound is on by default, and still cannot start on its own.** No path into
  `speak()` runs without the play button, and that press is the gesture
  browsers require — nothing here is ever triggered by scrolling.

  Chrome grants sticky activation on any click, so a later programmatic
  `play()` is fine. Safari and iOS want playback to *begin* in the gesture,
  and every clip starts from a timer a second or two after the press — so
  `primeVoice()` plays 0.05s of silence during the click itself, which buys
  the rest of the session. It runs from play, restart and the mute toggle;
  never from an effect.
- **A cancelled clip is not a failed clip.** `stopVoice()` used to clear the
  source with `src = ''`, which is an invalid source and fires an `error`
  event — firing the synthesis fallback for the line just abandoned, so the
  browser voice talked over the new clip. It now detaches with
  `removeAttribute('src')` and both failure paths check the element is still
  current before falling back.

Nothing speaks while `visibilityState` is `hidden`, and everything stops on
pause, restart, call-type switch and unmount.

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
