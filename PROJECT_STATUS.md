# Project status

**Phase:** Strategy, discovery preparation, and working prototype  
**Status:** Research dossier and first runnable invoice-to-cash vertical slice complete; customer validation not started  
**Decision confidence:** Medium — strong secondary evidence, no project-specific primary interviews yet  
**Last updated:** 11 August 2026

## One-sentence thesis

A WhatsApp-shaped invoice-to-cash assistant can win among Indian owner-led micro businesses if it saves time and accelerates collections without asking them to learn accounting software.

## Decisions made

| ID | Decision | Reason | Status |
|---|---|---|---|
| D-001 | Lead with invoice-to-cash, not full ERP | Highest-frequency visible value with bounded compliance risk | Accepted |
| D-002 | Target owner-led B2B services/trade before counter retail | Receivables and WhatsApp workflows are stronger; POS and barcode needs are lower | Accepted |
| D-003 | Use AI only for interpretation and explanation | Tax, totals, ledger writes, numbering, and payment state require deterministic controls | Accepted |
| D-004 | Manual “tap to share” reminders in the first pilot | Avoid per-merchant WhatsApp API onboarding and template friction before value is proven | Accepted |
| D-005 | Offer merchant-owned payment rails | Avoid becoming a payment aggregator or sub-aggregator; keep settlement with an authorised partner | Accepted |
| D-006 | Keep a PWA/web fallback | Reduces WhatsApp platform and policy concentration risk | Accepted |
| D-007 | Treat “AI Munim” as a concept, not cleared brand | Existing Indian products already use “Munim” prominently | Accepted |
| D-008 | Add CA export early; filing later | CA trust and distribution are valuable, while filing creates much higher support/compliance scope | Accepted |
| D-009 | Use Chhattisgarh as the initial market boundary | It is a focused, reachable state market with concentrated MSME clusters and a useful mix of industrial and service activity | Accepted |
| D-010 | Begin operations in Raipur–Durg–Bhilai, then test Bilaspur | A compact cluster makes field discovery, onboarding, referrals, and support practical | Accepted |
| D-011 | Start with industrial service contractors and small fabricators | They combine repeat B2B GST invoices, credit collections, WhatsApp workflows, and lower inventory/POS complexity | Accepted hypothesis; validate in interviews |
| D-012 | Keep the OpenAI API optional until a real-language benchmark justifies it | The deterministic demo works without it; API value should be measured against actual user commands and voice samples | Accepted |

## Open decisions requiring evidence

| ID | Question | Evidence needed | Owner | Due gate |
|---|---|---|---|---|
| O-002 | Is an owner-facing WhatsApp bot acceptable under current Meta AI terms? | Written view from Meta/BSP and counsel; production test account | Product/legal | Before WhatsApp-dependent build |
| O-003 | Do users prefer a shared assistant number or their own WhatsApp Business number? | Prototype tests and trust interviews | Product | Discovery sprint 2 |
| O-004 | Manual UPI marking vs gateway auto-reconciliation? | Willingness to pay and fee sensitivity at real invoice values | Product/finance | Pilot design |
| O-005 | Can ₹499/month sustain assisted onboarding and support? | Pilot support minutes, activation rate, churn intent | Finance | After 10 pilots |
| O-006 | Which Hindi/Hinglish/English ASR stack performs best on noisy trade vocabulary? | 200 utterance benchmark from target users | Engineering | Before voice beta |
| O-007 | Which contractor sub-vertical has the strongest repeatable pain? | At least 20 target interviews across electrical, machinery repair, fabrication, HVAC/pumps, solar/CCTV/fire-safety, and similar services | Founder | Discovery gate |

## Immediate next actions

1. Recruit 30 interviewees in Raipur–Durg–Bhilai: 20 target industrial service contractors/small fabricators, 5 B2B traders, and 5 agencies as comparison cohorts.
2. Observe five businesses create a real invoice and chase a real overdue payment.
3. Build a clickable conversation prototype, not production software.
4. Obtain a WhatsApp Tech Provider/BSP policy review of the exact owner-assistant workflow.
5. Recruit two CA/bookkeeper partners and test the proposed export pack.
6. Select 10 design partners using the qualification scorecard in the discovery guide.
7. Have the retained CA expand and sign off the initial calculation tests into the 50+ case production matrix.
8. After the discovery gate passes, replace the prototype persistence/authentication layer with PostgreSQL and production identity controls.
9. Collect 100–200 anonymised typed commands before paying for AI integration; add consented voice samples only in the dedicated voice benchmark.

The ordered delivery plan is maintained in [docs/07_END_TO_END_BUILD_ROADMAP.md](docs/07_END_TO_END_BUILD_ROADMAP.md).

## Changelog

### 2026-08-11

- Created the initial evidence-backed product strategy.
- Narrowed the wedge from broad accounting/ERP to invoice-to-cash.
- Defined the MVP, platform architecture, compliance posture, economics, and discovery gate.
- Identified WhatsApp policy dependence and payment reconciliation cost as the two largest platform risks.
- Added the end-to-end build roadmap from discovery through controlled paid launch and expansion.
- Built the first runnable product under `product/`: responsive PWA, safe conversational invoice draft, deterministic GST engine, confirmation and numbering, PDF, UPI QR, receivables, partial payments, CA export, and audit events.
- Added optional OpenAI structured extraction with a deterministic no-key fallback.
- Added seven financial-domain tests and completed production build plus isolated end-to-end API smoke testing.
- Visually verified desktop and 390 px mobile layouts with no browser console warnings/errors.
- Selected Chhattisgarh as the launch market, Raipur–Durg–Bhilai as the first cluster, and industrial service contractors/small fabricators as the first hypothesis to validate.
- Localised the demonstration business and same-state GST examples to Chhattisgarh (GST state code 22).
- Deferred paid AI/voice APIs until real user commands establish the accuracy and economic case; deterministic demo mode remains the default.
