# MVP product requirements

## Product definition

**Working name:** Project Munim (not a cleared brand)  
**Release:** Concierge pilot / MVP v0  
**Primary outcome:** Reduce the time from agreed sale to sent invoice, and reduce overdue receivables.  
**Primary user:** Owner/operator of a GST-registered or GST-ready B2B service/trade business.

## Product promise

The user can say or type:

> “Sharma Traders ka invoice bana do, 25 boxes, ₹850 each, GST 18%, payment 15 din mein.”

The system responds with a structured draft, highlights any missing or uncertain field, asks for confirmation, creates a compliant PDF, stores the customer and receivable, and offers a UPI request plus a merchant-controlled WhatsApp share action.

## Success metrics

### North-star metric

**Monthly active receivables under management (MARUM):** total unpaid/part-paid invoice value for businesses that performed at least one meaningful action in the last 30 days.

This is better than message count or invoices generated because it measures whether the product has become the owner’s working collection system.

### Pilot metrics

| Metric | Pilot pass threshold |
|---|---:|
| Qualified businesses activated | 8 of 10 |
| Time to first real invoice | <15 minutes after onboarding |
| Median invoice draft-to-send time | <60 seconds for a repeat customer/item |
| Real invoices per active business in 14 days | ≥5 |
| Businesses with a recorded payment or reminder | ≥6 of 10 |
| Financial write correction rate | <2% after confirmation |
| Tax/total calculation defect | 0 critical defects |
| Week-two retained businesses | ≥7 of 10 |
| Willing to pay ₹299–₹499/month | ≥6 of 10 |
| Median assisted support | <30 min in week one; <10 min/week thereafter |

### Later SaaS metrics

- activation rate;
- weekly retained businesses;
- invoices per active business;
- receivable value and aging distribution;
- reminder-to-payment conversion;
- median days sales outstanding change for stable cohorts;
- CA exports per month;
- gross revenue retention and net revenue retention;
- support minutes per account;
- gross margin after messaging/AI/voice/storage/support;
- referral rate.

## User qualification

The pilot user must satisfy at least six criteria:

1. sends 20–200 invoices/month;
2. owner participates in billing or collections;
3. has at least 10 repeat customers;
4. gives credit or milestone terms;
5. has at least ₹50,000 currently outstanding;
6. uses WhatsApp with customers daily;
7. uses paper/Excel/Word/basic billing rather than a deeply integrated ERP;
8. can provide five sample invoices and customer consent for pilot communications;
9. agrees to weekly feedback;
10. is willing to pay if agreed success criteria are reached.

## Core jobs and workflows

### 1. Onboard the business

Inputs:

- legal/trade name, address, state, PIN;
- GST registration status and GSTIN where applicable;
- invoice prefix and financial-year sequence;
- default payment terms;
- logo/signature optional;
- merchant UPI ID or connected authorised provider;
- Udyam details optional;
- starting invoice number and opening receivables;
- CA/bookkeeper contact or export preference.

Controls:

- validate GSTIN format and, when available, status through an authorised/official lookup;
- make the user attest that details are accurate;
- show GST/non-GST/composition choices in plain language;
- never allow an unregistered supplier to add GST as tax;
- generate a preview invoice before first use.

### 2. Create an invoice from text

Example:

> “ABC Services ko website maintenance August, 35,000 plus GST 18%, due 25 August.”

Processing:

1. language detection and entity extraction;
2. match or propose customer;
3. match item/service and saved price/tax mapping;
4. identify intra/inter-state context;
5. calculate tax and total deterministically;
6. show structured preview;
7. ask only for unresolved required fields;
8. require confirmation before posting;
9. allocate invoice number atomically;
10. generate PDF and receivable entry.

### 3. Create from voice

Voice is transcribed and then follows the identical text workflow. The transcript is displayed. Low-confidence names, quantities, prices, dates, GST rates, and negations are highlighted and require confirmation.

Money and quantity values should be read back in both numerals and short words where useful, e.g. “₹85,000 — pachasi hazaar.”

### 4. Share and collect

MVP:

- invoice PDF;
- merchant UPI QR/intent or merchant-owned payment link;
- customer phone selection;
- prewritten WhatsApp message;
- explicit “Share from my WhatsApp” action;
- share event logged, but not treated as delivery/read proof unless the platform provides it.

Later:

- per-merchant WhatsApp Business Platform embedded signup;
- consent record;
- approved utility templates;
- delivery/failure webhooks;
- scheduled reminders;
- handoff and stop/unsubscribe state.

### 5. Record payment

Supported states:

- unpaid;
- partially paid;
- paid;
- overdue;
- written off (privileged action);
- disputed;
- cancelled through the correct document flow.

Payment sources:

- manual cash/UPI/bank/cheque entry;
- verified payment-provider webhook;
- later, verified bank feed/reconciliation.

Rules:

- never infer paid status from a screenshot alone;
- payment webhook signature verification is mandatory;
- duplicate webhooks must not duplicate receipts;
- partial payments create a remaining balance;
- reversal/refund events reverse or adjust the receipt through a traceable entry;
- edits do not overwrite prior history.

### 6. Ask about receivables

Examples:

- “Rahul ka kitna pending hai?”
- “30 din se zyada overdue dikhao.”
- “Kal kisko reminder bhejna hai?”
- “Is month kitna collect hua?”

The answer must be generated from deterministic queries. The LLM can explain and format results but may not invent or approximate figures.

### 7. Send a reminder

MVP produces a draft with invoice number, amount, due date, payment method, and tone. The user reviews and taps to share.

Tone options:

- friendly before due date;
- polite on due date;
- firm after 7/15/30 days;
- dispute-aware, which suppresses normal reminders;
- never threatening or legally misleading.

### 8. CA export

One action creates a dated export package containing:

- business profile;
- customer master;
- item/service master and HSN/SAC/tax mapping;
- invoice register;
- credit/debit notes;
- payments/receipts;
- receivables aging;
- tax summary;
- source PDFs;
- audit/change log;
- completeness and exception report.

CSV is required. XLSX is desirable. The export must declare what is not included and that it is not a filed return or audit opinion.

## MVP scope

### Must have

- English, Hindi, and common Hinglish text input;
- voice note transcription beta;
- one business/GSTIN per account;
- customer and item/service memory;
- B2B and B2C tax invoice basics;
- CGST/SGST/IGST logic based on confirmed place of supply;
- discounts and round-off;
- tax-inclusive and tax-exclusive pricing;
- invoice PDF;
- UPI QR/intent;
- unpaid/part-paid/paid ledger;
- manual WhatsApp share;
- reminder drafts;
- aging and collection summaries;
- CA export;
- role: owner plus optional read-only CA;
- append-only audit events;
- data export and account deletion request workflow.

### Should have after pilot

- quotations and quote-to-invoice;
- recurring invoices;
- imports from CSV/Excel;
- credit notes and sales returns;
- multiple staff roles;
- payment-provider webhooks;
- simple purchase/expense capture;
- WhatsApp API onboarding for automated utility reminders;
- offline draft queue in PWA;
- more Indic languages based on cohort demand.

### Explicitly out of scope for MVP

- GST return filing;
- e-invoice IRN generation;
- e-way bills;
- input tax credit reconciliation;
- full double-entry accounting reports;
- definitive profit/P&L;
- bank account aggregation;
- automatic inventory valuation;
- POS/barcodes/thermal printer guarantees;
- payroll;
- lending, escrow, wallet, or pooled settlement;
- autonomous legal notices or ODR/Samadhaan filing;
- promotional broadcasts.

## Required invoice capabilities

The invoice service must support the relevant mandatory particulars, including supplier identity/GSTIN, unique financial-year sequence, issue date, recipient identity/GSTIN when applicable, place/state details, HSN/SAC, description, quantity/unit for goods, taxable value, tax rate and amount, total, reverse-charge indication where relevant, and signature/authorisation presentation.

Exact fields vary by invoice type and current law. A CA/GST practitioner must approve the implementation matrix before production.

## Conversation and confirmation design

### Typed command object

Every AI interpretation resolves to a versioned command schema, for example:

```json
{
  "intent": "create_invoice",
  "customer_candidate_id": "cus_123",
  "invoice_date": "2026-08-11",
  "due_date": "2026-08-26",
  "items": [
    {
      "description": "Boxes",
      "quantity": "25",
      "unit_price_minor": 85000,
      "tax_rate_bps": 1800,
      "price_includes_tax": false
    }
  ],
  "uncertain_fields": []
}
```

All money uses integer minor units or an exact decimal type; never binary floating point.

### Confirmation policy

Confirmation is required for:

- all first-time invoice posts;
- new/changed customer identity or GSTIN;
- tax rate/HSN/SAC not previously confirmed;
- inter-state/place-of-supply ambiguity;
- discounts, credit notes, write-offs, cancellations, refunds;
- payment recording unless it comes from a verified webhook;
- any low-confidence number/date/negation.

The system may support a “fast confirm” mode for exact repeat transactions only after sufficient trust, while still showing the full summary.

## Data model: minimum entities

- tenant/business;
- user and role;
- business tax registration;
- customer/contact/address/tax registration;
- item or service and tax mapping;
- quote;
- invoice, immutable invoice version, and line items;
- credit/debit note;
- payment request;
- payment/receipt/allocation/reversal;
- receivable balance projection;
- message/reminder/consent state;
- generated document;
- command interpretation and confirmation;
- audit event;
- integration credential reference;
- export job;
- completeness/exception flag.

## AI versus deterministic boundary

| AI may do | Deterministic service must do |
|---|---|
| detect intent and language | invoice numbering |
| transcribe and transliterate | money arithmetic and rounding |
| identify likely customer/item | tax calculation and validations |
| extract quantity, date, and price candidates | ledger posting and balance computation |
| ask a natural clarification | permissions and approval rules |
| draft reminder wording | webhook verification and idempotency |
| explain queried results | reporting query and aggregation |
| suggest possible HSN/SAC | legal record retention and audit history |

## Analytics truth labels

Each financial insight must carry an internal completeness state:

- **Complete:** all necessary sources for the period are reconciled;
- **Partial:** based only on invoices/recorded payments;
- **Estimated:** explicit model/assumption shown;
- **Unavailable:** insufficient data.

For MVP, show:

- invoiced sales;
- collected amount;
- unpaid and overdue amount;
- customer aging;
- tax collected on recorded sales.

Do not show “net profit” or “cash balance.”

## Non-functional requirements

- multi-tenant isolation enforced at the database policy/application boundary;
- encryption in transit and at rest;
- secrets in managed secret storage, never logs;
- append-only financial audit events;
- daily backups and tested restore;
- invoice and payment write idempotency;
- 99.9% monthly target after beta;
- graceful queueing when WhatsApp/payment/GST providers fail;
- exportable data without vendor lock-in;
- Indian-jurisdiction ICT log retention aligned with CERT-In requirements;
- GST record retention policy aligned with the applicable 72-month rule;
- observable but privacy-minimised prompts and tool calls;
- human support and incident runbook.

## Release gates

### Gate A: prototype

- 30 interviews complete;
- five observed current-state workflows;
- exact first ICP selected;
- WhatsApp policy route reviewed;
- prototype tests achieve 80% task completion without coaching.

### Gate B: concierge pilot

- CA-approved invoice templates and tax scenarios;
- 50 golden test conversations;
- no autonomous writes;
- manual share and payment entry;
- data processing notice and terms ready;
- support owner assigned.

### Gate C: paid MVP

- pilot thresholds met;
- 200+ real invoices with zero critical tax/arithmetic defects;
- restore and export tested;
- production security review complete;
- WhatsApp and payment partner contracts/policies confirmed;
- pricing includes measured support and messaging costs.

### Gate D: automation

- per-merchant WhatsApp onboarding success proven;
- consent/template/quality controls operational;
- provider webhook reconciliation passes duplicate/reversal tests;
- automation can be paused instantly by merchant and platform controls.
