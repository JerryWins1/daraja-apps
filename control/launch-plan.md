# Launch plan — the five ideas Jerry chose, 21 Nov 2026

Jerry: "work on the best way to manage it… new leading edge ideas for the world's leading AI app store."
Ten were offered; he chose 1, 2, 5, 8 and 9.

| # | idea | who builds it | depends on |
|---|---|---|---|
| 1 | **Launch board**: one page, every app green or red on: video current (`voicemaker.py --check`), AI line in its videos, same-look audit passed, test script passed, store card true. Refreshed by the nightly job. | Store Manager (nightly caretaker) | the two overnight reports |
| 2 | **AI sorts the messages**: each night, every `FEEDBACK|kind:` row from "Send us a message" is read. Problems are relayed to the owning chat (control/apps.json), ideas go on an idea board, questions get a drafted reply for Jerry to approve. Nothing is sent to a customer without Jerry. | Store Manager (nightly) | house layer shipping "Send us a message" |
| 5 | **AI concierge on the store**: "Tell me about your week" → 2–3 apps that fit, with why. Uses the Daraja AI door; answers only from the store catalogue (shop/apps_data.js). | Store Manager | the AI door (live) |
| 8 | **Sunday scorecard**: opens per app (openPing), messages by kind, gifts (sales.json total only), and the top request, on one screen. | Store Manager (nightly) | 2 |
| 9 | **Safe rollout**: a new app version goes to the test copy first; after 24 hours with no new problems it goes to everyone. | house layer + store chat | a decision on how the test copy is served |

Order: 1 and 5 first (no dependencies), then 2 and 8 once "Send us a message" ships, then 9.
Words a customer reads (concierge wording, any reply) are Jerry's to approve before they ship.
