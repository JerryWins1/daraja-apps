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
