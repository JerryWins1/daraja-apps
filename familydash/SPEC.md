# Family Money Dashboard: app instructions

Jerry's own build instructions, dated 14 November 2026. They were written from the method he used to build his own family budget by hand. **This file is the brief for the app.** Change the app to match it, and change it here first if the brief moves.

The repo is public. The example answers in Jerry's original (his household's names, homes and people) have been taken out on purpose. Never put them back. Example families in the app are invented.

## 1. What the app does

The app turns a household's bank and card statements into a monthly picture with three answers:

1. What we must spend this month.
2. What we must set aside this month for bills that come once or twice a year.
3. How much has to come from savings or investments this month.

It also learns what unclear payments are. It asks the user about them one at a time and remembers each answer.

How the app talks to people, everywhere:
- One question per screen.
- Tap answers first: 3 to 4 options, with the recommended one first. Then a box to type something else.
- Show progress, for example "Item 3 of 14".
- A **Done for now** button that saves the user's place.
- Plain words and big tap targets. It must work on a phone.

## 2. Setup (first run)

Ask these one at a time. Each answer is saved as a setting and can be changed later in Settings.

**A. Household**
- Who is in the household, and who can see the dashboard?
- Do you have more than one home? Name each one. Each home becomes its own group.
- Monthly income: each source and its amount.
- When does the budget start, and from what date should past spending be pulled?

**B. Accounts.** Add each checking, savings and card account. For each one, ask:
- Is it family money, or someone else's (a business or a nonprofit)? Someone else's accounts are left out completely.
- Is it in another name but used for family spending? Then it counts as family spending.
- For cards: is the full balance paid, the minimum, or is it paid by hand? The default is autopay of the full statement balance. Warn about anything that costs interest or fees.
- Is it closed? Keep its history.

**C. How the budget is built**
- Use the three-part budget? (Recommended.)
- Bills that come once or twice a year: the name, the yearly amount, and the months they're due. Suggest common ones: property tax, estimated income tax, yearly home or car insurance, landscaping or snow removal, club dues, boat or RV storage, card annual fees, and travel.
- Will you move the set-aside money into a separate savings account each month? (Recommended.)
- Which lines go up and down from month to month? Those use an average.
- Must the regular budget stay at or under income? The default is yes. If it doesn't, show the gap, and offer to trim a line or cover the gap from investments.

**D. Special categories**
- Help for a person that isn't a monthly bill. Each person gets an as-needed log with a running total, marked as a loan or a gift.
- Costs paid now and covered later by another account (for example a 529). These count as education paid by the 529, not family spending, and carry a tax flag.
- Business or nonprofit costs paid on a personal card. These are taken out of family spending and kept on a list for the other books.
- People whose subscriptions and costs are tracked separately, each on their own list.
- Which payments get flagged. The defaults are interest, fees, cash advances, overdrafts, a missing autopay, a subscription not seen before, and money sent overseas.

**E. Getting to Know You**
- The amount at which every charge is questioned. The default is $500.
- Whether the app may look in email for receipts. It only reads, never sends.
- Who answers the questions. The default is the main user. Optionally, the spouse.

**F. Advisors.** The CPA and the financial advisor. The app points out tax and investment questions and leaves the decisions to them.

Setup ends with a one-screen summary with an Edit button on each answer. Then Getting to Know You runs on the past statements.

## 3. The three-part budget

| Part | What goes in it | Monthly amount |
| --- | --- | --- |
| 1. Spend each month | Monthly bills and spending | The budget, or the average for lines that go up and down |
| 2. Save each month for later bills | Bills that come once or twice a year | Yearly cost ÷ 12 |
| 3. As needed | Help for people, and irregular payments from savings | Entered in the month it happens; never budgeted ahead |

The summary at the top of every month:
- Part 1
- Part 2
- Regular budget (Part 1 + Part 2)
- Income
- Left over = Income − Regular budget
- Take from savings = max(0, Part 3 − Left over)

Part 1 is grouped in this order:
1. A group for each home
2. Shared fixed costs
3. Everyday spending
4. Variable lines, each with its low and high months

## 4. Spreading big bills over the year

- Set aside yearly ÷ 12 every month.
- When a bill is paid, it comes out of its own balance, not out of that month's spending.
- Track a balance for each bill, and warn early if it won't cover the bill by its due date.
- Bookings that are already made raise the line.
- If an amount isn't known, show **unknown** and say what will fill it in. Never use a placeholder number.

## 5. Getting to Know You

**What goes in the queue:**
- Every Venmo, Zelle or PayPal payment, every cash withdrawal and every check
- Every charge at or above the threshold
- Every payee not seen before

**Each question shows:**
- The date, the amount, the account, and the exact words on the statement
- Anything found first, leading with it ("This looks like … — right?")

**The tap answers:**
- The learned category
- One-time purchase
- As-needed help for a person
- Business or nonprofit
- Something else (type it)
- Not sure (skip for now)

**After each answer:**
- Save it to the line and to the Reclassified record (date, amount, statement words, what it was, category).
- Learn the pattern: the same payee, or a similar amount through the same channel. Suggest it next time, but let the user confirm.
- A correction updates both the record and the pattern.
- Never ask about something already answered.
- "Not sure" items go on a short list for later.

One-time purchases are kept out of the monthly averages.

## 6. The monthly routine

1. Pull in the month's statements. Card payments and accounts that aren't the family's are left out.
2. Sort what's already known automatically.
3. Run Getting to Know You on the rest.
4. Take one-time items out of the monthly numbers, and log as-needed payments.
5. Pay Part 2 bills from their savings, and show each balance against its next due date.
6. Show the summary.
7. Raise the flags.
8. Compare budget with actual for each line on a 3-month average, and show the 3 biggest gaps.
9. Update net worth.

## 7. Rules the app always follows

- Never guess a number. If it isn't known, show "unknown" and say where to find it.
- Show where every number came from: the account, the date and the statement words.
- Check before labelling. If a label turns out wrong, say so plainly and fix it.
- Spending counts when it's charged. Card payments are never spending.
- A blank answer keeps the item in its review list.
- Every number can be changed, and totals update on their own.
- Private by default:
  - No passwords, PINs or full account numbers. An account is named by its last 4 digits.
  - Nothing is sent, shared or paid without the user's yes.
- Taxes, legal questions and investments are pointed out and sent to the CPA or advisor. The app doesn't answer them itself.

## Where v1.0 of the app stands against this brief

- **Built:** every section above.
- **Not yet built: reading email for receipts.** A web app on the phone can't open email without a sign-in service behind it. The setup question explains this honestly and records the answer for later.
- **The spouse answers by text.** "Ask my spouse" sends the question in a text. Their answer is tapped in by the main user. There is no shared account behind the app to carry it back.
- **"Connect" each account** means bringing in the statement files the bank already gives. There is no live bank link, by Jerry's choice of 13 November.

## Added 14 November: what's paid from where

Jerry, after a hack forced the family to close their checking account: *"I don't know all the accounts that are connected to a checking account."*

So the app gathers, for each account, every bill that comes out of it. It reads them from the statements, and the user can add ones the statements can't show (for example, a bill paid through PayPal). If an account is closed or hacked, **This account is closing** turns that list into a checklist of everything to move. It also reminds the user that deposits coming in, such as a pension or Social Security, need the new account too.

## Added 14 November: read the statements first

Jerry asked whether the app could read the statements he already has saved and fill in as much as it can, so that he only checks and edits the result. So before the first setup question, the app asks whether the statements are already saved, and offers to read a whole folder or chosen files. From them it fills in:
- **An account for each group of statements:** checking, savings or card, worked out from the folder name and what's in it.
- **Income:** from the deposits that come back month after month.
- **The once-or-twice-a-year bills** it can see: property tax, estimated tax, yearly insurance, club dues and the like. Each gets its yearly amount and its due months.

Everything it found is shown on one screen, with a tap to fix each item, and the questions follow already filled in. Two rules still hold:
- Only the last 4 digits of an account are ever kept.
- A balance the files don't show stays "unknown" (left out of net worth, with a flag to type it in). It never shows as $0.

**Refined the same day,** after Jerry ran it on his own folder. That folder is organised by topic (Giving, Expenses, Net Worth & Planning), not by account. So:
- Accounts are now told apart by what's inside the files: the bank's name (from the file, its name or the card's payment lines) and the last 4 digits (from a card-number column, the lines above the header, or a file name like Chase1234).
- Folders of old copies (_older Versions, archive, backup) are skipped.
- Very old lines are kept but left out of the budget, which reads from January of last year.
- Only deposits that are clearly income (Social Security, pension, pay, dividends) go straight in. Other regular deposits wait for an "It's income" tap.
- The bank's own category column, where there is one, helps the sorting.
- Paying a card from the bank account counts as moving money, not spending.
- The "what I found" screen now lists the regular monthly bills by kind: utilities, subscriptions, phones, insurance, housing, giving and the rest, each with its account and typical amount.
- A file that isn't a bank account can be left out with one tap.

**And again, from Jerry's second run.**
- **His own spreadsheets** (gifts by year, cashflow, what-ifs, summary-and-budget) were being read as accounts. Now a file counts as a statement only if it looks like a bank's download, meaning it has a payee or description column. Everything else is listed under "Your own spreadsheets, left alone". Numbers, Word and Pages files are left alone too.
- **PDFs that were set aside** are listed, with a note that a missing bank or pension is probably among them.
- **Bank names** are also recognised from the column layouts that Citi, Chase, Discover, Bank of America and Capital One use. Any "… Credit Union" is named, and is never mistaken for a credit card.
- **A card with no bank name** takes its name from the bank account's payment to it: same amount, within 5 days.

**Suggested folder names,** at Jerry's suggestion ("so you can read it and know what it is"): `1 Bank statements`, `2 Credit cards`, `3 Savings`, `4 Investments and retirement`, `5 Loans and mortgage`, `6 Insurance policies`, `7 Taxes`, `8 Other papers`. They're shown, with a copy button, from the first setup screen. A folder whose name says what it holds settles the account type. PDFs in the paper folders are listed by folder in Our household, as names and counts only.

**Frequent flyer miles and points:** a new kind of account. The number of miles or points is typed in by hand, with no airline login, and is shown in the Net worth sheet but not counted in net worth.

**Start the budget from your own spreadsheet** (Jerry's choice, the same day). Any spreadsheet left alone on the "what I found" screen has a **Use as our budget** button, and Settings has **Start the budget from my spreadsheet**. The sheet is read on the device:
- **Section rows** (a name with no amount) become groups.
- **Rows with a name and an amount** become budget lines, from the Monthly or Budget column. If only an Annual column exists, each amount is divided by 12.
- **Income rows** become income, and **total rows** are skipped.
- **Sections named like homes** (Lake Home, Desert House) become the home groups, each with its own lines.

It shows what it read and where each line will go, and changes nothing until "Use this as our budget" is tapped. A Numbers file has to be exported to Excel first.

**Choose which folders to read** (Jerry: his personal folder holds "some things that aren't financial… let me choose"). When the chosen folder has several folders inside, the app first lists them with a tick box each. Ones that look like money (bank, cards, insurance, taxes, expenses, giving, net worth…) come ticked. Only the ticked ones are read, and the choice is remembered for next time.

## Addendum, 15 Nov (v1.9) — two ways in

Jerry: "read everything and then give a list… one group at a time… agree or change. Let's try a couple different ways and see."

- **Way 1, read the whole folder, then check it.** After reading, the app shows one screen per kind — bank and credit union accounts, credit cards, payment apps, the family's own spreadsheets, PDFs — with its guess for each. Each account's name and kind can be changed, or marked "Not a bank account" to leave it out. Nothing is created until the last screen.
- **Way 2, one kind at a time.** The app asks for bank statements, then savings, cards, Venmo or PayPal, and the budget spreadsheet in turn. Whatever is picked at each step is read as that kind, so nothing is guessed.
- Sorting: the longest matching word now wins, and more streaming and phone names are known (Pure Flix and BritBox among them).

## Addendum, 15 Nov (v2.0) — the money map

Jerry: "ask for bank statements then ask for the bank name and … that folder. Then each month that is where the next month statement will be saved… Then go to credit cards, then investment folders then insurance… Allow for self defined folders and their types… open or closed… track things like prescriptions and recurring payments so they can be validated… do an audit of transactions and report on what's missing." Then: both a guided checklist and drag-and-drop.

- **Build our money map** is the first choice on the setup screen. Eight groups, one at a time: banks and credit unions, credit cards, payment apps, investments and retirement, education funds, mortgage and loans, insurance policies, and something of your own (any account type, following every line or just the total).
- Each account gets a bank or company name, an optional nickname and last 4, open or closed this year (with its last month), and, for totals-only accounts, today's total. Its folder is named for it: `Family Money / 1 Bank statements / <bank> <last 4>`. Files picked or dropped for it are read as that account, so nothing is guessed.
- Each account shows one square per month since January (or since it opened, up to when it closed): green is in, red is missing. The map shows how complete the picture is, as a percentage.
- **Read this month's statements** (on a computer) reads the whole Family Money folder and sends each file to the account whose folder it sits in.
- **Is anything missing?** lists missing months with how to download them, payments to banks or cards not in the map, insurance paid with no policy listed, premiums checked against each policy, regular payments that went up (more than $1.99 and 5%) or stopped, and pharmacy spending month by month.
- On a computer, a statement can be dragged onto an account row, or onto an account's own drop box.
- Not built: direct connections to bank websites. The app reads files only; that is a decision for Jerry.

## Addendum, 15 Nov (v2.1) — each new month

Jerry, on his iPhone: "I would like it if I can link a folder… what happens in subsequent months, how do I get that document to you." He chose both.

- On a computer (Chrome or Edge), the money map's first screen offers "Link your Family Money folder once". After that, each month one tap reads the folder and sends each file to its account's folder.
- On any device, when last month's statement is missing for an open account, the home screen says "New month: add October's statements for …". Its Start button walks through those accounts one at a time, each saying which month to download and where from. On a computer with the folder linked, the button reads the folder instead.
- An iPhone or iPad cannot stay linked to a folder; Apple doesn't let websites do that. The file picker opens where it was last used.
- A PDF picked for an account is now named in the result ("not read — download CSV or QFX instead") rather than showing only "0 lines read".

## Addendum, 15 Nov (v2.2) — PDFs, and a folder on the phone

Jerry: "You also need to be able to pick pdf files and read them." Then: "You need to pick folders not files."

- PDF statements are read on the device (pdf.js 3.11.174 from cdnjs, loaded the first time it's needed). A line that starts with a date and ends with an amount is a transaction. Where there's a running balance, the change in balance says which way the money went; otherwise the words do ("deposit", "payment – thank you", CR or a minus on a card). The ending or new balance and the statement's closing date set the account's balance. A scanned PDF (a picture) has no text, so it's named and set aside.
- An iPhone or iPad cannot pick a folder from a website. Instead, in the Files app press and hold the folder and tap Compress, then pick the .zip. The app opens the zip on the device (JSZip 3.10.1) and reads everything in it, PDFs included. On a phone, each account's screen now has "Pick its folder" with that instruction.
- A bill paid by autopay ("COMED ELECTRIC AUTOPAY") goes to the bill's own category, not to "moving between our accounts". A card or bank payment by autopay still counts as a move.

## Addendum, 15 Nov (v2.3) — gather everything first

Jerry: "I think you should gather all the files then read them so you can have information that answers the questions you ask so those parts can be suggested and then approve."

- The setup screen now leads with "Gather all my files first". On a phone, the tip is: in the folder, tap Select, Select All, Open (PDFs and zips are fine). On a computer, you pick the money folder.
- Everything is read first. Then one screen per kind (bank accounts, cards, payment apps, your own spreadsheets, PDFs with nothing readable) shows what was suggested, for approving or changing. Next comes the summary of accounts, income and yearly bills, then the questions, filled in where the statements answer them.
- When setup is done, the money map's check opens. It shows the months still missing and a "Not in your map yet" list (investments, education funds, loans, insurance) for the things statements can't show.
- The "one kind at a time" choice is gone from the first screen; the money map covers one-at-a-time.
- A credit union's name taken from a file name no longer drags the file name along ("XYZ Statement Oct.pdf Example Credit Union" is now "Example Credit Union"), and "Navy Federal" keeps "Federal".

## Addendum, 15 Nov (v2.4) — checking what was read, as cards

Jerry: "something a little more graphical, like columns and options to touch… less typing… predictive… I'm using my phone." He approved a mockup first.

- After everything is read, setup shows a row of columns across the top (Banks, Cards, Venmo, Investments, 529s, Loans, Insurance, Sheets, PDFs). Each column has a count and how far through it you are, and tapping one jumps to it.
- Below the columns is one big card per account with the app's guess: the name, the last 4, the line count, the balance, and a green or red square for each month since January.
- Tap ✓ or swipe right for yes, and ✗ or swipe left for not mine. Those buttons stay pinned at the bottom of a phone screen.
- ✎ Change opens chips: the kind of account (Checking, Savings, Credit card, Venmo / PayPal), Still open or Closed this year, and a name picked from the banks found in the files, with typing only as a fallback. Closed this year marks the account closed as of its last month.
- Investments, 529s, loans and insurance get an "ask" card each, with ＋ Add one or "We don't have any". Spreadsheets get "Use as our budget" or "Leave it".
- On a laptop, a card can also be dragged onto the Banks, Cards or Venmo column.

## Addendum, 15 Nov (v2.5) — what the statements already answer

Jerry: "if you would read the bank statements you would know the answers to the questions… gather all the folders by type then analyze them then fill in the details."

After the accounts are checked, a second deck called "Found in your statements" shows each answer the statements suggest, with the lines that show it. Yes fills in the setup question, and that question is skipped later. No leaves it to be asked; for a yes/no question, No is itself the answer.
- **Two homes:** more than one power or gas company paid month after month. The card asks for a name for each home.
- **Set-aside savings:** a transfer to savings in 3 or more months.
- **Spending that goes up and down:** categories whose months vary by more than about a third. Each is a chip, ticked, showing its low and high.
- **Helping someone:** Zelle, Venmo, Cash App or PayPal sent to the same person, but not every month. Each is marked a gift, a loan, or not help.
- **A 529 paying costs back:** money coming in from a 529.
- **Business on a personal card:** office supplies, Intuit, web hosting and the like.
- **Budget under income:** average income against average spending, with the gap or the room to spare.
- **The amount to question:** set above almost all charges that aren't regular bills.
- **CPA and advisor:** names taken from fees paid to them.
- **The money map:** an investment account where money goes to Fidelity, Vanguard and the like; a mortgage from its payments; insurance policies, with premium and how often, from what is paid.

A bill paid by autopay is sorted again once the categories exist, so it isn't left as a transfer. The first question shown says how many were answered from the statements.

## Addendum, 15 Nov (v3.0) — one folder

Jerry didn't like the previous approach and asked for: "Gather all the files… just the one folder. Maybe give the user a folder structure maybe graphically then get the main folder. Then you will have everything you need. Then structure the question and naming process accordingly."

- **Step 1 of 3:** a picture of the Family Money folder. It has eight group folders (1 Bank accounts, 2 Credit cards, 3 Payment apps, 4 Investments and retirement, 5 Education funds, 6 Loans and mortgage, 7 Insurance, 8 Other papers). Inside each group goes one folder per account, named for it, for example "Capital One 4417". "Download this folder, ready to fill" makes the empty folder as a zip, with a "Read me" in each group.
- **Step 2 of 3:** pick the Family Money folder. On a computer you pick the folder itself. On an iPhone you compress it in Files (two taps, explained in three numbered boxes) and pick the zip.
- **Step 3 of 3:** "Here's what your folder holds". The group folder sets the account's kind and its folder sets the name and last 4, so nothing is guessed. Investment, 529 and loan folders keep only the latest total, taken from the statement's ending balance. Insurance folders become policies, and their premiums are found from payments next. Other papers are listed, not read. Tap any account to change it.
- After "Looks right" come the "Found in your statements" cards, then the summary, then only the questions that are left.
- The earlier ways (gather files and check cards, the money map, just the questions) remain under "Other ways to start".

## Addendum, 15 Nov overnight (v3.1) — full run, sample folder, videos

Jerry, going to bed: "run through… don't stop until you have gone through each app twice with no errors. Think about any improvements… put it on a test list. redo all the videos." The other testing-stage apps were relayed to the Store Manager to route. This chat covered Family Money Dashboard.

- **Sample folder:** `familydash/sample/family-money-sample.zip` holds a made-up family's Family Money folder (Meadowbrook checking and savings, Capital One CSV, Discover PDFs, Venmo, a Fidelity IRA, a 529, a Mr Cooper mortgage, two insurance policies, taxes). The first setup screen has "🧪 No folder yet? Try it with a sample one", so testers and the videos can run the whole setup without anyone's real statements. All of its data is invented.
- **Fixes found in the runs:**
  - An investment, 529 or loan folder whose PDF has only an ending balance now still makes its account and takes the total.
  - Every account folder becomes an account even if its files can't be read.
  - Two homes are now judged by power companies only (a gas company serves the same house).
  - Payment-app history is no longer offered as "help someone".
  - Payment apps aren't flagged for quiet months.
  - The money map's folder names now match the folder picture.
  - The summary shows totals for investments and loans instead of "0 lines".
  - The last setup button says "Looks right — finish" when statements are already in.
- **Test script:** six new steps (s23–s28) walk the sample folder through setup, the findings cards, the check and the money map. The videos and store card steps are now s29–s30.
- **Videos:** all three were rewritten where they described the old setup and re-recorded by name. The train video now walks the folder picture, the download, compressing on an iPhone, "what your folder holds", the findings cards, the remaining questions and the check. Overview line 4 and the first-timer's "How to start" were reworded. The first-timer gained a money map line. `voicemaker --check` reports them current; `checkvideos` reports 3 of 3; every step's pointer was found on phone and laptop. Whether the voice is there and sounds right can only be checked on a real phone.

## Addendum, 16 Nov (v3.2) — setup as a to-do list

Jerry: "make the setup process our checklist, a little to-do list… a little taste of what's next… so they can take it off when they're done." He also asked whether a computer needs the download and the zip. It doesn't: a computer picks the folder itself, and the download is optional everywhere.

- **The list:** setup is a ten-step list on the main screen, called "📝 Getting set up":
  1. Make the folder
  2. Put the statements in
  3. Give the app the folder
  4. Check what it holds
  5. Approve what the statements answer
  6. Check income and bills
  7. Answer the questions left
  8. Fill in what's missing
  9. Getting to know you
  10. Set the monthly amounts
- **How it works:**
  - Each step ticks itself when it's done, and any step can be ticked off or untaken by hand.
  - The next step is marked "up next" and has its own button. Tapping any step goes to it.
  - A progress bar shows how many steps are done.
  - Before setup starts, the welcome screen shows the same list as a preview.
  - Once everything is done, the list says "All set up ✓" and can be hidden.
- **The give-the-folder step follows the device:** a computer says "Give the app the folder — pick the Family Money folder itself, no zip needed". A phone or tablet says "Compress the folder and give it to the app".
- **Test script:** s22 now checks the list and a hand tick.

## Addendum, 16 Nov (v3.3) — every account its own folder, shown

Jerry: "don't you think there could be more bank accounts, more credit cards, more pay apps… have each folder for each one with the name of that credit card." The app already read any number of account folders in a group. The picture showed one example per group, though, so it looked as if only one was allowed. The picture now shows two or three examples per group and a "＋ one more folder for each account" line, and the words say a separate folder for every checking account, card and pay app. The examples use made-up names. The downloaded Read me in each group lists the examples too.

## Addendum, 16 Nov (v3.4) — all together, or by year

Jerry asked for it to be said plainly that statements can sit all together in an account's folder or in year folders. He prefers years. The first setup screen now says so under the folder picture: "keep its statements all together, or in a folder for each year — 2025, 2026 — whichever you like". The downloaded Read me says the same, and warns that folders named old, archive or backup are skipped. Tested with an account's statements split into 2025 and 2026 folders: they're read exactly as if they were loose.

## Addendum, 16 Nov (v3.5) — clearer what to do once the folder is made

Jerry: "you need to be clearer on what you do once you get the folder done." He had read "Download this folder, ready to fill" as the app fetching his folder.

- Step 1 now opens with three numbered boxes: make the folder like the picture, put each account's statements in, then come back and tap My folder is ready. That last box says the app will then ask you to pick the Family Money folder, as a zip on an iPhone.
- The download button is now "Haven't made the folders yet? Download them empty", marked optional, with "skip this if your folder is already made".
- From here on, Jerry asked that videos wait until the changes are done: "Let's make the video at the end."

## Addendum, 16 Nov (v3.6) — Jerry's first real folder

Jerry's first run with his own Family Money folder turned up four problems:
- One bank account showed with 0 lines.
- His other bank account was missing.
- A PayPal folder showed "••2026".
- Nothing on the screen said why.

Fixes:
- **Hidden files are ignored.** The 0-line account was a folder he had emptied, which still held a Mac's hidden .DS_Store. Hidden and system files (.DS_Store, desktop.ini, Thumbs.db) are now ignored, so an emptied folder no longer becomes an account.
- **A year is not a last 4.** A folder name ending in a year (2026) no longer gives that year as the last 4.
- **Each account lists its files.** Under every account, "Here's what your folder holds" now says how many files its folder held, and names any that gave no lines with the likely reason: a PDF that is a scan or an unknown layout, no dates and amounts, or not a statement. A folder with no files says so.
- **Stray files are shown.** Anything outside the eight group folders is listed by folder name, with the fix: move it into the right group and pick the folder again.
- **Nothing is skipped by name in a Family Money folder.** "old", "archive" and "backup" folders are no longer skipped there; the folder is deliberate, and duplicate lines are counted once anyway.
- **Every folder counts.** Several folders are all read; none replaces another.

## Addendum, 16 Nov (v3.7) — reading PDFs with AI, asking first

Jerry's credit union PDFs give no lines on the device: its layout is one the app's reader doesn't know. Asked what customers should get, he chose **"both, asking first"**: the app reads every PDF it can on the device, and for the rest it asks before sending them to an AI.

- In "Here's what your folder holds", an account with unreadable PDFs gets a **✨ Read it/these with AI** button.
- That opens a screen naming the statements, saying they will leave the device to be read, with **Yes, read them** and **Not now**.
- Each PDF is handed to `djAI.ask` with the file attached and the same CSV prompt the older PDF route used. The lines come back into that account, the AI's own sign convention is trusted, and its ending balance is taken. Then it moves on to the next PDF, and finally back to the folder screen.
- Through the Daraja AI door the file goes straight to Claude in one tap. That needs the house layer to pass `file` to the door, and the worker already accepts a PDF. Until then, the family's own AI opens and they attach the PDF there.

## Addendum, 16 Nov (v4.0) — how the family works, asked first

Jerry: "the beginning ought to be a questionnaire about how the user operates, what type of technology they have… If you have to do a little setup first with AI, then let's do that first… if they don't have AI, then tell them… what form they need… more simple and more automatic."

- **"How do you work?"** comes first: three tap questions.
  - Device: phone, computer or both.
  - Statements: PDFs, downloads, paper or not sure. "Not sure" is treated as PDF.
  - AI helper: Claude, ChatGPT, Gemini, Copilot or none.
  - The AI choice is saved as the house layer's `dj_ai_choice`, so the person is never asked which AI again.
- **The setup that fits comes next:**
  - **PDFs or paper with an AI:** "Set up <AI> first". If the Daraja AI connection is on (`control/ai.json` has an endpoint), it says it's ready. Otherwise it says how the AI will be used, a whole account at a time, and offers to open it now.
  - **PDFs or paper with no AI:** two ways forward. A is to download CSV or Quicken files instead, with the steps. B is to set up Claude free.
  - **Downloads:** straight on to the folder.
- **Reading with AI is a whole account at a time.** The folder screen has one "✨ Read them all with AI" button at the top. Each account gets a single ask with all its unreadable PDFs attached (`file` plus `files`), and a single paste brings back that account's lines. In testing, three PDFs in two accounts took two asks.
- **The checklist** gains "Tell us how you work" and, when it applies, "Set up your AI first".
- **Test script:** s21, s23 and s24 now walk the questions.

## Addendum, 16 Nov (v4.1) — a passcode, the promise, and one home computer

Jerry wants families to feel safe about their financial data: a password, and a plain statement up front that nothing is shared and the data stays on the computer, not the phone. He chose **one home computer** as where the data lives.

- **"🔒 Your money stays with you"** comes before anything else in setup. It says:
  - everything is kept on this computer, in this browser; nothing goes to Daraja, and there is no Daraja account or server
  - there is no bank login, and the app never moves money
  - a statement goes to an AI only after a yes for that statement
  - nothing is ever shared, sold or shown
  - with a passcode, everything kept here is scrambled, and the app locks itself after 15 minutes without use
- **The passcode** must be at least 6 characters and typed twice. It is never stored. The data is encrypted with AES-GCM, using a key made from the passcode with PBKDF2 (250,000 rounds of SHA-256), before anything is written to the device. On opening, a lock screen asks for it. A wrong passcode is refused. Forgetting it means starting over; the statements in the folder are simply read again. Settings has Lock it now, Take the passcode off, or Lock it with a passcode. The checklist has "Lock it with a passcode".
- **On a phone,** setup first says "💻 Best kept on your home computer", gives the link to copy for the computer, and explains that the monthly summary can be sent to each phone. "I only have a phone — set up here" is still allowed.
- **Reading with AI:** the confirm screen now says plainly that a website can't hand files to another website. So, until the Daraja AI connection is on, the person attaches the PDFs themselves, and the screen names the folder for each account.
- **Test script:** s21 to s23 updated for the promise screen.

## Addendum, 16 Nov (v4.2) — the folder, drawn

Jerry, showing a Cloudflare diagram: "some kind of graphical connection like this with the files for the different folders… so you can kind of see it visually." He approved a mockup first.

- **"Your folder, connected"** replaces the "what your folder holds" list. On a computer it runs left to right: 📁 Family Money, then its group folders, then each account folder and the account it became, joined by curved lines. On a phone it runs top to bottom, with the lines down the left.
- **Each account box shows its state:**
  - **Green:** every file was read.
  - **Amber:** PDFs still need AI. The box carries its own "✨ Read with AI" chip.
  - **Red:** there's nothing to read.
- **What each box says:** the account's files, its year folders (2025 · 2026), and its lines or total. Tapping a box opens the account. Insurance policies and other papers show as their own boxes.
- **Loose folders** (anything outside the eight groups) sit under Family Money with dashed edges and "move it into one".
- **"Read them all with AI"** stays at the top. **"See the folder map"** opens the map again from the money map, during the same visit.
- **Train video, step five:** its pointer now lands on the map. The video's words will be updated with the other video changes at the end, as Jerry asked.

## Addendum, 16 Nov (v4.3) — say which folder is which

Jerry, looking at his real folder map: he has two bank account folders, and one wasn't recognised. "let me click each one… so I can actually tell you which ones go where." He also said the lines were "a little bit off".

- **Pick folders for a group.** Every group box on the folder map can be tapped, even an empty one ("— none yet — tap to pick its folders"). It opens "Which folders are your bank accounts?" (or cards, and so on), listing every folder the app found under Family Money, indented as on the computer, with file counts. Ticked folders are that group's accounts: each one, and the year folders inside it, becomes one account. Unticked ones are left out. "Use these — read again" reads the folder again with those choices.
- **The family's choices win.** They're saved in `db.fmAssign`, keyed by the folder's path inside Family Money, and they take priority over the folder names. Nothing on the computer is moved. Accounts are now keyed by folder path, so two folders with the same name in different places stay separate.
- **The lines redraw** after the boxes settle (at 30, 300 and 900 ms) and whenever the map changes size.

## Addendum, 16 Nov (v4.4) — the folder is asked for again, not refused

Jerry tapped a group on his folder map after the page had reloaded, and got "Pick the Family Money folder first". The app holds the folder only while the page is open. Now a group tap with no folder in hand says why, offers "Pick the Family Money folder" (re-using the remembered folder on Chrome or Edge), and opens that group's folder list straight after. Re-reading never duplicates lines.

Also in v4.4: accounts made before v4.3 knew only their folder name, so the map showed one of Jerry's as "folder is empty" when it was not. They are now matched by name once and remember their path; no duplicates are made. A folder with no files in it yet does not appear until something is put in it.

## Addendum, 16 Nov (v4.5) — an empty account folder is an account

Jerry made a folder for his new bank account that has no statements yet, and wants it followed from now on. When the Family Money folder is picked on a computer (Chrome or Edge), or as a zip, the app now records folders as well as files. An empty folder inside a group becomes an account straight away, shown as "empty for now — put its statements in". It also appears in that group's folder list as "empty for now". The older folder button used by other browsers still sees only files. A folder he has emptied and no longer wants can be unticked in its group.

## Addendum, 16 Nov (v4.6) — the up-and-down card said plainly

Jerry, on the "These go up and down" card: "I really don't understand what this is… it's hard to tell because I don't know what's in there." He also asked for a way to see what's missing in all his folders.

- **The card is now titled "Spending that changes from month to month".** It explains that each line is a different amount every month, so the app plans for its average and shows the high and low months, and that any line meant to be a set amount should be unticked.
- **Each line is a tick box** showing:
  - the category, "about $X a month", and its highest month by name
  - its lowest month that wasn't zero
  - "mostly:" with the three places the money went and their totals
- **The folder map has "🔎 What's missing in my folders?"**, which opens the check. That check has "Back to the folder map" while setup is still underway.

## v4.7 · 16 Nov 2026 · Go through it together

Jerry's other chat spent two days sorting a year of his statements with him. He brought its written process here. The app now follows that process for every family.

- **"🧭 Go through it together"** is on the main screen and in the setup checklist. It has five parts, asked one question at a time:
  1. **Account by account.** The order is bank, then cards, then payment apps, then insurance, then 529s.
     - Every account: whose money it is.
     - A bank account: whether it is joint and whether it pays the bills.
     - A card: how it gets paid, and whether it is still open.
     - Insurance: whether it is paid monthly or yearly, and whether it builds a cash value for something.
     - A 529: who it is for, and how much goes in each month.
     - Then come the account's own unexplained payments, through Getting to know you.
  2. **How often.** Each kind of spending shows how many months it was seen in, plus its high and low. The answers are:
     - monthly
     - up and down (budgeted at its average)
     - once or twice a year (Part 2, yearly ÷ 12, with the due months taken from the statements)
     - one-time
     - as needed

     One-time and as-needed go to Part 3, are never budgeted monthly, and are kept out of the averages.
  3. **Subscriptions.** A subscription is a named streaming or app charge, or a "loose" category charged at the same amount for 3 or more months.
     - The answers are keep, cancel, decide later, or "not a subscription", plus who uses it.
     - Apple, Google Play and PayPal charges say where to find the real name.
     - A cancelled one that charges again shows on the open list.
  4. **Checks.** Every check number is shown in order.
     - A gap of 20 or fewer gets one question: voided, written but not cashed, or not sure.
     - A cleared check with no answer goes to Getting to know you.
  5. **What's still open.** Nothing on this list is guessed. It shows:
     - what isn't explained yet
     - what's marked not sure
     - missing statements
     - open checks
     - subscriptions not yet decided
     - fees and interest, each tied to its bill
     - yearly bills with no amount
     - the budget being over income
     - the 529 and business totals for the CPA, or for the other organization's books
- A category can now be part 3. Its budget is 0, and it counts as Part 3 spending.

## v4.8 · 17 Nov 2026 · Who are these?

Jerry's PayPal card was listing Hulu, Paramount+, Uber and Walmart as people he helps.

- **Fewer false "people".** A PayPal, Venmo or Zelle payment is no longer offered as help for a person in three cases:
  - it already sorts into a category
  - it is a known streaming service or subscription
  - it is a known shop or ride service (Uber, Walmart, Amazon and so on)
- **New keywords.** "Paramnt" now sorts as a subscription, and Uber and Lyft sort as car.
- **The card is now "Who are these?"** Each line has:
  - A gift, A loan, or Not sure
  - a drop-down "Something else — pick what it was", listing every category and One-time purchase
  - an optional box to type what it was

  Picking from the list files every payment to that payee there, notes it in "What you told me", and remembers the payee for next time.

## v4.9 · 17 Nov 2026 · see the payments, make a new category

Jerry's request: *"loving Adidas as a donation that's not on your drop-down list… some of these I don't remember."* (He meant Loving Indeed.)

- **Every payee is listed.** Before this, the card showed only the first six.
- **The typing box is always there.** It reads "What was it, in your words?" and whatever is typed is kept on each payment.
- **The drop-down ends in "＋ Not on the list — make a new one…".** It asks for a name, such as Donations, and adds that category under "Other spending" on every line.
- **"See the N payments" opens each payment**, with its date, amount, the exact words on the statement, and the account. It also points to where to look it up:
  - PayPal's activity page
  - Venmo
  - for Zelle, the bank's app
  - or searching email by name and date

  Not sure keeps it for later.

## v5.0 · 17 Nov 2026 · Search the web for it

Jerry asked: *"go out to the website that item was for… from the button that's lit up, or give another option."*

- **On the "Who are these?" card, the lit-up name is now a 🔎 button.** It opens a web search for that name in a new tab. "See the payments" has the same link.
- **On Getting to know you,** each payment now has "🔎 Search the web for …" under the statement words.
- **What gets searched.** The search uses the payee name cleaned of "PAYPAL *", phone numbers and reference digits. The app itself reads nothing; it only opens the tab.
- **No search for a person.** Zelle, Venmo and Cash App payments to a person, and checks or cash, get no web search. Searching a private person's name helps nobody.

## v5.1 · 17 Nov 2026 · start date first, no business guessing, sort in a spreadsheet

Jerry, 17 Nov:

> "We don't have a business… what if I think there's transactions back into 2025… 1 out of 4 are wrong, then I don't know how you come back and try to fix it… throw it on a spreadsheet… re-input it and process it until you get it right."

**The start date comes first.**
- Right after the folder map, the app asks "What date should we start counting from?" The choices are this year, last year too, everything, or a date.
- Lines older than that date are kept, but they are not counted, not asked about, and not put on the spreadsheet.
- The findings use only lines from that date on.

**No more "Business costs on a personal card?"**
- The app no longer guesses business spending from merchant names.
- Instead, Go through it together asks for each account whose money it is.

**"📊 Sort in a spreadsheet"** is on the main screen and on the Go through it together screen.
- It writes an .xlsx with two tabs:
  - **Sort these**, with the columns Row, Date, Account, Statement words, Amount, App's guess or yours, Your category, and What it was.
  - **Categories**, listing the names to use.
- "Your category" starts out holding the app's guess. Jerry changes the wrong ones and clears any he isn't sure of.
- When he gives the sheet back, each row is applied on its own:
  - A new name makes a new category under "Other spending".
  - "Help: Name" makes a person.
  - An empty "Your category" goes to not sure.
  - Each payee is learned for next time.
- Then the app offers a fresh sheet of only what's still open, and the rounds repeat until none is left.

## v5.2 · 17 Nov 2026 · the start date is asked on the way in, too

Jerry had finished the folder map before v5.1, so he never came through the new start-date question. Now "Approve what your statements answer" (autoFill) asks for the start date first if it hasn't been answered yet, whichever path leads there.

## v5.3 · 17 Nov 2026 · the year we're working on

Jerry asked for the setup to begin with "the beginning month and beginning year… and ending month and ending year. Anything outside of that window, you disregard." He also said: "consider just doing it for a fiscal year, calendar year."

- **"Which year are we working on?"** comes before the folder, and is also the first step of the checklist. The choices are:
  - this year, January to December (recommended)
  - last year
  - our own 12 months, with a starting and an ending month

  The answer is stored as `db.historyFrom` and `db.historyTo`. `inWin(t)` replaces every old start-date check, so a line outside the window is never counted, asked about, put on the sheet, or used in findings.
- **Missing months** are judged against the window: every month from its start to the last full month, ending no later than the end of the window.
- **"📊 This year vs last"** compares each category with the same months a year earlier. Statements from last year are kept for this, and only for this.
- **When the window ends**, a notice offers "Close the year":
  - "⬇️ Save the year-end summary" saves an .xlsx with three sheets: Summary, For the CPA (529, business, giving), and Every line.
  - "Start the new year" moves the window on 12 months. Each Part 2 balance carries over as its opening amount, along with categories and payee rules. The five-part review starts fresh. The closed year's totals are kept in `db.years`.
- **"📅 Our year"** on the main screen changes the window. The old "pull past spending from" setup question now just shows the window.

## v5.4 · 17 Nov 2026 · one by one, not one big total

Jerry asked: *"I don't know how you know these totals are great if you don't see them one after one… whatever happened to the spreadsheet."*

- **Every findings card that shows example lines** now has "See all N, one by one", listing every line with its date, year, account and amount. It replaces "…and N more".
- **Every findings card** has "📊 I'd rather check every line in a spreadsheet", which goes straight to the spreadsheet round trip.
- **The checklist has a step** "📊 Check every line in a spreadsheet" right after the findings. It is done once a filled-in sheet has been given back.

## v6.0–6.1 · 17 Nov 2026 · the simpler way

Jerry described how the work went with his other chat:

> "when I did this with just doing it on my own with Claude… put in the checking account and the credit cards first and then gave me some drop down options in the spreadsheet and we just kept going through it and only took a couple passes… then there was a round of questions."

On month-by-month sorting he added:

> "month by month the list of things you don't know are smaller… on a bank statement all you're gonna see is the payment to the credit card."

**Setup is now:**
1. how you work
2. passcode
3. AI
4. the year
5. the folder (three steps)
6. **sort each account**
7. **the questions**
8. **where the money went**
9. household questions
10. **the budget**

The findings deck, the separate "Getting to know you" step, the money-map audit step and the five-part "Go through it together" are gone from setup. Their functions are kept, and the main screen still reaches subscriptions, what's still open, and the checks.

**Sort each account** (`sortHub`, `sortMake`, `sortBack`):
- The order is checking first, then savings, then each card, then the payment apps.
- **Each pass is one month.**
- Before each pass, `autoKnown` sorts two kinds of line by itself:
  - lines whose payee was confirmed before
  - payments to a credit card, whose detail is on the card's own statement
- Checks, cash and money sent to people are never sorted automatically.
- The sheet is made with ExcelJS from jsdelivr, falling back to SheetJS. Its columns are Date, Amount, Statement words, What it was, Your category, App's guess, and Row, matching the Reclassified sheet Jerry kept. "Your category" is yellow and has a real drop-down list taken from the Categories tab.
- After each sheet comes back, `reguess()` re-guesses every unconfirmed line in every account using what was learned.

**The questions** (`askRound`):
- Every line left blank on a sheet, plus checks, cash and money sent to people, comes up one at a time.
- Checks show a checkbook hint. "Ask someone" sends the question as a text.

**Where the money went** (`openFlow`) is an SVG flow:
- Accounts are on the left and categories on the right, with band width equal to the amount.
- Each label gets a minimum of 32px of space.
- Grey (not sorted) is always shown, at the bottom.
- Tapping a category opens its lines.

**The budget** (`budStart`):
- It first asks how often each kind of spending comes, then shows the monthly amounts.
- `budgetXlsx` downloads the budget laid out like Jerry’s own family budget spreadsheet:
  - THIS MONTH at the top, with formulas
  - Part 1 by group, with low month, high month and notes
  - a Variable section
  - Part 2 with yearly ÷ 12 formulas and due months
  - a Part 3 log for each person helped, with a running total
  - a Reclassified tab

## v6.2 · 17 Nov 2026 · the videos follow the new flow

- **All three videos are rewritten for the v6 flow and recorded.** Each step opens its own screen through a new `videoSort(step)` helper, using the example family. The steps are: the year, the folder, the folder map, sort each account, the month's sheet, giving it back, the questions, where the money went, how often, and the budget.
  - "Explain it to me": 25 lines, about 3½ minutes.
  - "Train me": 11 steps.
  - "Watch it work": lines 3–5 changed.
- **The "spreadsheet is downloading" screen shows the sheet's first four rows**, with the yellow Your category column. A viewer sees what the spreadsheet looks like without opening Excel, and the video has something real to point at.

## v6.3 · 17 Nov 2026 · PDFs read by AI with nothing to attach

Jerry, about 12 PDFs the app couldn't read: *"it gives them the message, but it doesn't give them the documents… Is there anyway you can do that automatically?"*

A website can't attach a file to another website. So when the Daraja AI connection is off, `fmAIgoText` handles it a different way:

- It reads the words off each PDF on this device with pdf.js (`pdfText`), and puts them in the question, under a heading per file. Nothing needs attaching.
- A PDF with no words in it, which is a scanned picture, is the only kind still attached by hand. The app names those files and the folder to find them in.
- When the Daraja AI connection is on, the PDFs themselves go, as before.

## v6.4 · 17 Nov 2026 · ask once, then automatic

Jerry asked: *"ask a question up front if the user felt comfortable loading or connecting all the financial folders up to their AI… If that's true, it runs more automatic… if every month… they have to physically attach it to Claude… They're not going to do it."*

- **"How do you work?" has a fourth question:** may statements the app can't read go to Claude to be read? The answers are "Yes, every time", "Ask me each time" and "No, never", stored in `db.prof.send`.
- **"Yes, every time"** skips the confirmation screen. Reading also starts by itself the first time the folder map shows PDFs it couldn't read.
- **With the Daraja AI connection on**, every readable PDF's words go in one question per account. Each scanned PDF goes as itself, one per question, because the worker takes one file. The account stays in the loop until all its PDFs are read, and the lines come back with no pasting. The house layer still shows its one confirm screen before anything is sent.
- **"No, never"** hides the AI button and says to download CSV files for those months, with a "this once" link.
- **What's still missing:** the connection's endpoint in `control/ai.json` is still empty. Deploying it is the house layer chat's work, with Jerry.

## v7.0 · 17 Nov 2026 · let your AI do it, or do it yourself

Jerry, 17 Nov:

> "I don't like the copy and pasting back and forth between the app and the AI program… give them the option to connect the family finance folder up to Claude in the beginning and let it build the spreadsheet right from the get-go… give them the option to automate it or do it manually."

**Question 4 of "How do you work?"** is now "Who sorts the statements?", with two answers: "Let my AI do it" and "I'll do it myself, here".

**Let my AI do it** (`aiHandoff`, `aiInstr`, `aiRead`):
- Claude (Cowork, in the Claude desktop app) and the ChatGPT desktop app can both be given a folder on the computer.
- After the year and the folder, the app shows three steps:
  1. open your AI's desktop app on the Family Money folder;
  2. copy and paste ONE instruction;
  3. give the app "Family Money - sorted.xlsx" when the AI saves it.
- The instruction is written from the app's own year window and category list. It tells the AI to:
  - read every statement in the window, listing each transaction once;
  - use only those category names, or a new short one if none fits;
  - treat card payments and own-account transfers as moving money;
  - ask the family about checks, cash, money sent to people, $500+ and unknown payees, one at a time, never twice;
  - save one Transactions sheet with Date, Account, Amount, Statement words, What it was, Category;
  - never guess, move files or send anything.
- `aiRead` makes accounts from the Account column (card, bank or pay app, with the last four digits) and skips lines already in the app. A line with a category counts as answered and teaches its payee. A blank one goes to the question round.
- **Each month:** "📥 New month from Claude" copies a short instruction for the same chat, which adds only the new dates to the same file.
- **The checklist** swaps "give the folder / check it / sort each account" for "Let Claude sort the folder" and "Give the app the finished spreadsheet".

**I'll do it myself** is the v6 path, unchanged.

**Videos:** "Explain it to me" gains a line on the two ways, and "Train me" gains a step. Both were re-recorded by name, and checkvideos passes 3 of 3.

## v7.1 · 17 Nov 2026 · the calm home, a new month with nothing to paste, the plain privacy promise

Jerry had three other AIs (Gemini, Copilot, Grok) read OVERVIEW.md. He chose Grok's build order, steps 1 to 3, plus two of Gemini's ideas.

**1. The calm home** (`pulseHTML`)
- The top of the main screen gives the month's name and one sentence:
  - "October is $2,453 under income."
  - or "…over income"
  - or "…is closed"
- Under it, up to three short lines:
  - a Part 2 bill running short ("Travel is short $247"), or one that's on track
  - statements missing
  - questions for you
  - questions saved for your spouse
  - no backup yet
- One button: answer the questions, answer the spouse's questions, add income, see the gap, read the note, or "Same as usual".
- "Same as usual" closes the month and writes the note. It only shows when nothing is asked and nothing is missing.
- "See the gap" (`openGap`) shows how far over income the month is and the three largest lines with −/＋. Or "cover it from investments this month", which is logged, not advised.
- Before setup is done, the home shows the next single step, not the list. The full list is folded under "See all the steps".
- The example family shows the same sentence.

**2. New month, nothing to paste** (`newMonth`)
- The app reads the linked folder again (the existing ROUTE path).
- Every payee already known files itself (`autoKnown` on every account, Gemini's "silent filing"), and so do card payments.
- Only the new ones come to you as questions. On the sample: 36 lines read, 33 filed themselves, 18 questions.
- Accounts made from an AI's spreadsheet now carry their folder name, so new files find them.

**3. Privacy and backup**
- The privacy screen now says: "If you let an AI read the folder, those PDFs go to that company's servers. We store only the last 4 digits of an account. The PDF still has the full number."
- It also says: if the passcode is forgotten, nobody can open what's kept here, not us, not anyone, and backups use the same passcode.
- "💾 Backup" (`backupOpen`, `backupNow`, `backupRestore`) saves exactly what is stored, which is the scrambled copy when there's a passcode. It can bring a backup back. The home says "No backup saved yet" until one is saved.

**Also**
- "Ask my spouse" no longer texts anything. The question is saved on this device, and the home says "1 question for Lee" with a button to answer it there.
- Anything sent to an AI as text has long numbers masked to their last 4 (account and card numbers, Social Security numbers), using Gemini's PII rule (`maskNums`). Dates and amounts are left alone.
- Videos: one line about the sentence was added to "Explain it to me" and to "Watch it work". Both were re-recorded by name, and checkvideos passes 3 of 3.

## v7.2 · 17 Nov 2026 · the statement squares and the note (Grok's plan, steps 4–6)

- **Step 4 (spouse questions stay on the device)** was already done in v7.1.
- **Statement squares on the home** (`squaresHTML`, `missingOne`):
  - A small grid sits under the month's sentence, with one row per bank or card account and one square per month in the year window up to the last full month. Green means the statement is here; red means it's missing.
  - Tapping a red square says which website, which month, and which folder to put it in, then offers "New month — read my folder".
  - Payment apps are left out, because a quiet month there isn't a missing statement.
  - This is the only nag.
- **The note for both of you** (`openNote`, `noteLines`):
  - It's eight to twelve plain lines:
    - the month against income
    - what was spent against the plan
    - what was set aside
    - as-needed spending and what comes from savings
    - one thing that went well
    - one thing that changed (up 15% or more on a usual month)
    - any yearly-bill savings running short
    - what's coming up (Part 2 bills due, and "Ahead of It" items)
    - anything still open
    - the one decision, if the month is over income
  - "🔊 Read it aloud" uses the computer's own voice, and there's a Print button. It is never sent anywhere.
  - "Same as usual" and "Read the note" open it. The old report's "Send to my spouse" button now opens the note instead.
- **Videos:** two lines were added to "Explain it to me" (the squares and the note). It was re-recorded by name, and checkvideos passes 3 of 3.

## v7.3 · 17 Nov 2026 · which AI, said plainly

Jerry asked: *"what if they don't have Claude? What if they have something else?"*

- **On "How do you work?":** choosing "Let my AI do it" together with Gemini, Copilot or None in question 3 now shows a line right there. It says only Claude or ChatGPT, in their apps on a computer, can read a whole folder, and that both need a paid plan; otherwise "myself" does the same job here.
  - Next won't continue until that's resolved.
  - The old silent switch to Claude is gone.
- **On the "Let ___ sort your folder" page:** the top now has two choices, Claude and ChatGPT, with theirs already picked. Switching rewrites the page's steps for that app.
  - It also says a paid plan is needed, with a "do it yourself here" link.

## v7.4 · 18 Nov 2026 · the Daraja AI connection is live

The house layer chat switched the connection on, in PRs #364 and #396. `control/ai.json` now carries the real endpoint, and Jerry tested it himself.

**Question 4 is now "Who reads the statements?"** There are two answers.
- **"This app — it reads my folder"** is listed first and recommended.
  - The family picks the Family Money folder once.
  - Any PDF the app can't read goes to Claude through the connection, after the house layer's one confirm screen. The lines come back by themselves, with nothing to attach and nothing to paste.
  - "New month" reads the folder again.
- **"My own Claude or ChatGPT app"** is the v7 desktop hand-off. It is for people whose app can open a folder: Cowork wasn't showing in Jerry's Claude app on 17 Nov.

**`fmAIgo` checks the connection fresh** (`doorOn`) the first time it runs in a session.

**The connection's limits, which the Worker enforces:**
- **A question is at most 24,000 characters.** Readable PDFs go in batches of 20,000 characters or less. A single very long statement goes in parts, "Part 1 of 4" and so on, and counts as read only after the last part. A part with no lines in it is fine.
- **A file is at most 5 MB.** A scanned PDF over 5 MB is said so up front and goes to the family's own AI instead.
- **There are 40 questions a day per household.** `db.aiDay` counts them. The "Read with AI?" screen says so when a year of statements needs more than are left. At 40, the app switches to the family's own AI for the rest of the day.

**Account and card numbers are masked** to their last 4 in everything that goes.

**Tested:** three PDFs, one of them very long, needed 6 questions, every one under 20,000 characters. All three were marked read, and 34 questions were left that day.

**Videos:** the "two ways" lines in "Explain it to me" and "Train me" now put the app reading the folder first. Both were re-recorded.

## v7.5 · 18 Nov 2026 · reading PDFs can't get stuck

Jerry's screen sat on "Reading the words off 12 PDFs…" and never moved.

- **One PDF at a time,** with "3 of 12: name.pdf", a progress bar, and a Stop button.
- **Each PDF gets 20 seconds.** One that hangs is skipped, has no words, and so goes to AI as a file, instead of stopping everything.
- **Each PDF's words are read once a session** (`PTXT`), so the next batch for the same account doesn't read them again.

**Tested:** three PDFs, one of them hanging forever. The other two went as text (one in 4 parts), and the hanging one went as a file after 20 seconds. All three were marked read.

## v7.6 · 18 Nov 2026 · safe to spend, a giving goal, subscription help

These three came in a relay from the Store Manager. Jerry chose them after comparing the apps with an outside "app ideas" plan.

**Safe to spend** (`safeToSpend`, `openSafe`)
- When the home card shows this month, it has a new row, "Still safe to spend". It is the Part 1 plan, minus what has already been spent on it, minus the regular bills still to come out.
- Regular bills are payees seen in 3 or more months, in Part 1, not cash. They count when they haven't been charged yet this month and their usual day is still ahead.
- Tapping it lists each of those bills with its usual day.

**Giving goal** (`givingCats`, `givenThisYear`, `givingHTML`, `openGiveGoal`)
- The same card shows "🙏 Giving: $X of $Y" with a bar and a percentage, counted over the year window.
- Giving categories are found by name (giving, donations, church, tithe, charity, mission, offering) or by the give keyword.
- With no goal yet, it shows "Given this year: $X. Set a giving goal". The suggested goal is this year's pace.

**Subscriptions**
- `rvSubsList` flags a price that went up, using the same rule as the audit's 📈 Went up: more than $1.99 and more than 5%. A price rise still counts as the same subscription, so it keeps its monthly cycle.
- "Cancel it" now opens `cancelHelp`, a ready-made cancellation message that gives only the last 4 of the card. It has "📋 Copy the message" and "✨ Have my AI write one". The AI prompt contains no account number.
- In the summary list, a cancelled subscription can be tapped to bring the message back. Nothing is ever sent by the app.

**Video and tester script**
- Two lines were added to "Explain it to me", which was re-recorded; checkvideos passes 3 of 3.
- The tester script gained two steps.

## v7.7 · an account with no lines is not "sorted" (18 Nov)

Jerry: both checking accounts at his bank showed "✓ sorted · 0 lines", though the old checking account holds 2026 statements.
An account with no lines in the year now shows **no lines yet** in red, with the reason:
- lines came in but every one is outside the year (with the months, and a link to change the year);
- PDFs it couldn't read itself (with a button to read them with AI);
- its files gave no lines for the year; or
- the app doesn't have the folder's files this session (read the folder again).

## v7.8 · reading with AI asks once, then just reports (18 Nov)

Jerry: "there was like 3 or 4 questions along the way… can you just do that on your own? Or maybe just give a status line."
- Saying yes to **Read with AI** covers the whole run. Each batch to the Daraja AI connection no longer opens its own "Send it" box.
- Instead, one status box: "Reading <account> with AI · Statements 3 of 12 · 85 lines in so far. Nothing to tap — it carries on by itself."
- On a computer, every sheet sits in the middle of the screen instead of at the bottom edge, where it could fall out of view.
- The confirmations kept are the ones that guard against losing data (erase, remove, restore, start over).

## v7.9 · PDFs go to AI by themselves, and the daily limit is said plainly (18 Nov)

Jerry: "If you know I'm gonna use AI why do you have to ask? Just go do it." Also, the old checking account still showed "12 not read yet" after a run.
- Unless the family said no to sending statements, PDFs the app can't read go to AI as soon as the folder is read. No button, no question.
- When the AI connection's 40-a-day household limit is reached, the app now says so and leaves the rest for tomorrow. It used to fall back without a word to a copy-and-paste AI.
- Any other connection error shows "The AI didn't answer" with **Try again**.
- Batches are now about 10,000 characters, not 20,000. The connection answers in at most 2,000 tokens, so a bigger batch could come back cut short.

## v8.0 · picture statements go as PDFs, and no pop-up when a read finds nothing (18 Nov)

Jerry's run stopped at "I could not find any lines in that answer". His bank’s PDFs have the header in words and the transactions as a picture. Because they had some words, eleven nearly empty texts went in one batch, and the AI found nothing in them.
- A statement only counts as text if its words hold at least three amounts. Otherwise the PDF itself goes, one per ask.
- If a text batch gives no lines, those statements are sent again as PDFs. A PDF that still gives nothing, or is over 5 MB, is set aside with a short notice. No pop-up stops the run.

## v8.1 · the AI connection's daily limit is 200 (18 Nov)

Jerry raised the door's cap from 40 to 200 a day per household (PR #423). The app kept its own count, hardcoded to 40 in four places. That count is now one number, `DOOR_CAP`, set to 200.

## v8.2 · the bottom buttons stay on top (18 Nov)

Jerry: the folder map's boxes slid over the "Looks right — next" bar as he scrolled. The sticky bottom bar on every sheet now sits above the content scrolling behind it.

## v8.3 · sort right here, one payee at a time (18 Nov)

Jerry: "is there a way… AI reads them, and then… would you like to categorize your transactions? And then you go one by one in the app." He chose: build it, and keep the spreadsheet as an option.
- **👆 Sort it here** on each account (`sortIn`). Lines are grouped by payee, so one answer sorts every line from it. The app's guess is already picked; you can pick another category or name a new one. "Not sure — ask me later" sends the payee to the questions round. Checks, cash and money sent to people come one line at a time, each with a note box.
- Answers are learned exactly as a returned spreadsheet's are (`sortSet`: rules, reclass, asked). Payees already known, and card payments, sort themselves first (`autoKnown`).
- The spreadsheet stays as a link under each account's button.
- The three videos and the tester script describe sorting in the app. All three videos were re-recorded by name.

## v8.4 · the category list puts the ones picked most first (19 Nov)

Jerry: a new category like Donations ends up "all over the place" in the list. The in-app picker now starts with **＋ A new category…**, then up to eight **Picked most** categories (counted from the lines you have sorted), then **All, A to Z**. The spreadsheet's drop-down is A to Z too.

## v8.5 · "Are these yours?" before the first sort (19 Nov)

Jerry: "in the setup, actually go through that list and see which ones are valid and not, and add them before you start."
- Before the first **Sort it here**, the app shows every category by group (`catReview`). Tap one to strike it out. Add missing ones with a name and a group. **These are ours — start sorting** removes the struck ones (their lines go back to unsorted and are guessed again) and then starts.
- It shows once (`db.catsChecked`). Settings › Categories still does the rest.
- Tester script s27 covers it. The videos skip it, since their example family has already checked.

## v8.6 · Jerry's seven ideas, folded into the sorting screen (19 Nov)

Jerry: "if there's things that we're already doing that are similar, don't add one to it. Enhance the one that's there." So nothing gets a new screen except the look-into list, which "Not sure" now feeds.
1. **A letter jumps through the list.** On a computer the category picker has focus. A letter selects the next category A to Z that starts with it (D, then D again), and Enter saves.
2. **🔍 Look into later** replaces "Not sure — ask me later" and does the same thing. The set-aside lines are now also a list: **🔍 To look into (N)** on Sort each account and at the end of each account. It is grouped by payee and sorted from there. Anything still on it comes up in the questions at the end.
3. **✂️ Split it across categories** on a single charge. Each part gets a category and an amount, and the last part takes what's left. The charge becomes one line per part, noted "part 1 of 2 of $120". `db.splitKeys` stops a re-read statement from bringing the whole charge back.
4. **✎ Rename it** beside the picker renames the chosen category. Every line in it keeps it.
5. **➕ Added together** on the home screen, shown only when the same category name is in more than one group (two homes' Utilities). Each group card already had its own subtotal.
6. **Several charges inside one payee.** When one payee has different amounts, the screen says "These look like N different charges" and offers **Sort each one**. A price rise stays with its charge. A repeating charge asks **What is it?** (e.g. Hulu), and the name follows that payee and amount into later months (`db.subRules`). Subscriptions then lists it on its own.
7. **PayPal and Venmo payments are money moving** once that account's own lines are in for the month, the same way a card payment is. PayPal lines are grouped by payee now; only checks and cash still come one line at a time.
Videos (firsttime, train) and tester script s27 are updated. Both videos were re-recorded by name.

## v8.7 · the backup can also be a spreadsheet or a printout (19 Nov)

Jerry: "Can you output to a spreadsheet so it's there and we can print it?", kept under the one Backup button, not as a new one. Under **⬇️ Save a backup now** there are two smaller buttons:
- **📊 Spreadsheet** saves three sheets: Every line, Categories (with the year's totals) and Accounts.
- **🖨️ Print it** prints the accounts, the categories and every line.
A line says they aren't scrambled, and that only the backup file brings the app back.

## v8.8 · Ours and Practice, and a full check of every screen (19 Nov)

Jerry: "one that's live and my personal one, and it's separate from all the ones that we use while we test", plus a check of every screen and of security while he was away.
- **Two households on one device.** **Ours** is the real one and keeps the same storage as before, so nothing moves. **Practice** has its own storage. Switch from Settings (first row), or from the purple **🧪 Practice — not your real money** band shown at the top in Practice. In Practice you can wipe it and start again, or start it as a copy of Ours (a locked copy opens with the same passcode). Backups and spreadsheets made in Practice say PRACTICE in the file name.
- **Wording that wasn't true any more:** the welcome, the add-statements screen and the privacy promise said nothing goes to Daraja. A PDF the app can't read does pass through Daraja's AI connection to Claude, and isn't kept. All three now say so.
- **The statement squares on the home screen:** the house layer grows any small button to 44px, so the red "missing" squares came out huge. The whole account row is now the tap, and the squares are plain marks.
- **Sort each account:** an account with no statements at all says so in grey instead of red. A closed account with nothing in it is left off the list.
- **"Travel is short ."** now gives the amount ("Travel is $896 short.").
- **The flow chart** shortens long names with "…" instead of cutting them mid-word, and the full name shows on hover.
- **Links** in sheets use the app's colour.
- Checked: harmful text planted in a statement line, a note, a charge name and a category name was opened on 31 screens at phone and computer size, and none of it ran. No screen scrolls sideways.
- Removed the real bank name, the last 4 digits and the family name from these notes and code comments. They had been written into earlier entries.

## v8.9 · Ask about our money, and Heads up before it's due (20 Nov)

Two ideas from Jerry's AI-helper page (Family Money "idea 1, updated" and "idea 2"), relayed by the Store Manager. The page's other ideas wait.

**💬 Ask about our money**: a box on the main screen, under the month's sentence.
- `askKind` sorts the question into a big purchase, are we on track, where did it go, what if, or other. Each kind has its own list of things the AI asks about first, one at a time, at most five questions.
- **With the Daraja AI connection** the talk happens in the app. The AI replies `ASK:`/`OPTIONS:` (shown as tappable answers plus a text box) or `ANSWER:`/`NEXT:`. The first send shows the exact words, and later turns don't ask again. The door can't search the web, so the screen says so, and **Ask my own AI instead** goes round the door (`o.noDoor`) to their own AI, which can search.
- **With their own AI** they paste once and talk there. It is told to search today's rates and to end with a `FAMILY MONEY ANSWER` block, which they paste back and the app reads. A reply with no block is shown as the answer anyway.
- **What goes:** `moneyTotals()` only: income, the budget, what's left, last month's spending, each budget line's plan and usual amount, the yearly bills with their set-aside and due month, and balances by kind of account. No statements, account numbers, account names or payee names. The box says so on screen.
- Every answer says "A helper, not a financial advisor". For a purchase or what-if, or anything over $1,000, it adds "talk it over with" the CPA or advisor named in setup. **Next step** buttons: `PART2` adds a yearly-bill line, and `REMIND` saves a calendar file for the phone.
- Failure: when the AI doesn't answer, the screen says so and offers **Try again**.

**Heads up before it's due**: the app's own check, with no AI.
- `headsUps()` finds a yearly bill due this month or next whose set-aside will be short, an insurance or policy line renewing, and a subscription first seen in the last 45 days (yearly fees left out).
- One card at the top of the main screen, never a pile, with "One more after this" when there is another. **Got it** clears it (`db.huSeen`).
- Buttons: **✨ Make a plan** (the AI suggests how to close the gap, using lines running under plan), a shop-around script for a renewal, **Keep it** or **Help me cancel** for a new subscription (`cancelHelp`), **Pay the rest from savings**, and **⏰ Remind me** (a calendar file a month before it's due, or tomorrow).
- A phone reminder is the calendar file. There is no push notification.

The overview and first-time videos each gained two lines, re-recorded by name in Jerry's ElevenLabs voice. Two untrue lines in the first-time video were fixed too: "nothing is sent anywhere", and tapping a red square. Tester script steps s33b and s33c were added. The store card's tag mentions both features.

## v9.0 · ← Back, and Ask during setup (20 Nov)

Jerry: "If you go one screen too far … you can't go back to the previous one."
- Every screen remembers the one before it. **← Back** at the top, or the browser's own Back button, steps back one screen. On the first screen, browser Back closes it. Passing screens aren't kept: reading, thinking, and the one-payee-at-a-time sort, which has its own Back.
- **💬 Ask about our money** now shows during setup too, once any statement lines are in, with a note that answers get better once the budget is set. Jerry was at step 8 of 13 and couldn't find it.

## v9.1 · Ask lets you type the amount (20 Nov)

Jerry: "it would be good if you allowed them to input something like the value of a car… You say, do you want to do a down payment, but you don't ask how much."
- The AI is told to ask for the number itself ("How much would you put down?"), never a yes-or-no about it, and to follow a "yes" with the amount. Its options for an amount are example figures.
- When the question is about money, the screen shows **Type the amount** first ($, number keypad on a phone, Send), with "Or tap a rough figure:" and the options under it. A bare number like 38000 or 38k is sent as $38,000.
- The Ask screens are one flow, so the general ← Back doesn't step through them.

## v9.2 · ahead of it: notices more, "If I'm away", and money dates shared (20 Nov)

Jerry: "be very intuitive and forward thinking … head off some issues … this would be really good for my wife when I'm not around … we have an app called Ahead of It. Maybe there's some integration here." He chose all three.
1. **The heads-up card notices more** (`noticeMore`), still one card at a time:
   - money that usually comes in that hasn't (a deposit seen 3+ months, past its usual day, with later lines in);
   - checking holding less than a yearly bill due this month or next;
   - a regular bill 1.5× its usual amount and at least $40 more, in the last 45 days (**🔍 Look into it** puts it on the look-into list, or **That's right**);
   - a monthly payment that usually comes out and hasn't.
2. **🧭 If I'm away** on the main screen's tools, one page kept current, with **🖨️ Print it**. It shows the next two months' yearly bills; up to 12 steady monthly bills (about the same amount each time) with the day and the paying account; what's normal each month; every account with its balance; who to call (CPA and advisor); and how to ask the app.
3. **Money dates for Ahead of It.** Ours only, never Practice or the example, writes `localStorage['dj_shared_due_familydash']` = `{ app, em, url, updated, items:[{ what, due:'YYYY-MM-DD', kind:'bill'|'heads-up' }] }`. That is the yearly bills due in the next two months plus up to three heads-ups, with no amounts and no account numbers. Same site, same device, so Ahead of It can read it. Ahead of It's side is for its own chat.
Tester script step s33d added.

## v9.3 · merge categories, and a short note on any line (20 Nov)

Jerry: "we're going to have to merge categories at some point … It would be nice to put a note in for a transaction … not a long one, but a short one."
- **Merging uses rename** (`catRenameTo`). Renaming a category, with **✎ Rename it** on the sort screen or in Settings › Categories, to a name that already exists asks "Merge X into Y?". Yes moves every line, remembered payee and re-sort record into the one kept, and adds the budgets together when both are in the same part. The other category goes away.
- **A one-line note** (60 characters at most) on every sort screen, "Note (optional) — e.g. for the golf trip". It's kept on each line it was saved with, and shows in the spreadsheets and the backup. Checks, cash and Venmo/PayPal/Zelle also say "only you know what it was for".

## v9.4 · a new category keeps you on the line; tick lines to sort on their own (20 Nov)

Jerry: "I added [a category] and I came back and then I couldn't put in the … comment" and "when I go to one that has multiple lines and I see each line, I lost the ability to pick each line and deal with it."
- **＋ A new category…** now shows a name box with **＋ Add**. Enter or the main button does the same. Adding it keeps you on the same line, with the new category chosen and the note box (and anything already typed in it) kept. The next tap saves (`sinNewAdd`).
- **See each line** has a tick box on every line. Tick the different ones and tap **Sort these N lines on their own**: they come up next as their own step, with its own category, note or split. The rest stay together (`sinOwn`).

## v9.5 · the ticked lines first, then back to the rest (20 Nov)

Jerry: "You need to manage one at a time. And you need to stay on that page so they're all done." After **Sort these on their own**, the ticked lines come up straight away. The step after is the rest of the same payee, headed "Back to the other N lines from this payee", with **See each line** already open, so more can be ticked before the rest are sorted together.

## v9.6 · Sort the rest for me, and Show me the dashboard now (20 Nov)

Jerry: "I don't know if I want to go through each credit card one. Maybe you do your best to sort it out … give me a button to the dashboard."
- **✨ Sort the rest for me** on Sort each account (`sortRestForMe`). It runs the known-payee and card-payment sorting, re-guesses, then accepts the app's guess for every line not yet done (marked `autoAcc`). Lines it can't guess stay "Not sorted yet". Any line can be changed later.
- **📊 Show me the dashboard now** on the setup screen, once there are lines (`db.peek`). It opens the main dashboard before setup is finished. The checklist of steps still to do is on it, so nothing is skipped: the household questions, including the CPA and advisor, and the budget are still there to do.

## v9.7 · double charges caught as statements are read (20 Nov)

Jerry: "two exactly the same charges on the same day … catch these things on the import as they're importing … flag them right away … then at some point there's a review."
- `flagSuspicious` runs after each statement file is read. Two charges on the same account, from the same payee, for the same amount, within three days, are flagged, provided at least one is newly read. The later charge goes on the 🔍 To look into list with "Possible double charge — same as Oct 20".
- The screens that end a reading (the folder map and New month) say how many were found (`flagLine`).
- Review: a heads-up card at the top of the main screen, ahead of everything else, until answered. **It's a mistake — keep it on my list** (the reason becomes "Charged twice — call to have it taken off") or **Both are right** (taken off the list).
- The sort screen shows the warning on a flagged line. The existing "Worth a look" double-charge notice stays.

## v9.8 · the Charged twice? list (20 Nov)

Jerry: "add the charge choice thing to a list … it's hard to do that from the middle of an import."
- `openDups` puts every possible double charge on one list. Each shows the payee, amount, both dates and the account, with **It's a mistake** / **Both are right** buttons; once answered, **Change** brings them back. The list redraws in place.
- The heads-up card no longer asks the question. It is one card, "N charges may have gone through twice", with **👯 See the list**.
- The list opens from 📋 Lists and from the Sort each account screen. The banner at the end of a reading points to it.

## v9.9 · a way out of every screen, and what a number is made of (20 Nov)

Jerry: "every screen you get in, you need to be able to get out of … just put an X on top" and "It has healthcare 72,000. I'd like to know what that is."
- Every screen now has a round ✕ at the top right that stays put while you scroll and goes straight to the main screen (`sheetX`). Answers are saved as you go.
- The budget questions remember where you stopped (`db.budI`). Starting again picks up there, with a "Start from the top" link.
- Each budget question has **🔎 What makes up $X?** (`budWhat`), and each line of the summary has *what's in it*. It shows every payee in that kind, biggest first, then each payment. Tap a payment to move it.

## v10.0 · the month at a glance (21 Nov)

Jerry: "when I think of a dashboard, I think of one screen that has statistics and buttons like dials … just a quick glance at the status of the financial condition." He approved a mock-up first.
- `glanceHTML` replaces the pulse card at the top of the main screen. It shows the pulse month, the last one with statements.
  - One sentence: under or over income, with the next action button.
  - Three dials: Income in (against usual income), Spent (against the Part 1 budget), and Yearly bills (saved against the next bill of each).
  - Tiles: Safe to spend and Net worth.
  - **Coming up**: the next 30 days (`glComing`). It lists only steady monthly bills (about once a month, at a steady amount) and Part 2 bills due by next month, with a "short" mark where savings fall short.
  - **Needs you**: questions, the spouse's questions, Charged twice, To look into, missing statements, short bill savings and backup.
  - Four buttons: Add statements, Ask, Budget and Lists.
- Every dial, tile and row opens what's behind it. The heads-up card still sits above the glance, and everything else moves below it.
- The overview and first-time videos each have one reworded line, re-recorded by name.

## v10.1 · sorting a card the way checking works, plus faster ways through (24 Nov)

Jerry, sorting his credit cards: "let's go back more closer to the way the checking account goes and then add some options on the AI suggestion", "leave the top used ones", "if the user validates a couple, give them a chance to do all of them", and "what if I just said dining out … and then you find it?"
- The payee sits in a box at the top with its web-search link, then the question "This looks like X — right?", or "✨ Your AI thinks this is X — right?", or "What was this?". The big ✓ at the bottom says yes.
- The last categories used (`db.recentCats`, kept by `sortSet` and `gkSave`) show as buttons under the question, and as "Used last" at the top of the full list.
- 🎤 **Say it** (`sinSay`, the browser's speech recognition, one phrase) matches the words to the closest category (`catMatch`, with a few everyday synonyms) and selects it. Nothing is saved until ✓.
- A labelled note box, "What was this?", sits under the category.
- The pinned bar holds the big ✓, then 🔍 Later, 💬 (save it for the spouse, `sinSpouse`) and ← Back.
- **✨ Let my AI suggest answers for all N** (`sinAI`) sends the payee names of every line with no guess, on every account, up to 200 per tap. Each one then comes up with "Your AI thinks … — right?", to say yes to or change.
- **⚡ Accept the app's guess for the rest** shows after three yeses to the app's own guesses (not the AI's). It lists every remaining payee the app has a confident guess for, all ticked. Unticked ones come back one at a time.

## v10.2 · move a line from any list, and check every category (24 Nov)

Jerry, on "What makes up Arizona car": "there's some things in here that are not Arizona car … can I go through this list and change it? … then probably a lot of other things are wrong. So you should check the whole database."
- Tapping a line in any list (What makes up, a category's month, the month's lines) opens **Move a line** (`movePick`). It shows the charge with its web-search link, the recent categories as buttons, the full list, a note box, and a box for moving every line from that payee, which also remembers it for next time. Moving one line alone leaves the payee's remembered category as it was. **Move it** returns to the same list, redrawn (`LASTLIST`).
- **🧹 Check every category** (`catCheck`) is under What makes up and in 📋 Lists. It shows one list, biggest first, of:
  - payees filed in more than one category (**Move all to** the usual one);
  - payees whose statement words point to a different category than the one they're in (checked with the remembered rules set aside);
  - on request, payees the AI thinks are clearly misfiled (`ccAI`, which sends payee names and category names only).
- Each card offers **Move all to X**, **Somewhere else…** or **It's right**. "It's right" is remembered in `db.ccOk`.

## v10.3 · ✨ What is this? (24 Nov)

Jerry: "you gave me Tangled Roots Cafe … personal care, but if you looked on the website, you would see this as a restaurant … one more level of checking?"
- A web page can't read another website, so under the web-search link (on the sort screen, the questions and Move a line) **✨ What is this?** (`whatIs`) asks the AI what the business is. It sends the cleaned payee name and the category names, nothing else, and needs no confirm box because the tap is the ask. It shows "✨ A neighborhood café — **Dining out** [Use it]". Use it picks the category; on the sort screen you still tap ✓.
- Real web search for the AI belongs to the house's AI door. Jerry chose "Both", so it went to the house chat on 24 Nov, with a small charge per lookup for him to approve there.

## v10.4 · every guess in one list (24 Nov)

Jerry: "If you could go through them, and then I could look over your answers and just correct the ones that need it."
- **📋 See every guess in one list** (`guessList`) is on Sort each account and on the sort screen. It lists every line still to sort that has a guess (the AI's ✨ or the app's own), one row per account and payee, biggest first, up to 400. Each row is ticked and has its category in a dropdown to change in place. **Accept** sorts the ticked rows with whatever their dropdown says; unticked rows wait to be sorted one at a time. A "Tick or untick them all" box is at the top.
- **✨ Let my AI suggest answers** now opens this list when it finishes, rather than going one at a time. The list also offers the AI for lines that still have no guess.
- Anything accepted can be changed later by tapping it in any list (Move a line), or found with 🧹 Check every category.

## v10.5 · 📄 See the statement (24 Nov)

Jerry: "we actually have that document in our folder, right? Could we go dig out the October Capital One statement … and display it? And then we don't have to go dig through our file folders and lose our place." He chose computer only.
- Each line now remembers the file it was read from (`t.f`, the path inside the linked folder), set in `groupAndGo` and `takeFile`.
- **📄 See the statement** (`stmtOpen`) appears on the sort screen, the questions and Move a line, wherever the browser can link a folder (`showDirectoryPicker`: Chrome and Edge on a computer).
  - It opens the remembered file, or, for lines read before this, searches the linked folder. The search ranks files by the account's folder, last 4, name and the line's month or the next one, then confirms the file holds the line's words and amount.
  - It opens the file in a new tab at that PDF page (`#page=N`), so the app keeps its place. The tab is opened at the tap so it isn't blocked as a popup.
  - If the folder isn't linked, it offers to link it.
  - Nothing is copied or sent.

## v10.6 · the questions in one dropdown, and What is this? looks it up (24 Nov)

Jerry, answering the questions: "It chose one thing. I chose something else … it didn't change the blue line to that line. It kept what it thought it was initially," then: "you could combine the blue line, what you think it is, and the 2 lines for something else in a different category into one … If that was just a drop down."
- The questions screen (`openGTKY`) drops its list of answer buttons (the guess, One-time, Help, A different category, Something else) and the second screens behind them. Now it shows:
  - "This looks like X — right?";
  - recent categories as buttons;
  - one dropdown (`#gkC`) already set to the guess, with ＋ A new category…, ＋ Help for a person not listed…, Used last, then All A to Z;
  - a note box, "What was it?";
  - one blue button (`#gkGo`, `gkGoSave`), whose label always matches the dropdown (`gkLab`);
  - "🔍 Not sure — keep it for later", Save it for my spouse and the AI-for-all button, as before.
- "✨ What is this? → Use it" on this screen now sets the dropdown rather than saving at once.
- `whatIs` asks with `web:true`. The house door (house v87, #657) looks the business up once Jerry switches web search on at the door; until then it answers from memory as before. A looked-up answer shows its sources (`djAI.sources()`) under it, as the search terms require.
- The two video lines that pointed at the old buttons now point at `#gkC`. The words are unchanged, so nothing needed re-recording.

## v10.7 · it learns from a correction, asks to change them all, and opens the statement (24 Nov)

Jerry asked for four things through the code-review chat, from screenshots of The Questions, then said "Let's build that so I can test the changes that we made so far."
1. **The lookup opens the statement.**
   - A card's link is now "📄 Open the September Community Trust statement".
   - On a computer with the folder linked, it opens in a new tab at the line's page (`stmtOpen`).
   - Anywhere else, the person picks the file once and the page is drawn in the app with ← Page → (`stmtPick` / `stmtShow`).
   - Bank lines (transfers, deposits, ACH, dividends and the like: `bankish`) no longer show the web-search link. Shops keep it.
2. **A note on every question screen.** The "What was it?" box from v10.6 is there. The note now also shows with 📝 wherever the line is listed (`txRow`).
3. **It learns from a correction.**
   - `suggestFor` now checks what he told the app about a payee (`db.rules`) before the first guess on the line.
   - `gkSave` gives every unanswered line from that payee the corrected category, whatever its earlier guess. Before, only lines with no guess got it.
   - `guessCat` already used the rule first for later statements.
4. **Ask to change them all.**
   - When the choice differs from the guess and the payee has other lines, a screen asks "Change the other N from X to Y too?", listing them.
   - **Yes, all** sorts them (they come off the question list). **Just this one** saves only this line; the app remembers the payee either way.
Videos for these wait on Jerry's wording (through the code-review chat).

## v10.8 · "Learns as you go" in the videos (24 Nov)

Jerry approved the name, the one line ("The more you teach it, the more of the routine it takes off your hands.") and the 40-second script through the code-review chat.
- A new video, **Learns as you go** (`extra.learns` in shop/apps_data.js), uses his script word for word, split into seven lines. Each line has a screen behind it: the glance; the questions dropdown; the "Change the other … too?" screen (`videoLearn`, example family only); "N filed themselves" after a new month (`videoNext`); the note box. Recorded by name: 38 seconds, 7 cues for 7 lines.
- **The training video** gains one line after step eight, taken from his script: "Fix one charge from a store, and it fixes every other purchase from that store, and asks if you'd like them all changed at once." Re-recorded by name: 13 cues for 13 lines.
- Every claim is true of v10.7. On a phone, "tap to see the actual bank statement" means picking the file once, after which the page shows in the app.
- The store card belongs to the house and store chat; the line was relayed there.

## v10.9 · statements open in the app; card payments and investment trades stay out of the questions (24 Nov)

- **The statement opens in the app.** "📄 Open the … statement" used to open a blank tab first, then an alert, which left the page unresponsive for Jerry. Now it draws the statement in the app (`stmtView`): a PDF page with ← Page →, or a spreadsheet as a table with the matching row highlighted (`stmtTable`). "Open it in a new tab" is a button inside.
  - A line is found by its words and amount, or its date and amount, or its amount alone (`stmtPage`), so a badly read description still finds it.
  - Spreadsheets (.csv, .xlsx) are read row by row (`stmtRows`, `stmtRowHit`).
- **Card payments.** Jerry: "all the ones in that credit column are payments. The credit card being paid off." A credit on a card that says payment is money moving (`cardPay`). It's filed by itself on reading and, once, for lines already in (`cardPayFix`).
- **Investment accounts.** Jerry: "whatever happens in the investment account stays within that account."
  - Every line in an investment account is filed as staying inside it (`invFile`: money moving, never spending, never a question).
  - A trade-looking line in an account not yet marked shows "📈 This looks like a trade inside an investment account" with **Mark … as an investment account** (`invMark`).
  - Money sent into it from checking or a card still counts on that side.
- `shop/voicemaker.py`: `EL_SPEED` can now be set from the environment (default unchanged, 1.07). "Learns as you go" was re-recorded at 1.0, 42 s, because Jerry asked for it "slowed down just a smidge".

## v11.0 · card payments matched to the bank, and 🔁 Check for repeats (24 Nov)

Jerry chose "Yes, build both".
- **Card payments matched to the bank** (`payMatch`). A card payment is matched to a bank line of the same amount within six days.
  - The card side shows "✓ Matches $100.90 from Checking on Oct 4", or ⚠️ with what the bank paid when the amounts differ (`payNear`: a bank line within six days that names the card's bank), or ⚠️ no matching bank line.
  - A bank line that matches a card payment shows "💳 Same as the … payment to …" with **Yes — money moving to the card** (`payIsCard`).
  - 📋 Lists has **💳 Card payments, matched to the bank** (`payCheck`), with the ones that don't match first.
- **🔁 Check for repeats** (`repCheck`) sits under the statement link on the questions, sort and Move-a-line screens.
  - It lists every charge in the same account within about 2% of the amount, plus the same payee anywhere, from three months before to three months after.
  - It says whether that looks like a monthly subscription ("$82.99 around the 28th, 4 months in a row"), two months running, a one-off, or irregular.
  - It reads only what's already in the app.
- The sample family's card payments don't match its checking amounts (sample data), so the check shows ⚠️ with both amounts there. Real statements should match.

## v11.1 · tick which ones change (24 Nov)

Jerry, on Immanuel Church (coffee, plus donations): "just tick the ones that change." The "Change the other N … too?" screen has a tick box on every line (all ticked) and a "Tick or untick them all" box. The button counts the ticked ones. Unticked lines keep their category; any still waiting keep their own guess (`GKSKIP`, `t.keepGuess`), even though the payee's remembered category follows the new choice.

## v11.2 · PayPal statements read in full (24 Nov)

Jerry: "Having a ton of trouble with categorizing the PayPal because there's not a lot of detail on it." His statement had the payee all along. PayPal prints it on the line under the type ("PreApproved Payment Bill User Payment:" / then the payee / then "ID: …"), and the app kept only the first line plus the USD column.
- `pdfParse`:
  - A row whose description ends in ":" or starts with a PayPal type takes the next undated lines until the "ID:" line. This handles two-line payee names.
  - A currency code at the end of a description is dropped.
  - A year cut by a wrap ("07/08/202" / "6") falls back to the statement's year.
  - "General Credit Card Deposit" no longer makes a PayPal statement look like a card statement. That misreading had turned its signs around.
- `mkey` and `webName` skip PayPal's type words (`PP_PRE`), so payees are told apart. Before, every PayPal payment was one payee ("preapproved payment"), and a correction to one would have applied to all.
- Reading a PayPal statement again repairs the lines already in the app (`takeFile`): same account, date and amount, with the old cut-short words. They get their full words instead of a twin. Ones not yet answered are guessed again; answered ones keep the answer.
- A PayPal file's direction is worked out afresh each time, because a remembered direction from the old misreading would be backwards.
- "General Credit Card Deposit" in PayPal (topping up from a card for the payment beside it) is filed as money moving (`ppFund`).
- Checked against Jerry's July statement locally (30 lines, every payee named). The statement isn't in the repo.

## v11.3 · PayPal charges counted twice (24 Nov)

Jerry: "PayPal takes out of the bank account, so there should be a corresponding bank charge … if so, we're overstating our expenses by a lot." From PayPal's transaction codes: "General Credit Card Deposit" (T0700) is a purchase funded by a credit card, and "Bank Deposit to PP Account" (T0300) one funded from the bank. So a funded purchase is also on that card or bank statement.
- **Rule:** count it once, on the PayPal side where the business is named. The card or bank side is money moving. (`autoKnown` already did this for unanswered lines that say PayPal; this catches the rest.)
- **Finding pairs** (`ppDupes`): each counted PayPal charge is paired with a counted line on another account of the same amount within five days. Lines saying PayPal or PP* come first; amount-only matches are marked to check.
- **📋 Lists › 🔁 Counted twice? PayPal and your other accounts** (`ppCheck`): shows the total counted twice, with **Count it once**, **Count each once — fix all**, and **They're different**.
- The main screen's **Needs you** shows how many there are.

## v11.4 · How each account works (24 Nov)

Jerry: "should we think bigger and get a little better setup of our transaction types and what the process of those transactions should be?" He chose the five roles, then said "go ahead and build the account roles screen".
- Every account has a role (`a.role`). When unset, `roleGuess` picks one from its type and name:
  - **Everyday**: checking and cards.
  - **Pass-through**: PayPal, Venmo, Cash App, Zelle.
  - **Savings**.
  - **Investments and retirement**.
  - **Loans and mortgage**.
- What each role does with its lines (`roleApply`, also applied as statements are read in `autoKnown`, and once on load):
  - **Everyday:** as before.
  - **Pass-through:** purchases count here; card or bank top-ups are money moving (`ppFund`); doubles are checked (`ppDupes`).
  - **Savings:** money moving, except interest or dividends coming in, which are income.
  - **Investments:** everything inside stays inside.
  - **Loans:** money moving, since the payment counts from checking.
- Lines a role filed are marked (`t.byRole`). Changing a role sends those back to the questions with a fresh guess, then applies the new role. An account made Investments takes the investment type; changing back restores its old type.
- `invAcct`, `ppAcct` and "Mark … as an investment account" now go through the roles.
- **🧭 How each account works** (`openRoles`) is in ⚙️ Settings and 📋 Lists: one card per account, with a dropdown and a sentence on what that role does.

## v11.5 · Settings shows where each question stands; bills one at a time (24 Nov)

Jerry: "If you listed the information under that tab…", then, on the bills question, one at a time with how often and which months; "use some of the information from above… property tax house 1, house 2… BMW and then the Tesla"; and on the 529 and help questions, "figure that one out and let's go build it".
- **Settings** lists every setup question with ✓ and the answer under it (`sqSum`), or "Not answered yet", plus "N of 19 answered" and "▶ Pick up where you left off" (`sqAcc`).
- **Cars** is a new question after homes (`db.cars`).
- **Bills that don't come every month** (`billPickHTML`, `billStep`, `billSave`, `billDone`):
  - The pick list offers common ones named per home and per car, plus large payees seen in the statements but not in the last four months (`billSeen`), skipping anything already in Part 2 or sorted as Part 1.
  - Then one bill per screen: how often (once, twice, quarterly, monthly but uneven, other), which months, amount each time, and an escrow box. Escrow sets aside nothing. Monthly-but-uneven goes to Part 1 as varying.
  - A summary shows each bill and the monthly set-aside.
- **Goes up and down** is pre-ticked from the statements (`varGuess`, month-to-month spread over 15%).
- The 529 question now reads "Do you ever pay for something and then get paid back from a 529 plan?". The "regularly help anyone" question is gone.
- **Open the statement** tries every statement in the account's folder after the most likely twelve.


## v11.6 · Two-line statement entries; no lumping lines with no shop name; steady bills only for price jumps (25 Nov)

Jerry, on his Community Trust statement: "there's two lines to that transaction … when you see Jewel, you know it's for groceries." On PayPal: "it wants me to lump all these together, but I can't." On a restaurant heads-up: "that number's going to be all over the place. Why did that get flagged?"
- **Second lines** (`thinDesc`, `pdfParse`): a dated row whose description is only the kind of transaction (WITHDRAWAL, DEBIT CARD DEBIT, POS…) takes the one line under it. That line is skipped if it holds money or reads like a balance, total, page or column header. Dates printed as `SEP02` / `NOV03E` are read too.
- **Repair**: adding the statement again fills in lines already brought in with only that first line, then re-guesses any not yet answered. This works the same way as the PayPal "Payment: USD" repair.
- **Cut-short lines stand alone** (`cutShort`): a line that is still only "…Payment: USD" or only "WITHDRAWAL" has no shared key, so there is no "change the other 100" prompt and no rule is learned. Rules already learned for "usd" or "withdrawal" are removed on load (`rulesFix`).
- **Price-jump heads-up** fires only for a bill whose earlier charges all sat within 15% of the usual. Restaurants and shops vary, so they no longer trigger it.

## v11.7 · The second line fills itself in; Add statements always opens; one Add statements button (25 Nov)

Jerry: "why do you wanna see a statement? I just want to see the second line of the text. Can you do that?"; "When I hit the add statement … I got this screen. Why am I getting that again?"; "two buttons right together, add statements twice."
- **`fillShort`**: the first time the questions open, lines still cut short ("…Payment: USD", "WITHDRAWAL") are filled in from the PDFs in the linked folder. It reads only files for those accounts, by folder, last 4 digits, account name or the remembered file. It matches on date and amount, and the description must start with what was there. Lines not yet answered are guessed again; answered ones keep their category.
- **Add statements** opens the import box once any account exists, even with setup questions still open. Before that, it starts at the first unanswered question rather than question 1.
- The 📄 Add statements button in the top box's row is gone; the brown bar at the bottom is the one.

## v11.8 · Check for repeats: tick and answer them all at once (25 Nov)

Jerry: "there's one that match, so some that don't. So I want to be able to check the ones that match and do them all at once."
- Each charge on the repeats list has a tick box. The same amount and shop come ticked; money moving has no box.
- "They are" picks the category. "✓ These N are …" answers every ticked line and moves on to the next question (`repSave`).
- A PayPal line that ran on into its funding line ("PARAMOUNT+ PayPal Balance -8.99 USD") is cut back to the shop name, both when a statement is read and once on load (`ppTidy`).

## v11.9 · Repeats: the same price only; the pick carries over; lost categories come back (25 Nov)

Jerry: "if I have a transaction up that's $9.95 … it should only bring up the same price"; "it didn't keep the category. It went to undefined."
- **Check for repeats** lists only charges at exactly the same price, across the months loaded. The same shop is listed first and comes ticked. Each line shows what it is now, or "not answered yet", so answered lines can be changed here too.
- **The category picked on the question** comes along as the repeats screen's "They are".
- **`catFix`**: a line pointing at a category that no longer exists goes back to the questions, and rules pointing at one are dropped.

## v11.10 · One of each bill (25 Nov)

Jerry, on five "Bills once or twice a year · Car insurance (yearly)" in the category list: "just make one car insurance, and I'll put a note in."
- **`billDupFix`** runs on load. Bills that come once or twice a year and share a name become one category. Their lines, rules and recent picks move to the one kept, and their months, amounts and escrow are combined.
- Reading statements no longer makes a second copy: an existing bill is matched by name as well as by its search words.

## v12.0 · The questions as a list (25 Nov)

Jerry: "If you're going to do 200 and some odd at a time, you should be able to go down the list, not one at a time … see the category and then be able to change it on a list." He picked the mockup.
- **`openQList`** shows one row per shop, keyed like the change-all grouping. Cash, check and cut-short lines each get a row of their own.
  - Each row shows the line count, the amounts and the accounts.
  - Its category dropdown holds the most common guess, marked "guess", or "✨ AI" when it came from the AI.
  - Rows with no guess are yellow, unticked and marked "needs you".
- **Tap a row's count** to see its lines, each with its own dropdown ("same as the row" by default).
- **Sorting:** By shop (guessed first, most lines first), Biggest first, or Not sure.
- **"✓ Accept N ticked lines"** answers every line in the ticked rows and learns a rule for each shop. The list then redraws with what's left. "Answer them one by one" goes back to single questions.
- **"✨ Let my AI pick for the N it can't guess"** uses the same AI call as before and comes back to the list.
- **Getting there:** "Answer the N questions" opens the list when there are more than 10. Every question also has a "📋 See all N as a list" button.

## v12.1 · The list keeps your place (25 Nov)

Jerry: "When you click the lines to expand, it goes back to the top and you lose your spot."
- Opening a row and changing a row's category redraw the list in place (`qlRedraw`). The scroll position and the row order stay where they were, and no extra Back step is added. The order is worked out fresh when the list opens or the sort changes.

## v12.2 · The list never jumps; a ✓ on every row (25 Nov)

Jerry: "It could be smoother … every time you click something, it goes up to the top. You lose your spot." He was away, so these calls were made for him:
- Nothing on the list redraws the page any more. Opening a row's lines (`qlToggle`), changing its category (`qlPick`) and ticking it (`qlTick`) all change that row in place.
- **A ✓ button on every row** (`qlOne`) answers that row on the spot. It stays grey on a row with no category until one is picked.
- **Answered rows fold away** where they are (`qlDone`); the count at the top and the Accept button update.
- When the shown rows are all done and more remain, the list reopens with the rest.

## v13.0 · Every dollar counted once, and proof that it balances (25 Nov)

Jerry: "you need to know their function and how to account for them so the money in and out balances … do some research and make sure your algorithm is good … then we need to reconcile this database." Also: "on the your money box, have two buttons … if there is a way to go directly to another page, the option should be available." He approved the six sample screens as one build.

The rule, as Quicken, Monarch, Tiller, PocketSmith and Rocket Money all apply it: every dollar is counted once, where the detail is. Money moving between our own accounts (card payments from the bank, PayPal top-ups, savings ↔ checking, payments to a loan) is a transfer, never spending or income. Interest and fees stay spending.

- **The money box:** with more than one question waiting it offers "📋 As a list" and "👆 One at a time" side by side (`askRound('list'|'one')`).
- **List rows:** each has 🔎 Web (not for bank transfers, cash or checks), 📄 Statement and 🔁 Repeats (`qlLinks`). Back from either returns to the list as it is now, at the same scroll position; saving repeats does the same.
- **How each account works, asked when it is added:** `mapAdd` has "How does it work?" (the five roles, with the sentence for each). A closed account asks "Which one took its place?" (`a.replacedBy`).
- **Statements holding several accounts:**
  - `pdfParse` reads "NAME … ACCT# n" section headers. Each line carries its section, and each section keeps its own opening and closing balance.
  - The first time, the app asks what each account is (checking = this account, savings, money market, another checking, loan). It makes the new accounts (`subOf`, no folder of their own, never "missing") and remembers the mapping in `a.subs`.
  - Lines read before the split move to their account, matched on date, amount and words, so nothing doubles.
- **Statement numbers kept:** `db.stmts`, one per account per statement: opening, closing, the sum of its lines, the dates, and the file.
- **Transfer partners:** `xferPartner` looks for another of our accounts, the other direction, the same amount, within five days. `autoPairs` runs on load and after every statement:
  - A line still waiting that looks like a transfer and has a partner becomes money moving, on both sides.
  - PayPal pairs where the other side says PayPal are counted once.
  - Answered lines are never changed.
- **🔁 Money moving between our accounts** (`openXfers`, in Lists) shows every move with its partner. A move without one says why: no statement yet for that card or month, a replaced card, or an account followed by its total.
- **⚖️ Does it balance?** (`openBalance`, in Lists):
  - Each statement is checked two ways: opening + lines = closing, so every line was read; and the app's lines for that account and those dates add up to the statement's.
  - It also shows a household line for the month (income, spending, left over) and whether money moving nets to zero.
- **▶ Watch how on each section:**
  - The questions (list and one at a time) and the monthly report each have their own button. Setting up uses the "train" video. Does it balance and Money moving use the new "report" video.
  - The two new videos, "Answering the questions" and "Does it balance?", are recorded with ElevenLabs at 1.0, with 8 and 7 cues for 8 and 7 lines.
- **Workflow check done:** the money box, the list ⇄ one at a time, the list rows, repeats → back to the list, and balance ⇄ transfers each jump straight where you want to go.
- **Not yet:** splitting a mortgage payment into principal and interest (it needs the loan statement). Accounts read before v13.0 have no statement balances until their statements are read again.

## v13.1 · The AI reader splits picture statements by account (25 Nov)

Jerry chose "teach the AI reader". His Community Trust statements are scanned pictures holding several accounts, so the app's own reader gets nothing from them, and the earlier AI reads put every line on one account.
- **Both AI prompts** now ask: when a statement holds more than one account, answer `Date,Description,Amount,Account`. Account is the section's name and short ACCT# number. Each account on each statement also gets an `Opening` and a `Closing` line, and a shop name printed on the line under a transaction is joined into its description.
- **`aiParse`** reads that four-column answer into lines that carry their account, plus per-account statement balances, the same shape as a text statement (`row.sub`, `out.stmts`). The split question, the line moving, `stmtKeep` and the balance check then work unchanged. A three-column answer still goes to `parseCSV`.
- **AI answers word a line differently each time.** For AI-read statements, already-here lines are matched on account, date and amount, not words, so a re-read doesn't double anything.
- **Statements screen:** picture PDFs found when picking an account's folder are listed — "📷 N statements are in the folder but are scanned pictures…" — with "✨ Read them with AI" (`FMF['acct:'+id]`). The "lines read" message no longer says to download a CSV instead.

## v13.2 · A new account at the same bank carries on the old accounts (25 Nov)

Jerry: "The Old account is closed starting in November. We use a new account so what happens then when I put a statement in the new account?"
- **The "This statement has N accounts" question** now also offers "↪ The same Regular Savings as before" for every account already made from a statement at the same bank. A section with the same name comes pre-picked that way, so the new statements carry on in the same savings and money market accounts, with no second copies.
- **Only the first checking section is taken to be "this account".** A second one (for example Diane Checking) comes pre-picked as "Another checking account".

## v13.3 · Each month checked on its own (25 Nov)

Jerry's first balance check showed checking as not adding up and kept one statement per account. The AI had read several months in one answer, and `aiParse` added them together as one statement. Now each `Opening` line starts a new statement for its account and each `Closing` ends it, so every month is kept and checked on its own. Reading the folder with AI again replaces the combined entry.

## v13.4 · Rows that open something look like it (25 Nov)

Jerry: "it doesn't look like that's an active link … put a line on it … so they know it's a link." Every list row that opens something (`.list li.tap`) now has a › on the right. On a computer it lightens and underlines its words under the pointer.

## v13.5 · Balance check: no leftovers, no empty "ties", and the AI's own words (25 Nov)

Jerry's check showed a June home-equity entry off: the old combined figure, still there. It also showed his main checking at $0 "tying" for May and June. He chose to fix all three.
- **Leftovers:** the first AI reading of an account in a session clears the balance figures kept for it and its split accounts. After that, each month is kept under the account and the month, so a month read again replaces what was kept.
- **Empty months:** a statement month with no lines and a missing opening or closing balance isn't kept. A kept month with no lines, while the app does have lines for that account that month, shows "no lines were tied to this statement" instead of "ties".
- **What the AI read:** the AI's answer for each statement is kept (the last 40). Each month on Does it balance? has a "What the AI read" link that shows it word for word.

## v13.6 · Lines and balances joined; picture PDFs offered again (25 Nov)

Jerry's June checking and home equity showed balances with "no lines tied". The AI had listed the lines in one place and the Opening and Closing balances in another. `aiParse` now joins a part with lines but no balances to the next part that has balances but no lines (and the other way round) into one statement. Picking an account's files again also offers its picture PDFs to the AI again, so "Read them with AI, below" always has its button.

## v13.7 · Dated balance lines (25 Nov)

"What the AI read" showed the AI writing each balance as a dated line, for example `<date>,Opening balance,<amount>,<account>`. The app was reading these as transactions, so nothing tied and fake "Opening balance" lines landed in the accounts. `aiParse` now goes by the words in the Description ("Opening balance", "Closing balance" and their usual synonyms), not only the first column. `balLineFix` runs on load and removes any line whose whole description is a balance line.

## v14.0 · 26 Nov · See what's different

Each statement that doesn't tie on "Does it balance?" gets a "See what's different ›" link. It lists the lines on the statement that the app doesn't hold, and the lines the app holds for those dates that aren't on the statement (matched by amount, same day or within four days). The statement's lines come from the AI's kept answer. If the statement doesn't add up by itself, it says so: the AI missed or misread a line.

## v14.1 · 26 Nov · Set it up with me, and the budget on one list

- **Set it up with me** (`coachStart`, `coShow`, `coAsk`) runs the household questions one at a time, each with a "Why I ask" line. One AI call words the whole run, and each question the person asks costs one more, capped at 8. Every call is counted against the daily limit. The AI sees totals, account kinds and the question wording only. With no AI connection, the same run uses plain wording (`COWHY`). Answers are saved by each question's own `save()`, only when Next is tapped. The year, accounts and email questions are skipped, because the folder step already covers them.
- `SQKEY` lines up with the questions again (cars was added and help was removed), so answers found in the statements now skip the right question. `setupSummary` builds its lines by key.
- **The budget** asks "how often" on one list with a drop-down per row, filled in from the statements (`budStart`, `budListSave`, `rvTimeApply`), then moves to the amounts. The calendar reminder no longer pops up on its own after the first budget.
- New videos: `setup` and `budget`.

## v14.2 · 26 Nov · Set it up with me from Settings

The checklist disappears once setup is done, so Settings now has a "✨ Set it up with me" button at the top. It runs the questions again with the answers already filled in.

## v15.0 · 26 Nov · The main screen, tightened

- **Overview:** the glance puts its dials beside Safe to spend, Net worth and Investments; on a computer they sit side by side. "Needs you" shows only when something needs attention. "Coming up" folds into a single line that shows how many are due and how many are short. The Ask, Budget and Lists button row is gone.
- **Groups:** each group is a small tile (`gTile`), two across on a phone and three on a computer, with a bar. When the group is over its budget, a line under the tile says by how much; when only one of its lines is over, it names that line. Tapping a tile opens the group (`openGroup`). "Goes up and down" and "Yearly bills" (`p2Tile`) are tiles too.
- **Folded sections:** "In three parts", Worth a look, Added together, Biggest gaps, Statements and Getting set up are each one line (`fold`) that opens on a tap and stays open through a redraw (`FOLD`).
- **Tools:** the old net worth, investments and household cards are gone. The 19 tool buttons are now four tiles (`TOOLS`, `openTools`), and each button inside them says what it does.
- **Wider layout:** on a computer the page is up to 980px wide.
- **Videos:** the folded sections the videos talk about are open in the videos. Two lines in the overview video were reworded and re-recorded.

## v15.1 · 26 Nov · The same look on five more screens

- **Settings:** each section folds into one line that says how many of its questions are answered. The extras fold under "More".
- **The month** (`openMonth`): one page per month, with ‹ › to change month. From it you open the check-up (with "n of 5" done, from the shared `ckupSteps`), the report and the note, and close the month once everything is in. The bottom button now reads "📝 The month". The report no longer plays the balance video.
- **Check the books:** each check shows a count, or ✓ when it's clear: Waiting on us, Does it balance, Money moving, Charged twice, and PayPal doubles when there's a PayPal account.
- **Waiting on us** (`openWaiting`): one list holding the purchases to sort, the spouse's questions, what was set aside to look into, and possible double charges. It links to Lists.
- **Our accounts:** tiles grouped by kind, with closed accounts last. A line under a tile says when statements are missing, when the account isn't ours, or when its balance is unknown.
- **Video:** the report video's line about the monthly report was reworded and the video re-recorded.
