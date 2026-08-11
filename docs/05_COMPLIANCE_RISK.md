# Compliance and risk blueprint

This is a product-planning document, not legal or tax advice. Before production, Indian counsel and a practising CA/GST professional should review the exact product, contracts, invoice formats, data flows, marketing claims, and partner arrangements.

## Regulatory posture

Design the company as:

- a software provider and data processor/fiduciary as applicable;
- an application/service provider connecting through authorised GST channels when added;
- a technology layer connecting merchants to authorised payment providers;
- a merchant-communications tool using official WhatsApp mechanisms;
- not a payment aggregator, wallet, lender, tax practitioner, or law firm.

## GST

### Invoice requirements

The invoice engine must support current mandatory particulars and document-specific rules. Product implementation needs a maintained matrix for:

- tax invoice;
- bill of supply;
- receipt/payment/refund voucher where later supported;
- credit/debit note;
- revised invoice;
- export/SEZ scenarios;
- reverse charge;
- composition/unregistered supplier treatment;
- B2B/B2C and recipient details;
- place of supply and intra/inter-state tax;
- HSN/SAC and tax-rate applicability;
- invoice numbering per financial year;
- signature/authorisation and required declarations.

Controls:

- version tax rules by effective date;
- have a CA approve golden scenarios;
- never let the LLM silently decide classification/rate;
- display “suggested—confirm” for new HSN/SAC/rates;
- block a non-registered supplier from collecting GST;
- preserve original posted document and amendment trail;
- use credit/debit/cancellation workflows rather than overwrite.

### E-invoicing

The notified aggregate-turnover threshold has been ₹5 crore since 1 August 2023 for covered taxpayers, measured using applicable preceding-year rules. Applicability and exemptions must be checked per taxpayer.

Do not describe an ordinary PDF as a government e-invoice. A valid e-invoice workflow requires reporting to an Invoice Registration Portal and receiving an IRN and signed QR data.

Implementation path:

1. integrate through a GST Suvidha Provider/authorised IRP;
2. use sandbox and production onboarding;
3. store taxpayer authorisation and credential references securely;
4. validate schema before submission;
5. handle IRN generation, failure, cancellation windows, and duplicate document rules;
6. preserve provider response and audit linkage;
7. show explicit status: draft / invoice issued / IRN registered / failed / cancelled.

### E-way bills

The general statutory trigger concerns movement of goods with consignment value exceeding ₹50,000, with exceptions and state/scenario nuances. E-way capability requires consignor/consignee, document, goods, distance, transporter/vehicle and movement data.

Do not auto-generate merely from invoice value. Ask whether goods are moving, who is responsible, and capture the required transport facts. Integrate through an authorised route and expose status/errors.

### Returns and CA claims

MVP exports may prepare data but do not constitute filing. If return filing is later offered:

- use a GSP/authorised workflow;
- obtain explicit taxpayer authorisation;
- implement review/approval and OTP/credential controls;
- record exact payload, acknowledgement, period, and status;
- provide correction/reconciliation workflow;
- define professional responsibility and support boundaries in contract;
- carry appropriate insurance where advised.

### Records and audit trail

GST rules require electronic edit/delete logs and the ability to produce audit inter-linkages. Section 36 generally requires records for 72 months from the due date of the annual return, longer in specified proceedings.

Product baseline:

- no destructive edits of posted financial documents;
- append-only event history;
- document versions linked to source and actor;
- backups and tested restoration;
- exports in human- and machine-readable formats;
- retention hold for dispute/audit/legal proceedings;
- per-tenant retention schedule;
- clearly distinguish user-requested account closure from legally required record retention.

## Payments and UPI

### Safe model

The merchant contracts with an acquiring bank or RBI-authorised payment aggregator. Funds flow from customer to merchant through that regulated system. The product receives status/data under merchant authorisation.

### Prohibited/avoid

- collecting customer money into the startup’s account and settling later;
- pooling merchant funds;
- using one merchant account for many unrelated businesses;
- acting as an undisclosed sub-aggregator;
- storing UPI PIN or bank credentials;
- claiming a payment is final based only on client-side redirect or screenshot;
- adding undisclosed customer convenience charges;
- initiating refunds outside provider controls and approvals.

### QR and reconciliation disclosure

Direct UPI QR/intent:

- prefilled amount/reference is convenience, not guaranteed reconciliation;
- label status “awaiting confirmation” until verified/recorded;
- do not imply that a QR is a Razorpay/Cashfree/provider link unless it is.

Provider mode:

- merchant KYC/onboarding is performed by provider;
- signed webhooks and fetch verification;
- provider fees, settlement times, disputes, refunds, and restricted categories disclosed;
- invoice payment status separated from provider settlement status;
- reconciliation exceptions visible.

UPI Collect behaviour has changed, with providers directing most flows toward intent or QR. Integration choices must use current NPCI/provider guidance rather than historical VPA collect assumptions.

## WhatsApp

### Official access only

Use the WhatsApp Business Platform/Cloud API or approved partner capability. Do not automate WhatsApp Web, use unofficial reverse-engineered libraries, share accounts, or simulate human interaction.

### Merchant onboarding

For automated customer messages:

- merchant owns/controls the business identity and number;
- complete Meta embedded signup/business verification as required;
- obtain merchant authorisation;
- configure profile and support contact;
- evaluate Business App/Platform coexistence for businesses needing phone use;
- store platform identifiers separately from phone number because identity capabilities evolve.

### Consent and messaging

- store customer opt-in proof, source, scope, time, and language;
- initiate platform messages only with currently permitted templates/categories;
- utility reminders must remain transactional and specific, not hidden marketing;
- honour stop/opt-out immediately;
- cap frequency and provide quiet hours;
- monitor block/report/quality signals;
- give merchant a preview and audit trail;
- do not expose another customer’s data or internal notes;
- keep current message pricing and policy in configuration.

### AI-policy dependency

Current WhatsApp terms restrict using the Business Platform to distribute general-purpose AI assistants, while business-scoped customer support/order/transaction automation remains broadly contemplated. This product’s owner-facing assistant is task-specific, but it is unusual because the small business owner is conversing with the software provider’s bot to operate the owner’s books.

Before building around this:

1. prepare a one-page exact workflow and data-flow description;
2. obtain a written assessment from a Meta Tech Provider/BSP and counsel;
3. test onboarding and production messaging with an approved account;
4. keep the assistant constrained to merchant business operations;
5. make the PWA a complete alternative channel;
6. avoid positioning as a general AI chatbot.

### Platform competition

Meta launched Business AI for Indian small businesses in 2026 and plans/has introduced deeper UPI support. The product must not depend on generic FAQ/customer-service automation as differentiation. Its value lies in books, receivables, GST controls, exports, and cross-system workflows.

## Data protection: DPDP

The Digital Personal Data Protection Rules 2025 were notified with phased commencement. Product readiness should be built before the relevant provisions become applicable rather than waiting for enforcement dates.

### Data roles and mapping

Potential personal data includes:

- owner/staff identity and contact;
- customer names, phones, addresses, GST-linked contact data;
- chat messages and voice;
- invoice/payment metadata;
- device/IP/security logs;
- support recordings;
- CA/partner details.

Map purpose, legal basis/consent where applicable, controller/fiduciary versus processor role, source, fields, vendors, location, retention, and deletion rule.

### Product requirements

- clear, plain-language notice in relevant languages;
- purpose limitation and data minimisation;
- specific consent where relied upon and easy withdrawal;
- merchant attestation/contract for customer data uploaded;
- access/correction/grievance/erasure request process;
- reasonable security safeguards: encryption, access controls, monitoring, backups, processor contracts;
- breach detection and response;
- subprocessor and cross-border-transfer review;
- retention only as needed, subject to GST/legal requirements;
- no reuse of invoice/chat data to train general models by default;
- separate optional consent for product-improvement datasets, preferably de-identified.

### Breach response

Maintain one incident process that can meet both DPDP and CERT-In obligations. DPDP materials contemplate prompt notice to affected data principals and the Board, with detailed follow-up within the specified period; CERT-In directions include rapid reporting for covered incidents.

Prepare:

- incident severity matrix;
- 24×7 escalation contacts;
- evidence/log preservation;
- affected-data/tenant identification;
- notification templates;
- provider coordination;
- tabletop exercises;
- decision log and remediation tracking.

## CERT-In and cybersecurity operations

CERT-In directions apply logging and cyber-incident obligations to covered Indian entities, including a rolling 180-day ICT log requirement in Indian jurisdiction and rapid reporting of specified incidents.

Operational checklist:

- designate point of contact;
- synchronise systems to approved time sources;
- retain required security/application/network/cloud logs securely in India for at least the applicable rolling period;
- redact secrets and minimise unnecessary personal content in logs;
- maintain reportable-incident runbook and contact methods;
- ensure cloud/processor contracts support evidence access;
- test incident reporting workflow;
- distinguish financial audit history, GST records, and security logs because they have different purposes and retention.

## Consumer protection and claims

Avoid:

- “100% GST compliant” as an unconditional promise;
- “guaranteed faster payment”;
- “profit” when based on invoices only;
- “bank-grade security” without a defined, substantiated standard;
- dark patterns in trial conversion, consent, or cancellation;
- hidden message/payment charges;
- pretending AI text is CA/legal advice;
- aggressive reminder language that could constitute harassment or misrepresentation.

Use:

- “helps create GST-ready invoices, subject to your confirmed details”;
- explicit status and completeness labels;
- plain cancellation/refund policy;
- invoice/payment dispute workflow;
- human support path;
- transparent AI disclosure where material.

## Professional and partner governance

Contracts should cover:

- merchant data ownership and licence to process;
- merchant responsibility for supplied tax/business facts;
- product responsibility for calculation according to configured/current rules;
- availability and support;
- subprocessors and security;
- payment/WhatsApp/GSP third-party terms;
- exports and termination assistance;
- incident and breach cooperation;
- acceptable use and prohibited businesses;
- liability caps and exceptions advised by counsel;
- dispute resolution and governing law;
- CA/referral partner claims and conduct.

## MSME status and delayed-payment features

Do not tell every user that the 45-day remedy, interest entitlement, Samadhaan/ODR route, section 43B treatment, or TReDS access automatically applies. Eligibility depends on current law, Udyam status, enterprise classification, activity, buyer, transaction, and procedural facts. Ministry guidance has specifically distinguished trading-only registrations for some delayed-payment protections.

If the product later offers an “MSME protection” workflow:

- verify Udyam status and activity with user consent;
- show an eligibility checklist, not a legal conclusion;
- preserve invoice, acceptance/delivery, contract, reminder, and payment evidence;
- refer the user to a qualified professional or official portal;
- never calculate statutory interest or file an ODR/Samadhaan matter autonomously without a reviewed, current rules engine and explicit approval;
- version guidance and official links by effective date.

## Risk register

| ID | Risk | Likelihood | Impact | Control | Owner |
|---|---|---:|---:|---|---|
| R-001 | Incorrect tax/total from AI | Medium | Critical | deterministic engine, confirmation, golden tests | Product/engineering |
| R-002 | Duplicate invoice/payment from retries | Medium | Critical | idempotency, unique keys, transactional outbox | Engineering |
| R-003 | WhatsApp account restriction/policy shift | Medium-high | High | official API, policy review, PWA fallback, kill switch | Product/legal |
| R-004 | Customer reminder sent without valid consent | Medium | High | consent registry, manual share MVP, template policy | Operations/legal |
| R-005 | Startup inadvertently acts as PA/sub-aggregator | Low-medium | Critical | merchant-owned provider accounts, no fund flow | Finance/legal |
| R-006 | QR payment incorrectly marked paid | Medium | High | verified webhook/fetch or explicit user record | Engineering |
| R-007 | Data breach of financial/customer records | Medium | Critical | security baseline, monitoring, incident response | Security |
| R-008 | False BI/profit due incomplete books | High | High | completeness labels, suppress profit | Product |
| R-009 | GST records deleted on account closure | Low | High | legal retention schedule and hold | Compliance |
| R-010 | Support staff accesses tenant data improperly | Medium | High | JIT approved access, audit, masking | Operations/security |
| R-011 | Vendor uses data for model training | Medium | High | contracts, zero-retention options, redaction | Legal/engineering |
| R-012 | Brand conflict over “Munim” | High | Medium | trademark/name clearance and rebrand | Founder/legal |
| R-013 | Reminder wording damages customer relationship | Medium | Medium | tone controls, preview, dispute suppression | Product |
| R-014 | Tax rule/rate change not deployed in time | Medium | Critical | rule feed, effective dating, CA release sign-off | Compliance/engineering |

## Pre-production sign-offs

### Tax/CA

- invoice-type matrix;
- 50+ tax scenarios;
- PDF fields and declarations;
- credit/cancellation rules;
- export schema and completeness statement;
- marketing language.

### Legal/privacy

- terms and privacy notice;
- DPDP data map and contracts;
- WhatsApp exact use case and AI terms;
- payment model and provider agreements;
- partner/referral agreement;
- retention/deletion policy;
- incident notification runbook;
- brand/trademark search.

### Security

- threat model;
- tenancy/authorisation tests;
- secret/key management;
- backup restore;
- webhook security;
- audit log integrity;
- logging/residency/retention;
- penetration test before broad launch;
- incident tabletop.

## Regulatory update cadence

Assign a named owner and review monthly during build, then at least quarterly:

- CBIC/GST Council/GSTN advisories;
- e-invoice/IRP and e-way changes;
- WhatsApp pricing, templates, AI terms, and identity changes;
- NPCI/RBI payment rules and provider terms;
- DPDP commencement/Board guidance;
- CERT-In directions;
- MCA/accounting audit requirements for company customers;
- MSME delayed-payment/ODR/TReDS changes.

Every rule change should create a tracked product impact assessment, effective-date test, release decision, and customer communication where needed.
