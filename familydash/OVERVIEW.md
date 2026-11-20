# Family Money Dashboard: overview for a second opinion

This file is for a reviewer who has never seen the app. It covers what the app does, who it is for, how it is built, and every rule it follows. It ends with the questions we would most like a fresh opinion on.

- **App:** https://jerrywins1.github.io/daraja-apps/familydash/
- **Source code:** https://github.com/JerryWins1/daraja-apps/tree/main/familydash. It is one file, `index.html`, about 5,000 lines.
- **Change history:** `familydash/SPEC.md`, with one section per version.
- **Version described here:** v7.0, 17 Nov 2026.

---

## 1. What it is

The app is a household budget, built from the statement files the family's banks already give them. It never logs into a bank and never moves money.

Every month it gives a household three answers:

1. **Spend each month (Part 1).** The regular monthly bills and everyday spending.
2. **Set aside each month (Part 2).** For bills that come once or twice a year, such as property tax, yearly insurance or pool opening and closing, it saves yearly cost ÷ 12 every month.
3. **As needed (Part 3).** Help for a family member, gifts, and one-time purchases. These are never budgeted monthly; they are paid from savings or investments. The app says how much has to come out of savings this month.

**The core rule:** the regular budget (Part 1 + Part 2) must stay at or under income. If it doesn't, the app shows the gap and lets the family choose to trim a line or cover it from investments.

## 2. Who it is for

A household, often a retired or near-retired couple, that wants one clear picture of the year. They are not necessarily technical, and they are often on a phone. Their money has some complexity:
- pension and Social Security
- two homes
- several credit cards and PayPal
- investments
- a 529 for grandchildren
- occasional help to a family member

It belongs to a small family of apps sold through the Daraja store. Donations go to Loving InDeed, a 501(c)(3) charity that helps orphans and students in Kenya.

## 3. How a family sets it up (current flow)

The setup is a checklist on the main screen. Each step ticks itself off when it is done, and the family can also tick one off by hand.

1. **How do you work?** Four questions:
   - Phone or computer?
   - Are the statements PDFs, downloads, or paper?
   - Which AI helper do they use: Claude, ChatGPT, Gemini, Copilot, or none?
   - **Who sorts the statements?** Their AI, or themselves in the app.
2. **A privacy promise and a passcode.** Everything stays on this device, ideally one home computer. The passcode scrambles the stored data (AES-GCM), and the app locks itself after 15 minutes idle.
3. **Which year are we working on?** January to December is the default, because taxes and year-end statements use it. The family can choose their own 12 months instead. Anything outside the window is kept but never counted or asked about. The year before is kept only for "this year vs last".
4. **One Family Money folder.** It is laid out as a picture shows:
   - Eight groups: bank accounts, credit cards, payment apps, investments, education funds, loans, insurance, other.
   - Inside each group, one folder per account, named with the bank and the last 4 digits.
   - Inside each account folder, its statements, all together or in a folder per year.

   The app can download this folder structure empty, and there is a sample folder with an invented family.
5. **Sort the statements: two ways.**
   - **A. Let my AI do it** (new in v7.0):
     - The family opens Claude (Cowork, in the Claude desktop app) or the ChatGPT desktop app on the Family Money folder.
     - The app copies ONE instruction for them to paste. It is written from the app's own year window and category list.
     - The AI reads every statement and asks the family, in its own chat, about anything it can't tell, one at a time.
     - It saves `Family Money - sorted.xlsx` into the folder, with the columns Date, Account, Amount, Statement words, What it was, Category.
     - The app reads that file once, makes the accounts, and learns every payee. Each month after, "New month" in the same chat adds only the new lines.
   - **B. I'll do it myself, here:**
     - The app reads the folder on the device: CSV, QFX/OFX, XLSX, and PDF through pdf.js.
     - It then works one account at a time (checking first, then each credit card, then PayPal and Venmo) and **one month at a time**.
     - Each month is a downloaded spreadsheet. Every line has the app's guess, and the yellow "Your category" column has a real drop-down.
     - The family fixes the wrong guesses, leaves blank what they don't know, and gives the sheet back. Each month teaches the app, so payees it already knows sort themselves. In testing, the first month of checking had 13 lines to look at, and later months had 1 or 2.
     - PDFs the app can't read go to the family's AI with their words already in the question. With the Daraja AI connection switched on (still waiting to be deployed), they go straight to Claude, with nothing to paste.
6. **One round of questions.** Everything left blank, plus checks, cash and money sent to people, comes one at a time. Each question shows:
   - the date, the amount, the account and the exact statement words
   - the likeliest answer first
   - a "Search the web for this name" link for merchants
   - a checkbook hint for checks
   - "Ask my spouse", which sends a text
   - "Not sure", which keeps it for later
7. **Where the money went.** A picture with accounts on the left flowing into categories on the right, the band width being the amount. Grey means not sorted yet. Tapping a category shows its lines.
8. **A few household questions.** Income, homes, who answers questions, CPA and advisor. Anything already known is skipped.
9. **The budget.**
   - For each kind of spending, the app asks how often it comes: every month, up and down (budgeted at its average), once or twice a year (Part 2), one-time, or as needed (both Part 3).
   - Then the family moves each line up or down.
   - The budget downloads as a spreadsheet laid out like the one a family built by hand:
     - the month summary at the top, with formulas
     - Part 1 by group, with low and high months
     - Part 2 as yearly ÷ 12, with due months
     - Part 3 as a running log for each person helped
     - a "Reclassified" tab of every answer

## 4. Every month, and every year

- **Monthly.** Add the month's statements to the folder. Then either "New month" with the AI, or the app reads them and asks only about payees it hasn't seen before.
- **Monthly check-up.** Statements, questions, the big-bill savings, balances, then a short written summary to share with a spouse.
- **Flags ("Worth a look").**
  - interest
  - fees
  - a card not paid in full
  - a missing autopay
  - a charge that came twice
  - a new subscription
  - money sent overseas
- **Year end.**
  - The app offers a year-end spreadsheet: a summary, a "For the CPA" sheet (529 costs, business spending, giving) and every line.
  - It then rolls into the next year, carrying over categories, payee rules and Part 2 balances.
  - "This year vs last" compares each category with the same months a year earlier.

## 5. Other screens

- **Money map / What's missing.** Every account by group, with a square per month: green if in, red if missing. It also says exactly what to download.
- **Subscriptions.** Every repeating charge, each marked keep, cancel or decide later. After a cancel, it checks that the charge stopped.
- **Checks.** Every check number in order. Gaps are marked voided, not cashed yet, or not sure.
- **What's still open.** A list where nothing is guessed:
  - unsorted lines
  - not-sure lines
  - missing statements
  - open checks
  - fees
  - yearly bills with no amount
  - budget over income
  - CPA flags
- **Lists.** Running totals for each person helped (loan or gift), business or nonprofit spending kept out of family money, and school costs a 529 covered.
- **What's paid from where.** Every bill that comes out of each account, so that if an account is closed or hacked, nothing is missed.
- **Net worth and investments.** What the family owns and owes, a year of investment growth, and a "market weather" note. This is for learning, not advice.
- **Our household.** Due dates from the sister app "Ahead of It", and where things are from "The Key".

## 6. The sorting rules

These came from a real family's two-day session sorting a year of statements with an AI.

1. Gather every source first, and note any missing month.
2. Decide whose each account is: the family's, a business's, or a nonprofit's. An account in another name that is used for family spending counts as family.
3. Set the period: the year window.
4. Count nothing twice. These are not spending:
   - card payments from checking
   - transfers between their own accounts
   - refunds paired with their charge

   Spending counts on the day it's charged.
5. Auto-sort by merchant name, and mark anything unmatched as unknown.
6. Pull out what the statement can't explain into the question round:
   - Venmo, PayPal-to-person and Zelle
   - cash
   - checks
   - charges of $500 or more
   - new payees
7. Look for the answer before asking, and show the guess first ("This looks like…, right?").
8. One question at a time, with tap answers and a count of how many are left. Never ask about the same payee twice.
9. Log every answer: date, amount, statement words, what it was, category.
10. Give each category a timing:
    - **Monthly:** about the same amount each month.
    - **Variable:** budgeted at its average, with low and high months shown.
    - **Seasonal or yearly:** yearly cost ÷ 12, into Part 2. If only one side of a pair has been seen, such as a pool closing but no opening, ask about the other side.
    - **One-time:** kept out of the averages.
    - **Voluntary or as-needed help:** logged with a running total, never budgeted monthly.
    - **Covered by another account**, such as a 529: kept out of family spending and flagged for the CPA.
    - **Someone else's money**, such as a business or nonprofit: kept out of family spending and listed for their books.
    - **Fees and penalties:** filed with the bill they belong to, and always flagged so the cause gets fixed.
11. The three-part budget, kept at or under income.
12. Review subscriptions.
13. Reconcile checks by number.
14. Report what's still open. Never fill a gap with a guess.

## 7. Privacy and safety rules

- No bank login, ever, and the app never moves money.
- Everything is kept on the device, in browser storage, and can be scrambled with a passcode. There is no account and no server holding the family's data.
- Only the last 4 digits of an account are kept. A name that looks like a full account number is refused.
- Statements leave the device only when the family says so:
  - to their own AI, by their own action
  - through the Daraja AI connection, after a confirm screen
  - into their AI's desktop app, which works on their own computer through their own account
- Every AI instruction says: never guess a number; don't move, rename or delete files; don't send anything anywhere.
- Tax, legal and investment questions are flagged for the CPA or advisor, never answered.
- Example and sample data are invented families. The source repository is public, so no real names, balances or account numbers ever go in it.

## 8. How it is built

- **One HTML file**, an installable web app (PWA) with a service worker so it works offline. It runs from GitHub Pages, with no build step and no framework.
- **Storage:** `localStorage` key `dj_familydash_v1`. With a passcode, the data is AES-GCM encrypted with a PBKDF2-derived key (250k iterations).
- **Reading files:** its own CSV/QFX parsers and bank-format heuristics, plus these libraries loaded from a CDN:
  - pdf.js 3.11.174 for PDFs
  - SheetJS 0.18.5 for xlsx and csv
  - ExcelJS 4.4.0 for spreadsheets with real drop-downs and formulas
  - JSZip for zipped folders on iPhone
- **Folder reading:** the File System Access API on computers. On phones, a zip, because a phone browser can't hand over a folder.
- **AI, three ways:**
  1. The family's own AI, by copy and paste. This is the fallback.
  2. The "Daraja AI connection": a small Cloudflare Worker that holds the API key and passes the request to Claude, so the page never sees the key. It is built but not yet switched on.
  3. A desktop AI given the folder: Claude Cowork or the ChatGPT desktop app, with one instruction and one spreadsheet back. This is the new default.
- **The house layer:** a shared script included in every Daraja app. It provides the AI picker, confirm screens before anything is sent, the help menu and the tour.
- **Videos:** narrated walk-throughs whose steps drive the real app screens on the example family. They are recorded with Piper (text to speech) and checked by a script that plays them the way a viewer would.
- **Testing:** Playwright scripts run the whole setup on the invented sample family, end to end, on phone and desktop sizes.

## 9. Known limits and open questions

- **Copy and paste is tiring.** A web page cannot hand files to another website, so the "own AI" path still means pasting an answer back. The two fixes are the Daraja AI connection (not yet deployed) and the desktop-AI folder path (new, not yet tried with a real family).
- **Desktop AI is not for everyone.** It needs the Claude desktop app with a paid plan, or the ChatGPT desktop app, and a computer. Phone-only families fall back to manual.
- **PDF layouts vary widely.** Scanned (picture-only) PDFs have no text to read without AI.
- **Data lives in one browser on one device.** Clearing browser data loses it. There is a "Save a copy" backup file in the ? menu. Is that the right trade-off for privacy?
- **The setup is long.** It has been simplified twice. Is it still too much for a non-technical couple?
- **Categories** are a fixed starter list plus whatever the family adds. Is the list right?

## 10. What we'd like your opinion on

1. Is the two-way choice (let your AI do it / do it yourself) the right shape? Is there a simpler or more automatic way, for both Claude and ChatGPT users?
2. What would make a non-technical family actually keep this up month after month?
3. What does a "family money manager" need that is missing? We have in mind:
   - what-ifs: a new car, an addition to the house, a big purchase
   - total assets: house and car values against what is owed
4. Any privacy or safety risk in the design?
5. Anything in the sorting rules or the three-part budget you would change?
