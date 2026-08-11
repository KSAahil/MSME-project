# MSME AI Business Assistant

Strategy and build repository for a mobile-first, conversational business assistant for Indian micro and small businesses.

## Runnable product

The first working vertical slice is in [product](product/README.md). It runs locally without external credentials and includes invoice drafting/confirmation, deterministic GST calculations, PDF and UPI QR generation, receivables, partial payments, customer memory, CA export, and audit events.

The current launch hypothesis is Chhattisgarh, starting with the Raipur–Durg–Bhilai cluster and industrial service contractors/small fabricators. See the [pilot decision brief](docs/08_CHHATTISGARH_PILOT_DECISION.md).

## Current recommendation

Do **not** begin as a full accounting/ERP replacement. Begin as an **invoice-to-cash copilot** for GST-registered, owner-led businesses that already sell and follow up on WhatsApp:

> Say it. Bill it. Collect it.

The first promise is: create a correct invoice from text or voice, attach a UPI collection method, keep a reliable receivables ledger, and make follow-up effortless.

This wedge is narrower than “AI Munim”, but it has a clearer return on investment, a faster path to trust, and less implementation risk. Purchases, inventory, GST filing, e-invoicing, and full accounting can be added after the invoice and receivables ledger are trusted.

“AI Munim” should remain a working concept only. “Munim” is already used by multiple Indian accounting products, so naming and trademark clearance are required before launch.

## Repository map

- [Project status](PROJECT_STATUS.md) — current phase, decisions, open questions, and changelog
- [Strategy dossier](docs/01_STRATEGY_DOSSIER.md) — market, positioning, competition, moat, pricing, and recommendation
- [MVP product requirements](docs/02_MVP_PRD.md) — users, workflows, scope, data model, metrics, and acceptance gates
- [Architecture and security](docs/03_ARCHITECTURE_SECURITY.md) — end-to-end system design and AI/control boundaries
- [Go-to-market and economics](docs/04_GTM_ECONOMICS.md) — launch plan, distribution, pricing, unit economics, and milestones
- [Compliance and risk](docs/05_COMPLIANCE_RISK.md) — GST, WhatsApp, UPI, data protection, recordkeeping, and risk controls
- [Customer discovery guide](docs/06_CUSTOMER_DISCOVERY.md) — interview script, scorecard, and pilot plan
- [End-to-end build roadmap](docs/07_END_TO_END_BUILD_ROADMAP.md) — implementation phases, requirements, gates, team, and first 30 days
- [Chhattisgarh pilot decision](docs/08_CHHATTISGARH_PILOT_DECISION.md) — launch cluster, first customer profile, recruitment, CA review, and AI API staging
- [Runnable product and developer guide](product/README.md) — current implementation, setup, limitations, tests, and next engineering gates
- [Research sources](RESEARCH_SOURCES.md) — primary and supporting sources, with access dates

## Phase gate before code

Do not fund a broad build yet. The next gate is 30 structured interviews and 10 design partners in one city/cluster. Proceed to MVP only if at least 6 of 10 qualified design partners:

1. create at least five real invoices in two weeks;
2. maintain receivables in the product rather than a parallel notebook;
3. send at least one reminder or payment request;
4. report a measurable time or collection benefit; and
5. agree to pay at least ₹299–₹499 per month after the pilot.

## Working product principles

1. Conversation is the input method, not the database.
2. AI interprets; deterministic services calculate tax and money.
3. Every financial write is previewed, confirmed, idempotent, and auditable.
4. “Profit” is never shown unless purchases, expenses, returns, and opening balances are sufficiently complete.
5. The merchant owns the customer relationship, WhatsApp identity, payment account, and exportable data.
6. The company never handles or pools merchant funds; regulated payment partners do.
7. A lightweight web/PWA control surface remains available so the product is not hostage to one messaging platform.

## Last updated

11 August 2026 (Asia/Kolkata)
