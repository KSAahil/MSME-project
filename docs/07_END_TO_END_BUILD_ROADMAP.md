# End-to-end product build roadmap

**Product:** Conversational invoice-to-cash assistant for Indian small businesses  
**Working name:** Project Munim (brand not cleared)  
**Initial promise:** Say it. Bill it. Collect it.  
**Version/date:** 1.0 — 11 August 2026

## 1. What is being built

The first commercial product is not a full ERP, autonomous accountant, GST filing system, or general chatbot. It is a mobile-first assistant for owner-led Indian B2B businesses.

The owner can:

1. type or speak in English, Hindi, or Hinglish;
2. review the customer, items, taxes, terms, and totals extracted by AI;
3. confirm and generate a numbered invoice PDF;
4. attach the merchant's own UPI QR/payment method;
5. share from the merchant's WhatsApp;
6. record full or partial payments;
7. see unpaid and overdue balances;
8. draft polite reminders;
9. ask reliable questions about sales, collections, and receivables; and
10. export structured records to the CA.

AI interprets language and drafts text. Deterministic services control money, GST logic, invoice numbers, ledgers, permissions, and reports.

## 2. Delivery path

| Phase | Planning duration | Outcome | Gate |
|---|---:|---|---|
| 0. Founder setup | 2–5 days | Scope, ownership, budget | Named owners and runway |
| 1. Customer discovery | 3–4 weeks | One narrow first segment | Segment scores ≥70/100 |
| 2. Feasibility/policy | 2–4 weeks, parallel | Tax, WhatsApp, payment, privacy path | No critical blocker |
| 3. Clickable prototype | 1–2 weeks | Tested mobile UX | ≥80% task completion |
| 4. Product/technical specification | 1–2 weeks | Schemas, rules, tests frozen | CA/engineering sign-off |
| 5. Platform foundation | 2–3 weeks | Secure environments and tenancy | Foundation tests pass |
| 6. Financial core | 4–6 weeks | GST engine, invoices, PDFs | Zero critical calculation defects |
| 7. Collections core | 3–4 weeks | Ledger, UPI, aging, reminders | Reconciliation tests pass |
| 8. Conversational AI | 3–4 weeks | Safe typed commands | Evaluation thresholds pass |
| 9. PWA and CA mode | 2–4 weeks | Complete control surface/export | Journeys pass end to end |
| 10. Voice beta | 2–3 weeks | Verified voice-note input | Voice benchmark passes |
| 11. Hardening | 2–3 weeks | Security, recovery, legal, support | Readiness sign-off |
| 12. Concierge pilot | 4 weeks | 10 real businesses | ≥6/10 use and agree to pay |
| 13. Paid MVP | 4–8 weeks | Billing, onboarding, operations | Retention/economics work |
| 14. Selective automation | 6–12 weeks | WhatsApp API/payment webhooks | Policy and ROI gates |
| 15. Expansion | Ongoing | Evidence-backed modules | Per-module gate |

Discovery to a dependable pilot is approximately four to six months for a focused team. A broader paid product is more realistically six to nine months. These are planning estimates.

## 3. Phase 0 — founder setup

### Requirements

- Confirm invoice-to-cash as the first wedge.
- Choose one launch city/cluster.
- Name the product owner and compliance/operations owner.
- Set discovery, MVP, and maximum monthly-loss budgets.
- Decide founder-led, in-house, or agency engineering.
- Keep “AI Munim” internal until trademark/domain checks finish.
- Create a decision log, risk register, issue tracker, and weekly metrics review.
- Define who can approve financial-rule changes.
- Plan separate development, staging, and production environments.

### Exit gate

A single accountable founder, agreed release boundary, approved discovery plan, and 6–9 months of runway for the selected build model. A full ERP is explicitly outside MVP.

## 4. Phase 1 — discovery before production code

Interview 30 owners in one city: 10 contractors/installers, 10 agencies/professional firms, and 10 B2B traders/distributors. Observe at least five real invoice-and-collection workflows. Interview at least five CAs/bookkeepers serving these users.

Record invoice volume, repeat customers, credit, outstanding amount, current tools, delays, payment matching, CA handoff, language, trust issues, and willingness to pilot. Do not collect unnecessary identifiable financial records.

### Deliverables

- scored interview notes and current-state workflow maps;
- quantified time/collection pain;
- one ideal-customer profile;
- real vocabulary/voice examples;
- switching/competitor analysis;
- 10 qualified design partners; and
- measurable baseline and problem statement.

### Exit gate

One segment scores at least 70/100 and 10 qualified businesses commit to a real pilot. If users like their billing software but hate collections, consider a receivables overlay instead of forcing invoice migration.

## 5. Phase 2 — tax, legal, platform, and vendor feasibility

Run this in parallel with discovery.

### CA/GST requirements

Retain a practising CA/GST specialist to approve:

- registered, unregistered, and composition boundaries;
- B2B/B2C invoice fields;
- CGST/SGST/IGST and place-of-supply scenarios;
- inclusive/exclusive pricing, discounts, and rounding;
- HSN/SAC capture and confirmation;
- credit-note/cancellation/revision behaviour;
- financial-year sequencing and retention; and
- CA export schema/disclaimers.

Create at least 50 approved golden tax cases before implementation.

### WhatsApp requirements

Pilot with a normal share action from the merchant's own WhatsApp Business app. Before automation, document exact data flows, obtain written eligibility feedback from a Meta Tech Provider/BSP, decide number ownership, and design consent, templates, opt-out, quiet hours, frequency, and quality controls. Preserve a complete PWA fallback. Do not market this as a general-purpose AI chatbot.

### Payment requirements

The company must not receive, pool, hold, or settle merchant funds. MVP uses the merchant's UPI ID/QR with explicit manual payment recording, or the merchant's own authorised provider account. Later reconciliation requires verified webhooks, duplicate protection, reversal/refund handling, exceptions, and a merchant-fee analysis.

### Privacy, security, and legal requirements

Obtain India-qualified advice on terms/privacy, merchant authority for customer data, DPDP roles/notices/rights/retention/subprocessors, CERT-In logging and incident reporting, GST retention, acceptable use, liability, CA/referral contracts, and trademark clearance.

### Exit gate

No unresolved critical tax, data, payment-flow, or platform-policy blocker. WhatsApp automation, GST filing, and central payment collection cannot be foundational assumptions.

## 6. Phase 3 — clickable prototype

Build a non-production mobile prototype for onboarding, typed/voice invoice instructions, uncertainty highlighting, correction, confirmation, PDF preview, share, partial payment, receivables query, reminder draft, and CA export.

### UX rules

- structured cards instead of long chatbot prose;
- large mobile actions and little accounting jargon;
- no financial posting from the first AI response;
- risky ₹ values shown in numerals and short words;
- easy correction without retyping;
- visible Draft, Confirmed, Sent, Part-paid, Paid, Overdue, Disputed, and Cancelled states;
- conventional form fallback; and
- explanation of what was saved.

### Exit gate

At least 80% of target users complete the fixed tasks without coaching, and 10 agree to use real invoices in the pilot.

## 7. Phase 4 — freeze the MVP specification

Define and version:

- command schemas for invoice, correction, payment, search, query, and reminder;
- invoice/payment state machines;
- roles and permissions;
- numbering and tax-engine contracts;
- audit events and AI confirmation policy;
- errors, retries, provider webhooks, exports, and completeness labels.

Minimum entities: business/tax registration, user/role, customer/contact/address, item/service/tax mapping, immutable invoice version/line item, note, payment/allocation/reversal, receivable, reminder/share/consent, document, AI interpretation/confirmation, audit event, export job, and exception flag.

### Exit gate

The CA signs the tax matrix, engineering signs state/failure behaviour, and product signs the out-of-scope list.

## 8. Phase 5 — platform foundation

### Recommended architecture

- responsive PWA;
- modular backend rather than premature microservices;
- PostgreSQL system of record;
- object storage for PDFs/exports;
- job queue for PDFs, exports, transcription, and callbacks;
- server-side AI-provider adapter;
- deterministic tax/invoice/ledger modules;
- managed secrets, monitoring, and encrypted backups;
- reviewed India-region hosting/log-retention arrangement.

A lean team could use TypeScript, React/Next.js, a Node/NestJS-style API, PostgreSQL, and a proven queue. Choose what the team can operate reliably.

### Delivery/security requirements

- local, development, staging, production separation;
- protected production access and reviewed changes;
- automated tests/migrations, feature flags, and kill switches;
- tenant isolation at every query/storage path;
- strong authentication and owner/read-only-CA roles;
- TLS and encryption at rest;
- no secrets in code, prompts, analytics, or logs;
- append-only financial audit events;
- approved/audited support access;
- privacy-minimised logs;
- verified webhooks; and
- tested backup restore.

### External accounts/services

- business domain and role emails;
- source control/issue tracking;
- cloud account with billing alerts;
- database, storage, queue, email, monitoring, secrets;
- OpenAI API project or another LLM provider;
- transcription providers for benchmarking;
- payment sandbox only if reconciliation is tested;
- Meta/BSP setup only when automation enters scope;
- GST lookup/GSP sandbox only for an approved feature;
- support/helpdesk channel.

API keys remain server-side. A consumer ChatGPT subscription is not used by the product and does not include API usage.

## 9. Phase 6 — deterministic financial core

Build in this order:

1. **Business onboarding:** identity, GST status/GSTIN, address/state, prefix/sequence, terms, logo/signature, UPI ID, opening receivables, test invoice.
2. **Customer/item masters:** duplicate detection, contacts, GST/place-of-supply facts, units/prices, HSN/SAC candidates and confirmed tax rates, import/export, history.
3. **Money/tax engine:** exact decimal/minor-unit arithmetic, inclusive/exclusive price, CGST/SGST/IGST, discounts, rounding, effective-dated rules, blocking/warning validations, golden tests.
4. **Invoice engine:** drafts, atomic number allocation at confirmation, immutable confirmed versions, credit/cancellation flows, idempotency, audit history, PDF generation.

The LLM never performs final arithmetic.

### Exit gate

All golden cases pass; concurrent retries cannot duplicate invoice numbers; confirmed invoices cannot silently change; every state change has actor/time/source/reference; stored calculation and PDF reconcile; representative PDFs receive CA approval.

## 10. Phase 7 — collections, UPI, and reminders

Build unpaid/part-paid/paid/overdue/disputed/written-off/cancelled states; cash/UPI/bank/cheque/provider sources; allocations; partial balance; reversals; manual evidence notes; and a separate verified-provider path.

Render the merchant's UPI QR/intent, but never call a static QR automatically reconciled. Provider links must belong to the merchant's authorised account. Do not store UPI PINs or sensitive payment credentials.

Add aging, due lists, customer balances, reminder history, next action, tone choices, manual share, and settings for future frequency/quiet hours.

### Exit gate

Partial payments reconcile; duplicate webhooks/retries cannot duplicate receipts; reports match allocations; disputed invoices suppress normal reminders; delivery/read is claimed only with platform evidence.

## 11. Phase 8 — conversational AI layer

### AI is allowed to

- detect language/intent and transcribe/transliterate;
- find likely customer/item candidates;
- extract dates, quantities, rates, terms, and tax candidates;
- identify ambiguity and ask a short clarification;
- draft reminder wording; and
- explain deterministic query results.

### AI is not allowed to

- issue invoice numbers or calculate final tax/totals;
- post/alter ledgers without confirmation;
- decide that a customer paid;
- bypass permissions or delete history;
- file GST returns; or
- state profit from invoice-only data.

### Safe command flow

1. Receive text/transcript.
2. Send only required context to the model.
3. Require a versioned structured output schema.
4. Validate types, limits, tenant ownership, and permissions.
5. Match master data deterministically.
6. Calculate money/tax in the financial engine.
7. Show preview and uncertainties.
8. Obtain explicit confirmation.
9. execute an idempotent command.
10. return the posted document and audit reference.

### Quality requirements

- at least 100 versioned text test commands before paid MVP;
- coverage of Hindi/Hinglish/English, correction, negation, dates, Indian-number formats, inclusive tax, ambiguity, and hostile prompts;
- field-level accuracy for names, quantities, prices, dates, GST rate, and intent;
- zero unconfirmed financial writes;
- model/prompt version stored with interpretations;
- form fallback;
- monitored latency, cost, failure, and correction rates; and
- provider abstraction so financial services do not depend on one model vendor.

## 12. Phase 9 — PWA, intelligence, and CA mode

### PWA screens

- sign-in/onboarding and conversational home;
- invoice drafts/history;
- customer/outstanding detail;
- payments and aging;
- reminders;
- business/tax settings;
- CA/export centre; and
- help/support.

Early intelligence can show invoiced sales, collections, unpaid/overdue amount, aging, recorded sales GST, customer ranking, and supported period trends. All numbers come from deterministic queries and are labelled Complete, Partial, Estimated, or Unavailable. Do not show profit, cash balance, or final tax payable from incomplete books.

CA mode supplies owner-approved read-only access or a dated package containing CSV (XLSX desirable), masters, invoice/note register, payments/allocations, aging, tax summary, PDFs, audit/change report, and exceptions/incompleteness.

## 13. Phase 10 — voice beta

Voice is an input to the same command pipeline, not a separate product.

1. Record/upload voice note.
2. Check file type/size/malware and apply retention policy.
3. Transcribe with confidence/timing data where available.
4. Show transcript to user.
5. Highlight low-confidence financial fields.
6. Extract the structured command.
7. Use the normal preview/confirmation flow.

With consent, benchmark roughly 200 real utterances across noise, accents, English/Hindi/Hinglish, local names, item names, numbers, and corrections. Compare OpenAI transcription and relevant Indic providers such as Sarvam or BHASHINI-compatible services for number/currency accuracy, proper nouns, code-switching, latency, cost, data terms, uptime, and switching ease.

Do not build real-time spoken conversation in MVP. Voice notes are easier to verify and better aligned with existing behaviour.

## 14. Phase 11 — production hardening

### Tests

- tax/money/state/permission unit tests;
- CA-approved golden GST tests;
- AI command evaluations;
- mobile end-to-end journeys;
- tenant isolation;
- concurrency, duplicate, retry, and idempotency;
- webhook signature and replay;
- import/export reconciliation;
- backup restore and disaster recovery;
- accessibility/low bandwidth;
- dependency/secret scanning; and
- penetration testing before broad launch.

### Operations and documents

- masked, audited support console;
- severity/escalation rota and incident/breach runbook;
- provider-outage playbooks and safe failed-job replay;
- calculation-rule change/release process;
- backup/business-continuity procedures;
- monthly cost/unit-economics dashboard;
- terms, privacy, data/subprocessor disclosures, retention/deletion, acceptable use;
- support statement, transparent pricing/refunds/cancellation; and
- AI/completeness disclaimers.

## 15. Phase 12 — concierge pilot

Use 10 businesses from one segment/city with at least 20 invoices/month, repeat customers, material credit, daily WhatsApp use, and willingness to use real invoices.

### Setup week

- pilot/data agreement;
- owner-verified business/tax profile;
- 10 customers and common items loaded;
- opening receivables entered;
- test invoice created and correctly cancelled;
- reminder/payment preferences set;
- baseline measured; and
- owner trained in under 30 minutes.

### Two active-use weeks

Each business creates at least five real invoices, records available payments, queries receivables at least three times, shares a payment request/reminder, reviews a weekly summary, and exports once for the CA.

Keep human support available but classify and measure every support minute: onboarding, misunderstanding, defect, bad data, or missing feature.

### Pilot pass gate

At least 6 of 10 must create five real invoices, maintain receivables in-product, record a payment or share a reminder, report measurable value, and agree to pay ₹299–₹499/month. Also require zero critical tax defects, less than 2% corrected financial writes after confirmation, at least 7/10 retained in week two, and a path below 10 support minutes/account/week after onboarding.

If this fails, diagnose or change the wedge. Do not disguise weak demand with inventory, payroll, lending, or feature volume.

## 16. Phase 13 — paid MVP

After the pilot passes, add subscription billing, invited/self-serve onboarding, safe CSV import, recovery, product analytics, support/education, cost limits, export/closure flow, uptime communication, and CA/referral onboarding.

### Pricing experiment

- Collect: approximately ₹399–₹499/month;
- Business: approximately ₹799–₹999/month;
- automation/compliance/provider-cost add-ons priced separately.

These are hypotheses. Track gross margin after AI, voice, WhatsApp, payment, storage, support, refunds, and partner commission. Early support labour is likely more important than token cost.

Track activation, first-invoice time, weekly retention, invoices, active receivables, payment/reminder use, correction/defect rates, CA exports, support minutes, margin, conversion, churn, and referrals.

## 17. Phase 14 — selective automation

### WhatsApp Business Platform

Only after written policy/provider validation and demand, add per-merchant signup, merchant-owned number where feasible, consent, utility templates, delivery/failure callbacks, scheduling, quiet hours, opt-out, frequency caps, quality monitoring, kill switch, and PWA fallback.

### Payment reconciliation

Only where benefit exceeds fees/complexity, add merchant-owned provider connection, hosted link, verified webhook, idempotent allocation, refund/reversal/dispute handling, unmatched-payment queue, and settlement reconciliation. The company still does not handle merchant funds.

## 18. Phase 15 — expansion

Likely evidence-led sequence:

1. quotations and quote-to-invoice;
2. recurring invoices;
3. credit notes/sales returns;
4. simple purchases/expenses;
5. multi-user roles/approvals;
6. basic quantity inventory for selected traders;
7. authorised bank/payment reconciliation;
8. reviewed e-invoice/e-way-bill integration for applicable users;
9. languages chosen by cohort demand; and
10. vertical workflows.

Full accounting, GST return filing, inventory valuation, payroll, lending, automated statutory remedies, and autonomous legal notices require separate product, compliance, support, and economics gates.

## 19. Team requirements

### Lean pilot team

- founder/product owner — discovery, prioritisation, sales, partnerships;
- senior full-stack engineer — PWA, API, integrations, delivery;
- backend/financial-systems engineer — tax, ledger, security, data model (possibly the same senior engineer initially, with independent review);
- fractional product designer/researcher;
- QA/automation support, heavier before pilot;
- retained practising CA/GST adviser with release sign-off;
- milestone-based India privacy/technology counsel;
- security adviser/tester;
- onboarding/support operator before real-data pilot; and
- founder-led sales and CA/channel development.

One developer can make a demo. A real financial product needs independent review, testing, compliance input, and operational ownership.

## 20. Budget requirements

Budget for customer research/travel, design, engineering/QA, CA review, legal/privacy/trademark, security, cloud/database/backups, AI/transcription, later WhatsApp/BSP, payment costs, monitoring/helpdesk, onboarding, sales commissions, regulatory/provider contingency, and 6–9 months of runway.

Prepare three scenarios: founder-built lean pilot, small in-house team, and outsourced build. An agency estimate must explicitly include financial test cases, auditability, security, migration, operations, source-code ownership, documentation, and post-launch defect support.

## 21. Definition of ready for controlled paid launch

- one segment repeatedly uses it for real invoices;
- CA-approved calculations have zero critical defects;
- every financial write is confirmed, idempotent, authorised, and audited;
- PDFs and ledger balances reconcile;
- create/share/collect/query/remind/export works end to end;
- voice errors cannot silently post transactions;
- company never handles merchant funds;
- privacy, retention, incident, support, and recovery processes work;
- PWA works without automated WhatsApp;
- at least six pilot users agree to pay; and
- support effort fits subscription economics.

The product is then launched, not permanently finished. Further modules follow evidence.

## 22. Immediate next 30 days

### Week 1

- appoint product/compliance owners and choose one city;
- retain a CA adviser;
- recruit the first 15 interviewees;
- prepare consent and scorecard;
- create the one-page WhatsApp workflow for BSP review;
- begin name/trademark screening.

### Week 2

- conduct 10 interviews and two observations;
- interview two CAs;
- build the clickable prototype;
- draft 50 GST golden cases;
- shortlist cloud, AI, voice, and payment options without long contracts.

### Week 3

- conduct 10 more interviews and two observations;
- test the prototype with five owners;
- revise the ICP;
- obtain BSP/legal feedback;
- recruit design partners.

### Week 4

- complete 30 interviews and five observations;
- score segments and choose one or stop/pivot;
- secure 10 pilot commitments;
- freeze MVP/out-of-scope;
- approve architecture and budget.

Production development begins only after this evidence gate.

## 23. First engineering sprint after the gate

The first two-week sprint delivers repository/CI/staging/monitoring/secrets, tenant/user/business/customer/item schemas, onboarding skeleton, exact-decimal money and tax interfaces, the first 10 golden tests, typed `create_invoice` schema, audit infrastructure, and a mobile invoice form without AI.

Only after the invoice can be created, calculated, confirmed, and audited without AI should AI extraction be connected.
