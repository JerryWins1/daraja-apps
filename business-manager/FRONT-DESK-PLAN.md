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

## Module: Alerts & Broadcasts (outgoing messages)

Front Desk answers people who contact the business. **Alerts** goes the other way: it reaches out to many customers at once, by area, with messages written ahead of time.

### Action codes: plans written before anything goes wrong

The owner sets up **action codes** ahead of time. Each one is a ready plan:

| Code | When | Who gets it | Message (example) | Follow-up |
|---|---|---|---|---|
| `OUT` | Outage or fault in an area | Every customer in the chosen zones | "Service is down in {zone}. Our team is on it. Expected back by {eta}. No need to call; we'll text you when it's fixed." | Front Desk answers "Is my area affected?" with the live status |
| `FIX` | Outage fixed | Everyone who got that `OUT` | "Service is back in {zone}. Thanks for your patience. If you're still down, reply HELP." | Replies of HELP become jobs |
| `MAINT` | Planned maintenance | Chosen zones, 24 hours before | "Planned work in {zone} on {date}, {time}. Service may drop for about {duration}." | Reminder 1 hour before |
| `DELAY` | Running late | Today's booked customers | "Running about {minutes} minutes behind today. Sorry, and thank you." | — |
| `WEATHER` | Storm or flood | Chosen zones | Safety tips and how to reach the business | — |
| `SALE` / `UPGRADE` | Offers, new plans, upgrades | Customers who **opted in** to offers, by zone or plan | "{name}, faster plans are now available in {zone}. Reply YES to upgrade." | YES becomes an upgrade job or estimate in Business Manager |

- **Placeholders** like {zone}, {eta} and {name} fill in automatically. The owner only types what changed (for example, the ETA).
- **Bilingual:** each code can have an English and a Swahili version, and each customer gets their own language.

### Zones and the customer list

- Every customer in Business Manager gets a **zone**: an area name ("Kilimani", "North side"), a route, or a site. Later this can be drawn on a map.
- **Already have a customer list in another system** (billing system, network monitor, spreadsheet)? Import it once by CSV, or keep it synced through a simple connection to the server.

### Three ways to start a broadcast

1. **From the app (the usual way):** tap **Alert** → pick a code → pick zones → check the preview → **Send**.
2. **By text from the field:** a technician texts `OUT KILIMANI 4PM` to the business number. Front Desk replies with the preview, and the technician replies YES to send. Only approved staff numbers can do this.
3. **Automatically:** a network monitor or other system sends the code to the server (a webhook) when a fault is detected. **Automatic sending is off by default.** It sends a "Ready to send. Approve?" alert to the on-call person unless the owner has switched that code to fully automatic.

### Channels

| Channel | Best for | Notes |
|---|---|---|
| **SMS** | Everyone, every phone | Cheapest per message and most reliable |
| **WhatsApp** | Kenya, longer messages, photos | Messages the business starts need Meta-approved templates, and Meta charges per conversation. The action codes become those templates |
| **Email** | Newsletters, planned work, offers, receipts | Free for small lists. Longer messages with pictures and links. Needs an email address (Zuri already has a field for one) and an unsubscribe link in every email |
| **Voice call** | Urgent safety messages, older customers | A recorded or AI-spoken message. Costs the most, and the strictest legal rules apply (see *Legal*). Use only for urgent alerts |

### Safety catches (built in, not optional)

- **Preview before every send:** how many people, which zones, which channels and **the estimated cost**, plus one more confirmation for anything over 100 people.
- **Quiet hours:** offers never go out at night. Urgent alerts (`OUT`, `WEATHER`) can, but only to customers who said yes to urgent alerts.
- **Nobody gets the same alert twice,** and every alert has a "cancel the follow-up" button.
- **Opt-outs are honoured everywhere:** STOP removes someone from offers immediately. Service alerts and offers are kept as separate permissions.
- **Delivery report:** sent, delivered and failed for each zone. Failed SMS can retry on WhatsApp.
- **Spending cap** applies to broadcasts too. A big send that would cross the cap needs the owner's approval.

### Why this is worth a lot

When there's an outage, phones ring off the hook. One `OUT` message to the right zone **heads off most of those calls before they happen.** Front Desk answers the rest with the live status ("Yes, Kilimani is affected. Expected back by 4 pm."). The same tool sells upgrades on quiet days. For any business that serves customers by area, such as internet providers, water, solar, security or delivery, this alone is worth paying for.

## Connecting to Zuri Fiber (first pilot)

Zuri already has its own system (the Zuri staff app on its own Supabase database), with everything Alerts needs:

| Zuri already has | Alerts uses it for |
|---|---|
| `customers` (via `v_customers`): name, phone, second phone, `area`, GPS pin, `status`, `plan`, `paid_until` | Who to message, in which zone, in which language, and who is active |
| `areas` | The zones in the Alert picker |
| `hubs`: office, OLT, splitter cabinets, towers, with GPS | **Fault by equipment:** "Cabinet K3 is down" → message only the homes it serves |
| `tickets` with kind `fault` | Spotting an outage early: several fault tickets in one area in a short time |
| The Zuri manager (`agent_runs`, `nudges`) | Already runs at 6:30am and 3pm. It can **propose** alerts for a person to approve |

**Rule: Zuri stays the record.** Front Desk and Alerts don't copy Zuri's customers into Business Manager. They read them from Zuri when needed, and write tickets back into Zuri. One customer list, one source of truth.

### How the connection works

```
 Zuri staff app ──(tap "Alert customers" on an area or hub)──┐
 Zuri manager (agent) ──(proposes OUT when faults cluster)───┤
                                                             ▼
                                         Daraja server (Cloudflare Worker)
                                           │  reads a limited customer view from Zuri's database
                                           │  sends SMS / WhatsApp via the Kenyan provider
                                           │  logs every alert back to Zuri
                                           ▼
 Customer replies or calls ──► Front Desk ──► answers with live outage status,
                                              or opens a fault ticket in Zuri's `tickets`
```

- **A narrow, read-only view of customers for alerts.** We add a database view in Zuri with only what messaging needs: id, name, phone(s), area, serving hub, status, language and consent. **No national ID, money or notes.** The server reads it with its own restricted key, which is never stored in any app.
- **Two new Zuri tables:** `alerts` (what was sent, to which zones, by whom, when, delivery counts) and `alert_codes` (the action codes and their messages). Zuri staff see the history right in the Zuri app.
- **Customers record which cabinet serves them.** Today the map works out the *nearest* hub by distance, but fibre is wired to a specific cabinet, which isn't always the nearest. Adding a "served by" field to each customer (set at install, defaulting to the nearest hub) makes "Cabinet K3 is down" messages accurate.

### What it looks like for Zuri

1. **Outage:** three fault tickets come in from one area within 20 minutes. The Zuri manager spots it and sends the on-call person: *"Possible outage in Kilimani (3 faults in 20 min). Send OUT to 214 customers? Est. cost KES ___."* One tap approves it. When the techs close the fault, it offers to send `FIX` to the same 214 people.
2. **Planned work:** in the Zuri app, open a cabinet on the map → **Alert customers** → `MAINT` → set the date and time → Send.
3. **Renewals:** two days before `paid_until`, an automatic reminder: *"Your Zuri package ends on {date}. Renew with M-Pesa Paybill {paybill}, account {account_no}."* It goes only to customers who agreed to reminders. This alone could noticeably cut lost renewals; measure it in the pilot.
4. **Upgrades:** `UPGRADE` to customers on a given plan in areas where faster plans are available, only those who opted in to offers. A YES reply opens an upgrade ticket in Zuri.
5. **During an outage, the calls are answered:** a customer WhatsApps "no internet." Front Desk sees the open outage in their area and replies with the status and ETA. No ticket is needed unless their area is fine, in which case it opens a fault ticket for them in Zuri.

### One rule to change on purpose

The Zuri manager currently promises that it **never sends messages to customers**. Alerts changes that. Keep the promise in spirit: **the manager can only propose; a named person approves every send**, except reminder types the partners have switched to automatic in writing. Every send is logged in Zuri.

### Zuri build steps (inside phases F2 and F5)

| Step | What | Where |
|---|---|---|
| **Z1** ✅ built | Alerts view + `alerts` and `alert_codes` tables; "served by" cabinet on customers; consent and language fields | `supabase/28_alerts.sql` in zuri-system (PR #7), not yet run on Supabase |
| **Z2** ✅ built | "Alert customers" from areas, cabinets (map) and the outage card; approval; bulk-SMS CSV export; alert history | Zuri preview app v2.39 (zuri-system PR #7) |
| **Z3** | Server sends through the Kenyan SMS/WhatsApp provider; delivery counts back to Zuri | Daraja server |
| **Z4** | Zuri manager proposes `OUT` / `FIX` from fault clusters; renewal reminders | Zuri manager + server |
| **Z5** | Front Desk answers Zuri customers and opens tickets in Zuri | Daraja server |
| **Z6** 🟡 free part built | **Bulk email.** Free (built): an approved alert offers BCC batches by language for the office email, only to customers who said yes to emails, each ending with "reply STOP" (`supabase/29_alerts_email.sql`, zuri-system PR #17). Add-on (to build): a bulk email provider sends it for you, with unsubscribe links and delivery counts | Zuri app (Alerts) for the free way; Daraja server for the add-on |

**Before Z1:** build and test everything against the **Zuri test and training databases** first (Zuri already has both), and only switch to the live data once the partners sign off.

**Before Z6's add-on:** collect customer emails (most records may have none, so ask at install and on calls). The "yes to emails" choice is built (customer page → 📣 Messages → ✉️ Emails too). Pick a provider after checking current prices (Brevo, Mailchimp and Amazon SES are options to compare; free limits change).

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

### The rule: free first, add-ons when you grow

Every feature works on a **free level** first. Anything that costs money (texts, calls, AI minutes) is an **add-on a partner switches on**, and it stays off until then.
- **Screens show only what's switched on.** A locked add-on appears as one quiet grey card that says what it adds and what it costs. No pop-ups and no nagging.
- **Paid usage is prepaid** (M-Pesa credit in Kenya, a capped plan in the US). When credit runs out, the app **falls back to the free level** instead of stopping.
- **Switching up or down never changes existing data**: the same alerts, customers and history.
- **Built once and shared:** one "Plan & add-ons" settings page that every Daraja app reuses.

**First built in Zuri Alerts** (zuri-system PR #7):
- **Free:** WhatsApp broadcast groups, a contacts file per group, one-by-one texts for small groups, and email batches from the office account (PR #17).
- **Bulk SMS list:** pay as you go.
- **Automatic sending:** prepaid credit, coming with the server.

### Modules: pay only for what you use

Everything is a module that runs on the same server, phone numbers and customer list, so adding one is a switch in Settings, not a new system.

| Module | US | Kenya | What it adds |
|---|---|---|---|
| **Business Manager** (core) | $149/year | Shillings | Customers, jobs, estimates, invoices, schedule, money |
| **Front Desk Text** | $49/mo | Credits | Text and WhatsApp answering, missed-call text-back, booking, after hours |
| **Front Desk Voice** | $149/mo | Credits | AI answers calls, transfers, on-call alerts, departments |
| **Alerts & Broadcasts** | $39/mo + messages at cost plus a margin | Credits | Zones, action codes, outage and maintenance alerts, offers and upgrades, delivery reports |
| **Done-for-you setup** | $299 one-time | Shillings | We set up answers, zones and action codes with them |

**Why modules:** Alerts is mostly the same machinery as Front Desk Text (the same phone number, provider and customer list). The extra build is the zones, the codes and the safety catches. A business that only wants outage alerts can buy Business Manager + Alerts; a plumber who never broadcasts never pays for it.

**Message costs:** broadcasts can be large (2,000 customers × one SMS each), so messages are always billed by use. In the US they're billed at cost plus a margin; in Kenya they come out of credits. The preview always shows the cost before sending.

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
| **F5. Alerts & Broadcasts** | Customer zones, CSV import, action codes with placeholders, send from app / staff text / webhook, previews and cost estimates, opt-in and opt-out, quiet hours, delivery reports, live outage status for Front Desk | 2–3 weeks (reuses F1–F2) | The first codes and messages from a pilot business; written consent wording |
| **Later** | Website chat widget, map-drawn zones, Google review requests after each finished job, call analytics ("busiest hours", "jobs lost") | — | — |

## Legal and trust (have a lawyer confirm before launch)

- **US call recording:** some states require every party's consent, so Front Desk announces recording at the start of every recorded call, everywhere.
- **US texting:** carrier registration (A2P 10DLC) and opt-out handling ("Reply STOP") are required. Marketing texts need consent. Front Desk only sends service messages.
- **Kenya:** the **Data Protection Act 2019** covers customer data and recordings. Registration with the Office of the Data Protection Commissioner may be required, so check this.
- **AI disclosure:** it always says it's an assistant.
- **Broadcasts, US:** offers and upgrades need customers' prior consent, and **pre-recorded or AI-voice calls have the strictest rules** (the TCPA). Keep voice broadcasts to urgent service alerts, to customers who agreed to them. Every text includes how to opt out.
- **Broadcasts, Kenya:** promotional messages need customer consent and an opt-out under the Data Protection Act, and communications regulations may add rules for bulk SMS. Confirm with a Kenyan lawyer.
- **WhatsApp:** business-started messages must use Meta-approved templates and follow Meta's policies, or the number can be blocked.
- **Data promise** (as in SERVER-PLAN): each business's data is theirs, exportable any time, never sold.

## Things to decide

1. **Name.** "Front Desk" is the working name. It's plain and clear, but generic; check for conflicts.
2. **Pilot businesses.** 3 in the US and 3 in Kenya, one of them with two departments or areas.
3. **Kenyan provider.** Test 2–3 for voice quality, per-second billing and support.
4. **Quick Quote price.** The shop says $49 a year; the app's code says $29 (`PRICE` in `index.html`). Business Manager is confirmed at $149 a year. Make the code, the shop and the videos agree.
5. **First Alerts customer: Zuri Fiber (decided).** See *Connecting to Zuri Fiber*. Still to decide with the Zuri partners: which reminders may go automatically, and the consent wording customers see.
6. **"No subscriptions, ever."** The shop's tagline conflicts with Business Manager at $149 a year and with Front Desk. Suggested wording: *"Fair, simple prices. No contracts. Your data stays yours."*
