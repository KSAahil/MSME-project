# Customer discovery and pilot guide

## Objective

Determine whether a specific group of Indian small-business owners will trust and pay for a conversational invoice-to-cash system. Discovery is not a feature-voting exercise. It must reveal current behaviour, economic pain, trust boundaries, and adoption friction.

## Sample plan

Interview 30 owners/operators in one city:

- 10 service contractors/maintenance/installers;
- 10 agencies/professional service firms;
- 10 B2B traders/distributors.

Within each cohort include:

- GST registered and a small number GST-ready/non-registered where relevant;
- Hindi/Hinglish/English variation;
- owner-only and small staff teams;
- paper/Excel/basic app users;
- at least two users of Vyapar/myBillBook/Tally to understand switching barriers;
- businesses with and without substantial credit sales.

Recruit through CAs, trade associations, supplier networks, and direct field visits. Do not recruit mainly through startup/social-media circles.

## Interview rules

- ask about the last real transaction, not hypothetical preferences;
- request permission to observe artefacts/screens; do not copy personal data unnecessarily;
- do not pitch in the first 25 minutes;
- record with explicit permission; otherwise take notes;
- never ask “Would you use an AI Munim?”;
- ask willingness to pay only after showing a realistic workflow;
- distinguish the user, buyer, influencer, CA, and customer recipient;
- log contradictions between stated and observed behaviour.

## 45-minute interview script

### Business context — 5 minutes

1. What do you sell, to whom, and how many people work in the business?
2. Roughly how many bills/invoices do you create in a normal month?
3. What proportion is paid immediately versus on credit?
4. Who creates invoices, tracks payments, and speaks to the CA?

### Last real invoice — 10 minutes

5. Please show or describe the last invoice you created from start to finish.
6. Where did the customer/order details first arrive—call, WhatsApp, paper, email, or elsewhere?
7. What did you retype? What did you have to look up?
8. How long did it take? What commonly goes wrong?
9. When is an invoice skipped or delayed?
10. Which parts require the owner even if staff do the work?

### Receivables and payment — 10 minutes

11. How do you know who owes you money today?
12. Show the last overdue payment you followed up on. How did you decide when and what to send?
13. What is the current total outstanding, approximately? How confident are you?
14. How are partial payments recorded?
15. How do you match a UPI/bank payment to a bill?
16. Tell me about the last payment you forgot to follow up or could not reconcile.
17. What makes reminders uncomfortable or damaging to the relationship?

### Current tools and trust — 8 minutes

18. Which apps/notebooks/Excel/Tally/CA process do you use, and what is each one for?
19. Have you tried and stopped using a billing/khata app? Why?
20. What would make you refuse to put business data into a new product?
21. Do customers expect messages from your own number? Would a different assistant number be trusted?
22. If the internet or WhatsApp is unavailable, what must still work?
23. Who must be able to export or take the data away?

### CA and compliance — 5 minutes

24. What do you send your CA each month/quarter? In what format?
25. What does the CA send back because something is missing or wrong?
26. Do e-invoice/e-way bill rules apply to you? How are they handled now?

### Prototype test — 7 minutes

Give a realistic prompt using their own product/service. Ask the participant to:

1. create the invoice;
2. correct one field;
3. confirm the total/tax;
4. share it;
5. ask what is outstanding;
6. send a reminder;
7. explain what they believe the system has stored.

Observe hesitation, correction needs, trust questions, and whether chat is actually faster than their current method.

Then ask:

- What part was valuable enough to change your current process?
- What would prevent you from using it for every invoice next week?
- Would you start a two-week pilot using real invoices?
- If it achieves [specific agreed result], would you pay ₹499/month? Why or why not?

## CA/bookkeeper interview

1. How many micro/small business clients send unstructured records?
2. What files/messages do you receive and how much cleanup is required?
3. Which mistakes are most consequential?
4. Which fields and reports must an export contain?
5. What audit trail would make you trust the source?
6. Which clients are unsuitable for this product?
7. Would a read-only exception dashboard save time or create support work?
8. Would you recommend it, onboard it, or resell it? Under what commercial terms?
9. What claims must the product never make?
10. Review five golden invoice/tax scenarios and the proposed export.

## Interview scorecard

Score 0 (weak), 1 (moderate), or 2 (strong).

| Dimension | 0 | 1 | 2 |
|---|---|---|---|
| Invoice frequency | <10/month | 10–20 | >20 |
| Repeat customers | few | some | many |
| Credit/receivables | mostly immediate | occasional | material/continuous |
| Outstanding pain | confident/simple | some gaps | frequent uncertainty/overdue |
| WhatsApp workflow | minor | regular | primary operating channel |
| Current tool satisfaction | satisfied | mixed | actively painful |
| Migration complexity | embedded ERP | moderate | paper/Excel/basic |
| Owner involvement | delegated | review only | personally active |
| Willingness to pilot | vague | conditional | commits dates/data |
| Willingness to pay | rejects | ₹99–₹299 | ₹399+ |

Select design partners at 14/20 or above, while preserving segment diversity.

## Concierge pilot design

### Duration

Two weeks of active use plus one setup week and one follow-up week.

### Setup

- signed pilot/data agreement;
- business/GST profile verified by participant;
- import 10 customers, common items/services, and opening receivables;
- create a test invoice and void it through the correct flow;
- define payment/reminder policy;
- define measurable baseline;
- arrange weekly 20-minute review.

### Baseline measures

- invoices/month and median creation time;
- percentage issued same day;
- outstanding value by aging bucket;
- how many reminders/week;
- time preparing CA data;
- current software and cost;
- correction/reconciliation problems in the prior month.

### Weekly pilot tasks

- create at least five real invoices;
- record at least three payments where available;
- ask at least three receivables questions;
- share at least one reminder;
- review weekly summary;
- export once for the CA/bookkeeper.

### Support log

For every support interaction record:

- trigger;
- minutes;
- user misunderstanding vs product defect vs missing feature;
- whether it can be eliminated by design/onboarding;
- financial/compliance severity;
- repeated across users?

Support minutes are a core unit-economics metric.

## Prototype scenarios

Use a fixed evaluation set plus user-specific examples:

1. “Sharma Traders ka invoice bana do, 25 boxes × ₹850, GST 18%, 15 din credit.”
2. “Rate GST inclusive hai.”
3. “Nahi 25 nahi, 35 boxes.”
4. “Customer Delhi ka hai, hum Jaipur se bill kar rahe hain.”
5. “Rahul ne 5,000 de diya, baki kitna?”
6. “Kal due customers ko polite reminder ready kar do.”
7. “Is month kitni sale aur collection hui?”
8. “Invoice cancel kar do” — system must clarify and use proper document controls.
9. Noisy Hindi/Hinglish voice note with customer name and two items.
10. Ambiguous prompt: “Ramesh ko 8500 add karo” — must ask whether sale, invoice, payment, or opening balance.

## Evidence hierarchy

Strongest to weakest:

1. repeated real usage and payment;
2. observed current workflow and artefacts;
3. signed pilot/paid commitment;
4. specific description of a recent problem;
5. willingness-to-pay response after prototype;
6. generic enthusiasm;
7. feature requests without behaviour.

Prioritise only evidence levels 1–4 for roadmap decisions.

## Decision framework after 30 interviews

Select the first segment using weighted scores:

| Factor | Weight |
|---|---:|
| Receivables pain/economic value | 25% |
| Weekly workflow frequency | 20% |
| Conversational-input advantage | 15% |
| Low MVP complexity | 15% |
| Willingness to pay | 10% |
| Referral/cluster density | 10% |
| Support/migration burden | 5% |

Document disconfirming evidence and choose one segment. If no segment scores at least 70/100, do not proceed to a broad build.

## Pivot signals

- Users like reminders/aging but not invoice creation: build a receivables overlay importing from existing billing tools.
- Users like invoice creation but do not maintain payments: sell a fast invoice generator, but recognise lower retention/ARPA.
- Traders demand inventory/POS immediately: either pick a service ICP or deliberately become a vertical billing product.
- Owners reject a central WhatsApp assistant number: PWA input plus merchant-number sharing/automation.
- CAs want structured capture more than owners do: consider accountant-led managed onboarding/B2B2B.
- Users demand human bookkeeping: separate a paid service layer; do not hide service labour inside low SaaS pricing.

## Research log template

For each interview add a project note with:

```text
Interview ID:
Date / city / segment:
Business size and invoice volume:
Current tools:
Observed last-invoice workflow:
Outstanding/collection pain:
Trust/platform concerns:
Exact high-signal quote:
Prototype task completion:
Willingness to pilot/pay:
Score /20:
Disconfirming evidence:
Follow-up action:
```

Do not place unredacted customer names, phone numbers, GSTINs, bank data, invoices, or voice files in the general strategy repository.
