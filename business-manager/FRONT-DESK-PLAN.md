# Front Desk — the office that answers for you

*Plan, October 2026. Nothing here is built yet. It builds on SERVER-PLAN.md: Front Desk needs the server's phases 1–3 first.*

## The idea in one line

A one-truck business can't afford an office manager. Front Desk is one: it answers the phone, texts and WhatsApp day and night, books jobs into Business Manager, sends urgent calls to whoever is on call, and answers customers' questions. All of it lands in the app the owner already uses.

**Pitch (US):** *"Every missed call is a job going to the next plumber on Google. Front Desk answers every one."*
**Pitch (Kenya):** *"Your customers WhatsApp you at 10 at night. Front Desk replies, books the job and takes the M-Pesa deposit while you sleep."*

## What it does

| Feature | How it works |
|---|---|
| **Answers calls** | An AI voice answers in the business's name, in English or Swahili. It finds out what the caller needs and acts on it. |
| **Answers texts and WhatsApp** | The same assistant, by message. In Kenya this is the main channel. |
| **Missed-call text-back** | If the owner can't pick up, the caller gets a text within seconds: "Sorry we missed you, how can we help?" The conversation carries on by text. |
| **Books the schedule** | Offers real open slots from the Business Manager schedule. The booking appears on the Today screen as a new job with the customer's details. |
| **Transfers calls** | "Let me put you through to Dan." It rings the right person; if nobody answers, it takes a message and promises a callback. |
| **After-hours service calls** | Takes the details and sorts urgent from routine. **Urgent:** rings the on-call worker, and keeps trying the next person until someone accepts. **Routine:** books the first open slot in the morning. |
| **Departments and areas** | "Plumbing or electrical?" "Which area are you in?" Each department or area has its own people, hours, on-call list and answers. One business can run Nairobi and Mombasa, or north side and south side. |
| **Answers questions** | Hours, services, areas served, starting prices, what to do before the technician arrives. **Only** from what the owner has approved. |
| **Learns, with the owner's OK** | After calls, it suggests new answers: "3 people asked if you fix borehole pumps. Add an answer?" One tap to approve, edit or ignore. It never changes what it says on its own. |
| **Takes deposits** | US: a card or bank payment link (Stripe, from SERVER-PLAN phase 3). Kenya: an M-Pesa prompt straight to the customer's phone (Safaricom Daraja API, STK Push). |
| **Daily briefing** | Each morning in the app: "Overnight: 4 calls, 2 booked, 1 urgent sent to Luis, 1 needs you." |
| **Every call becomes a job** | A short summary, the transcript and (where allowed) the recording are attached to the customer and job. No retyping. |

## Rules it never breaks

1. **Emergencies first.** Gas smell, fire, sparks, flooding near electricity, someone hurt: tell the caller to leave and call emergency services (911 in the US; 999 or 112 in Kenya), *then* alert the on-call person. This line is written by us, not the owner, and can't be turned off.
2. **A person is always one step away.** "Talk to a person" or pressing 0 always works. After hours, it takes a message and says when they'll hear back.
3. **Never makes things up.** No prices, arrival times or promises beyond what the owner has set. If it doesn't know: "I'll have Dan call you about that."
4. **Says it's an assistant.** It never pretends to be a person. ("Hi, this is the Miller Plumbing assistant.")
5. **Recording only where it's allowed.** If it records, it says so at the start of the call. See *Legal*.
6. **Spending caps.** Every business has a monthly limit. When it's reached, Front Desk switches to text-back only and tells the owner. Nobody gets a surprise bill, including us.

## How it fits together

```
 Caller / texter / WhatsApp ──► Phone & messaging provider ──► Front Desk (Cloudflare Worker)
                                 (US: Twilio · Kenya: chosen       │
                                  after testing, see below)        ├─ Claude: understands, answers, decides
                                                                   ├─ Business Manager database (D1):
                                                                   │    schedule, customers, jobs, answers
                                                                   ├─ Stripe / M-Pesa: deposits
                                                                   └─ Owner & helpers' phones: transfers,
                                                                        on-call alerts, notifications
```

Front Desk lives on the same Cloudflare server as the rest of Business Manager. Business Manager keeps working offline; Front Desk itself needs the server, because a phone in someone's pocket can't answer calls on its own.

### Building blocks

| Piece | US | Kenya | Notes |
|---|---|---|---|
| Phone numbers, calls, SMS | **Twilio** | **Africa's Talking** or an alternative | Test 2–3 Kenyan providers on call quality, per-second billing and support before choosing. Reviews of Africa's Talking are mixed and current prices weren't public in our search. |
| AI voice on calls | A real-time voice layer from the phone provider, with Claude deciding what to say | Same, with Swahili | **Swahili voice quality must be tested with real Kenyan callers** before launch. If it isn't good enough, Kenya launches as WhatsApp + SMS first. |
| WhatsApp | Optional | **Required**: WhatsApp Business Platform through an approved provider | Meta must approve the business and the message templates. Allow 1–3 weeks. |
| Payments | Stripe (server phase 3) | **M-Pesa** via Safaricom's Daraja API (STK Push) | Requires a Safaricom till or paybill per business. |
| Brain | Claude API | Claude API | A cheaper model for routine messages; a stronger one for calls and tricky questions. |

*Check every provider's current prices and terms before building; this plan uses no prices we haven't confirmed.*

## Pricing: the best value for customers and the best business for us

Business Manager stays **$149 a year**. Front Desk is an add-on, because every call, text and AI answer costs real money every month.

### United States: monthly plans with caps

| Plan | Price | Includes |
|---|---|---|
| **Front Desk Text** | **$49/mo** | Missed-call text-back, AI text answers, booking, after-hours intake, daily briefing |
| **Front Desk Voice** | **$149/mo** | Everything in Text, plus AI answers every call, transfers, on-call alerts, departments and areas |
| **Done-for-you setup** | **$299 one-time** (optional) | We load their services, prices, areas, answers and schedule, and test it with them |

For comparison: AI receptionists for service businesses commonly run **$150–400 a month** in 2026, and none of them come with the jobs, estimates and invoices already built in. Front Desk Voice sits at the bottom of that range and does more.

### Kenya: prepaid credits, topped up with M-Pesa

- Kenyans already top up airtime, so the model is familiar: **buy credits with M-Pesa, and they're used per call minute, message and conversation.**
- Business Manager and Front Desk are priced **in shillings**.
- No bill ever arrives: when credits run low, the owner gets a reminder and a one-tap top-up.
- **Credit prices are set after the pilot**, once we know real per-minute and per-message costs in Kenya. **Rule: credits sell for at least 3× what they cost us**, which still leaves Front Desk far cheaper than a receptionist's salary.

### Bundles

| Bundle | US price | What's in it |
|---|---|---|
| **Business in a Box** | **$499 first year** | Business Manager (1 year) + one-page business website + 3 months of Front Desk Text + done-for-you setup |
| **Kenya Starter** | Shillings, set after pilot | Business Manager + WhatsApp Front Desk + starter credits + setup |

### What the money could look like (illustrative, not a forecast)

| | Customers | Monthly revenue |
|---|---|---|
| Business Manager only | 100 | ~$1,240 ($149/yr ÷ 12) |
| + 40% on Front Desk Text | 40 × $49 | +$1,960 |
| + 15% on Front Desk Voice | 15 × $149 | +$2,235 |
| **Total** | 100 businesses | **~$5,400/month** before costs |

Front Desk roughly **quadruples** what each business is worth to us. The plans and caps are designed to keep usage costs well under half of revenue; measure it in the pilot.

## Build plan

Each phase is usable on its own. It starts after SERVER-PLAN phases 1–3 (accounts and sync, live pages, payments).

| Phase | What gets built | Effort | You'd need to |
|---|---|---|---|
| **F1. Text desk (US)** | Business number, missed-call text-back, AI text answers from approved answers, booking into the schedule, after-hours intake, daily briefing, spending caps | 2–3 weeks + 1–3 weeks carrier approval (A2P 10DLC) | Twilio account; the "Answers" each pilot business approves |
| **F2. Kenya desk** | WhatsApp + SMS answering, Swahili, M-Pesa deposits, prepaid credits with M-Pesa top-up, shilling prices | 2–3 weeks + Meta and Safaricom approvals | Choose a Kenyan provider after testing; WhatsApp Business Platform access; Safaricom Daraja API access |
| **F3. Voice desk** | AI answers calls, transfers, on-call rotation with escalation, recordings and transcripts on the job | 3–4 weeks | Voice testing with real callers in both countries |
| **F4. Departments, areas and learning** | Multiple departments and areas, each with its own people, hours and answers; "suggested answers" for the owner to approve | 2 weeks | — |
| **Later** | Website chat widget, Google review requests after each finished job, call analytics ("busiest hours", "jobs lost") | — | — |

## Legal and trust (have a lawyer confirm before launch)

- **US call recording:** some states require every party's consent, so Front Desk announces recording at the start of every recorded call, everywhere.
- **US texting:** carrier registration (A2P 10DLC) and opt-out handling ("Reply STOP") are required. Marketing texts need consent. Front Desk only sends service messages.
- **Kenya:** the **Data Protection Act 2019** covers customer data and recordings. Registration with the Office of the Data Protection Commissioner may be required, so check this.
- **AI disclosure:** it always says it's an assistant.
- **Data promise** (as in SERVER-PLAN): each business's data is theirs, exportable any time, never sold.

## Things to decide

1. **Name.** "Front Desk" is the working name. It's plain and clear, but generic; check for conflicts.
2. **Pilot businesses.** 3 in the US and 3 in Kenya, one of them with two departments or areas.
3. **Kenyan provider.** Test 2–3 for voice quality, per-second billing and support.
4. **Quick Quote price.** The shop says $49 a year; the app's code says $29 (`PRICE` in `index.html`). Business Manager is confirmed at $149 a year. Make the code, the shop and the videos agree.
5. **"No subscriptions, ever."** The shop's tagline conflicts with Business Manager at $149 a year and with Front Desk. Suggested wording: *"Fair, simple prices. No contracts. Your data stays yours."*
