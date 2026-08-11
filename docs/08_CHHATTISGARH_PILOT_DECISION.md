# Chhattisgarh pilot decision

**Decision date:** 11 August 2026  
**Status:** Accepted as a discovery hypothesis; customer validation still required

## Decision

- Launch-market boundary: **Chhattisgarh**.
- First field cluster: **Raipur–Durg–Bhilai**.
- Expansion candidate after the first gate: **Bilaspur**.
- First customer hypothesis: **GST-registered, owner-led industrial service contractors and small fabricators**.
- First product wedge: **invoice-to-cash**, not inventory, bookkeeping, return filing, or full ERP.

Choosing a state is sensible for positioning, partnerships, and eventual distribution. Day-one field operations still need a compact cluster: a state-wide pilot would dilute interviews, onboarding, referrals, and support.

## Why this cluster

Chhattisgarh's MSME Strategic Investment Plan reports that Raipur, Durg, and Bilaspur together account for roughly 42% of the state's Udyam registrations, with Raipur the largest district concentration. The state's Industrial Development Policy 2024–30 explicitly covers engineering/fabrication and other service activity and prioritises industrial development and local enterprise.

Sources:

- [Chhattisgarh Strategic Investment Plan under RAMP](https://ramp.msme.gov.in/ramp/pdf-documents/sip-states/Chhattisgarh.pdf)
- [Chhattisgarh Industrial Development Policy 2024–30](https://www.invest.cg.gov.in/policy-documents/402/view)
- [Chhattisgarh MSE Facilitation Council](https://invest.cg.gov.in/facilitation-council)

These sources justify where to investigate; they do not prove product-market fit. Only observed workflows and repeated real usage can do that.

## Exact initial customer profile

Prioritise businesses such as:

- electrical, machinery, pump, HVAC, solar, CCTV, fire-safety, and equipment service contractors;
- installation, annual-maintenance, repair, and small-project vendors;
- machining, welding, and light fabrication job shops that bill other businesses;
- GST-registered owner-led teams with roughly 20–150 invoices per month;
- businesses with at least 10 repeat B2B customers and meaningful credit sales/outstanding payments;
- owners currently using WhatsApp plus paper, Excel, a basic billing app, or a partly outsourced accounting process.

Prefer candidates whose owner still approves invoices or personally chases payments and who can quantify at least ₹1 lakh of recurring receivables. These are screening hypotheses, not permanent product restrictions.

## Exclude from the first pilot

- high-volume counter retail and restaurants requiring POS, barcode, or thermal-printer workflows;
- inventory-heavy distributors that cannot test value without purchase and stock modules;
- large manufacturers already embedded in ERP approval and integration processes;
- businesses demanding GST return filing, e-invoicing, e-way bills, or automated bank reconciliation as a prerequisite;
- non-GST, mostly cash businesses with very few invoices or receivables.

## First discovery sample

Interview 30 owners/operators:

- 20 from the target contractor/fabricator profile;
- 5 B2B traders/distributors as a comparison cohort;
- 5 agencies/professional services as a comparison cohort.

Within the 20 targets, cover several sub-verticals rather than assuming one is best. Observe at least five real invoice-and-collection workflows. Recruit 10 design partners only after scoring interviews; do not select them merely because they are friendly or enthusiastic.

Potential recruitment paths include local CAs/bookkeepers, industrial associations, supplier networks, industrial areas in the Raipur–Bhilai corridor, referrals, and direct field visits.

## CA involvement

Product development and customer discovery can continue before a CA is retained. AI and software can prepare:

- the deterministic calculation engine and automated tests;
- invoice-field and GST-rule checklists;
- a 50+ scenario golden-case review matrix;
- sample invoices, exports, audit records, and documented assumptions;
- an exception list for professional review.

A practicing CA or qualified GST professional should still review and sign off the production rules, invoice documents, cancellations/credit notes, edge cases, and export pack before real customer invoices are issued. The initial ask can be a narrow 2–4 hour review rather than an open-ended advisory engagement. Prefer someone serving contractor, fabrication, and industrial MSME clients in Raipur/Durg/Bhilai.

## AI and voice API staging

The current product does not need a paid AI API to operate. Its deterministic parser handles constrained typed examples, while exact money, GST, ledger writes, numbering, PDF creation, UPI QR creation, and receivables remain ordinary controlled software.

Add APIs in stages:

1. Run discovery and the local demo without an API key.
2. Collect 100–200 anonymised typed commands and corrections from target users.
3. Benchmark deterministic parsing against model-based structured extraction.
4. Add a text AI API only if it materially improves task completion, correction rate, or support time at an acceptable cost.
5. Collect consented, representative noisy voice samples and separately benchmark speech-to-text providers.
6. Keep financial calculation and posting outside the model; every draft remains reviewable and confirmable.

The existing code already contains an optional OpenAI structured-extraction adapter, so this capability can be enabled later with a server-side API key without redesigning the financial engine.

## Gate to proceed

Proceed beyond concierge pilot only if at least 6 of 10 qualified design partners:

- create five or more real invoices in two weeks;
- maintain receivables in the product rather than a parallel notebook;
- use at least one reminder/payment-request workflow;
- demonstrate measurable time saved or collection improvement; and
- agree to pay at least ₹299–₹499 per month.

Until then, the selected segment remains a strong hypothesis—not a proven market.
