# Business Manager — the server piece

*Plan, October 2026. Nothing here is built yet.*

## Why a server

Today everything lives on one phone. That keeps it simple and private, but it means:

- **Two phones = two separate businesses.** The owner's phone and a helper's phone don't share anything. (On iPhone, even Safari and the Home Screen app keep separate copies.)
- **Nothing comes back by itself.** A signed estimate comes back as a text the owner has to tap. Payments have to be marked by hand. Emailed receipts have to be copied and pasted.
- **If the phone is lost, the data is lost**, unless the owner remembered to back up.
- **AI means a trip out to Claude and back** with copy and paste.

A small server fixes all of these. The app stays the same app: same screens, works with no signal, saves on the phone first. The server sits behind it.

## The answer to "what if the app is on two or more devices?"

**With the server: yes, everything goes to one database per business.**

- Each business gets one account. The owner signs in on any phone, tablet or computer and sees the same customers, jobs, invoices and money.
- Helpers get their own sign-in with less access (see *People and permissions*).
- Each phone keeps a working copy, so it still works in a basement with no signal. Changes sync as soon as there's a connection.
- If two people change the same thing at once, the newest change to each field wins. A history of changes is kept, so nothing is silently lost.

**Without the server (today): no.** Each device has its own separate data. Moving data between them means *More → Back up* on one and *Restore* on the other, which replaces everything.

## What the server unlocks

| Today | With the server |
|---|---|
| Data on one phone | One database per business, on every device |
| Backup is a file you remember to save | Backed up automatically, all the time |
| Signed estimate returns as a text you tap | Lands in the app the moment the customer signs, with a notification |
| "Pay now" goes to your PayPal/Venmo/Square link, and you mark it paid | Card or bank payment on the invoice; it marks itself paid and the job closes |
| Texts open your own Messages app | Optional: reminders and "on my way" sent automatically from a business number |
| Emailed receipts are copied and pasted | Forward them to your own address, e.g. `receipts+miller@in.bizmgr.app`, and they show up ready to assign |
| Photo receipts read on the phone (good on clean receipts) | AI reads crumpled or faded ones too, right in the app |
| AI help is a copy-and-paste trip to Claude | AI help happens right in the app |
| Helpers can't use it | Helpers clock in, see their schedule, and snap receipts from their own phone |

## How it fits together

```
 Owner's phone ─┐                         ┌─ Stripe (card & bank payments)
 Helper's phone ┼──►  Business Manager  ──┼─ Email in / out (receipts, estimates)
 Office laptop ─┘       server            ├─ Text messages (optional, later)
                         │  │             └─ Claude (AI: receipts, wording, pricing)
 Customer's phone ──────►│  │
 (estimate / invoice     │  └─ Photo storage (receipts, signed copies)
  page: sign, pay)       └──── Database (one per business)
```

### Recommended building blocks

The house apps already plan on a small Cloudflare Worker for the AI door, so the server should live in the same place.

| Piece | Choice | Why |
|---|---|---|
| Server code | **Cloudflare Workers** | Cheap and fast. Nothing to keep running or patch. Same place as the planned AI door. |
| Database | **Cloudflare D1** (SQLite) | Simple, cheap, and plenty for thousands of small businesses. |
| Photos and signed PDFs | **Cloudflare R2** | Cheap file storage with no download fees. |
| Payments | **Stripe Connect** (Express accounts) | Money goes straight to the owner's bank. We never touch card numbers. |
| Email in (receipts) and out | **Postmark** (inbound + outbound) | Reliable. One inbound address per business. |
| Text messages | **Twilio**, *phase 4, optional* | Needs US carrier registration (A2P 10DLC) before any texts go out. |
| AI | **Claude API** through the server | The key stays on the server. A cheaper model reads receipts; a stronger one writes. |
| Sign-in | Email or text code (no passwords) | Easiest for tradespeople. |

Alternative: **Supabase** (Postgres, sign-in, storage, live updates in one product). It's quicker to start with, but it's a second platform to manage alongside the Cloudflare door. I'd only switch if we outgrow D1.

## How syncing works (plain version)

1. Every record (customer, job, invoice, payment, expense, receipt, time entry) gets a permanent ID, a "last changed" time and who changed it.
2. The phone saves to itself first, as it does today, then sends its changes to the server.
3. The server stores them and sends back anything other devices changed since the last sync.
4. Deleted things are marked deleted, not erased, so a deletion reaches every device and can be undone.
5. The first time an owner signs in, everything already on their phone is uploaded. Nothing is lost moving from today's app to the server version.

## People and permissions

| Role | Can do | Can't see |
|---|---|---|
| **Owner** | Everything | — |
| **Office / spouse** | Customers, estimates, invoices, money, reports | Settings for payments and plan |
| **Helper** | Their schedule, job details and notes, clock in/out, snap receipts, send "on my way" | Prices, profit, other people's pay, money screens |

## The customer side

- **Estimate links get short and live:** `bizmgr.app/e/7KQ2M`. The estimate isn't packed into the link any more; the page loads the current version.
- **Signing:** finger signature, typed name and checkbox, as today. The server also records the time, the device and a fingerprint of the exact document they signed. That evidence is what makes an e-signature hold up under the U.S. ESIGN Act. The owner gets a notification, the job moves to *Approved*, and a signed PDF is saved to the customer's record.
- **Paying:** the invoice page gets **Pay $X by card** and **Pay by bank (ACH)** buttons (Stripe). When the payment clears, the invoice marks itself paid, the job closes, and the owner is notified.
- **Deposits:** the estimate can ask for the deposit right after signing, in the same visit.

## Receipts by email

- Each business gets an address like `receipts+miller@in.bizmgr.app`. The owner adds it as a contact named "Business Manager receipts".
- At Home Depot, the owner can have the eReceipt emailed to that address, or forward any receipt email to it.
- The server reads the email (and any PDF attached), pulls out the items, and puts it in a **"Receipts to sort"** list in the app. The owner picks the job for each item, exactly like today.
- We **don't** ask for access to anyone's Gmail. Google requires a yearly security review for that, roughly $1,500–$75,000. Forwarding costs nothing and is safer.

## Build plan

Each phase is usable on its own. Effort is my working time, assuming accounts are set up promptly.

| Phase | What gets built | Effort | You'd need to |
|---|---|---|---|
| **1. Accounts and sync** | Sign-in, one database per business, sync across devices, automatic backup, moving existing data up | 1–2 weeks | Create a Cloudflare account and buy a domain (e.g. bizmgr.app) |
| **2. Live customer pages** | Short links, signatures land automatically with the evidence trail, signed PDFs, owner notifications | ~1 week | — |
| **3. Getting paid** | Stripe Connect sign-up inside the app, card and bank payments on invoices, auto-marking paid, deposits at signing | 1–2 weeks | Create a Stripe platform account; write simple Terms and a Privacy Policy |
| **4. Receipts in, AI on board** | Forward-your-receipts address, AI receipt reading for photos and emails, AI pricing and wording in the app | ~1 week | Postmark account; Claude API key |
| **5. Helpers** | Roles, helper sign-in, helper view of the app | ~1 week | — |
| **6. Texts (optional)** | Automatic reminders and "on my way" from a business number | ~1 week, plus 1–3 weeks waiting for carrier approval | Twilio account and the carrier registration |
| **Later** | Home Depot Pro Xtra CSV importer, Amazon Business connection, QuickBooks sync, ABC Supply for roofers | — | Amazon Business developer approval takes 1–5 weeks |

## Running costs (rough; check current prices)

For a pilot of 2–10 businesses:

| Item | Monthly |
|---|---|
| Cloudflare Workers paid plan (D1 and R2 within its included use) | about $5 |
| Domain | about $1 (≈$12/year) |
| Postmark (email in and out) | about $15 |
| Claude API (AI) | depends on use; we'll measure it in the pilot |
| Twilio texting, if turned on | a phone number, a one-time carrier registration, and a few cents per message |
| **Total before texting and AI** | **about $20–25 a month** |

Stripe takes its own fee from each card payment, as Square or PayPal would. The business pays it, not us. Stripe Connect may add a small per-account or per-payout fee depending on the setup; confirm on Stripe's pricing page before launch.

## Things to decide

1. **Name and domain.** Is "Business Manager" the product name? It's hard to own as a domain or trademark. Something distinctive would help.
2. **Who pays for what.** A free tier plus a monthly plan? Pass card fees to customers (allowed in most states, limited in a few)?
3. **Data promise.** Plain-words statement: their data is theirs, can be exported any time, and is never sold.
4. **Pilot group.** The two people you're sending it to are a good start. Five or six real businesses would show us what to build first.

## Risks and how we handle them

- **Lost signal on a job site:** the app works offline as it does today; sync catches up later.
- **Two people editing the same job:** newest change per field wins, and the history keeps every version.
- **Server outage:** the app keeps working on the phone; nothing is lost.
- **Money mistakes:** Stripe is the record of truth for payments; the app only reads it.
- **Privacy:** businesses can't see each other's data. Customer pages show only that one document. All traffic is encrypted.
