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
- A credit union's name taken from a file name no longer drags the file name along ("CTCU Statement Oct.pdf Community Trust Credit Union" is now "Community Trust Credit Union"), and "Navy Federal" keeps "Federal".

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
