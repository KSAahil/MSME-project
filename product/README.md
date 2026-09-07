# AI Munim product prototype

A runnable mobile-first invoice-to-cash assistant for Indian small businesses.

The name is configured through `NEXT_PUBLIC_PRODUCT_NAME`; “AI Munim” remains a working name and can be changed later.
The bundled demonstration is localised to a sample industrial-services business in Raipur, Chhattisgarh (GST state code 22).

## What works now

- responsive desktop and mobile PWA shell;
- English/Hindi/Hinglish invoice-command parsing;
- optional OpenAI Responses API extraction with structured output;
- deterministic local parser when no API key is configured;
- customer and item memory;
- exact paise arithmetic and quantities with up to three decimal places;
- tax-exclusive and tax-inclusive prices;
- intra-state CGST/SGST and inter-state IGST allocation;
- preview, correction, recalculation, and explicit confirmation;
- invoice-number allocation only at confirmation;
- immutable invoice/business/customer snapshots;
- duplicate-request protection through idempotency keys;
- invoice PDF generation;
- merchant-owned UPI QR generation;
- unpaid, part-paid, paid, and overdue receivable states;
- manual payment entry with overpayment protection;
- dashboard and receivables aging view;
- customer creation and business settings;
- CA invoice-register CSV export;
- append-only financial audit events; and
- PWA manifest and mobile bottom navigation.

## Important prototype boundaries

This repository is a functioning product prototype, not a production accounting system.

- Local data uses a JSON repository adapter so the product runs without cloud accounts. Replace it with PostgreSQL and database transactions before a real customer pilot.
- The current local build uses one demo business and no production authentication. Tenant-aware IDs are already present, but proper login, membership, roles, and database-enforced isolation are required before handling customer data.
- GST rules and invoice templates require the planned CA-approved golden-case matrix before live use.
- A displayed static UPI QR does not prove payment. Payments are explicitly recorded by the merchant in this build.
- WhatsApp sending is intentionally manual. Automated templates require per-merchant onboarding, consent, policy approval, and quality controls.
- Voice transcription, payment-provider webhooks, GST lookup/GSP, e-invoice, e-way bill, and return filing are not active.
- The product must not be used as a substitute for CA, tax, legal, or payment-provider advice.

## Requirements

- Node.js 24 or newer (`.nvmrc` is included)
- npm
- No external credentials for deterministic demo mode
- Optional OpenAI API project/key for model-based command extraction

A ChatGPT subscription is not an API credential and is not used by this application.

## Run locally

```powershell
cd product
Copy-Item .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

The first run creates local demo data under `.data/`. That directory is ignored by Git. Do not put real customer data in the local prototype.

## Vercel demo deployment

Import `KSAahil/MSME-project` into Vercel with **Root Directory: `product`**, framework **Next.js**, and Node.js **24.x**. The repository contains the app in a subdirectory, so the root setting is required.

Connect a new **private Vercel Blob store** to this project. Vercel supplies `BLOB_READ_WRITE_TOKEN`; redeploy after connecting. Do not set `APP_DATA_FILE` on Vercel or use `/tmp` for invoice storage. The server fails clearly if hosted storage is missing.

Hosted mode uses a separate random, HTTP-only cookie per browser to select its sample workspace. The cookie expires after 30 days. Clearing it loses access to that workspace but does not delete the stored records. This is a demo access mechanism, not production user authentication. Use synthetic data only. Production and preview should use separate stores.

Private Blob reads bypass cache and writes use ETag preconditions with bounded retries to prevent lost concurrent updates. This small JSON adapter is for demonstration only; production still requires the database, identity, retention/deletion, and compliance work listed below. Local mode continues using `.data/db.json` and does not upload existing local records.

## Optional OpenAI integration

This is not required to start the product or run the current demo. Without an API key, constrained invoice commands use the deterministic parser. The API can be added later to improve interpretation of varied natural language; voice transcription is a separate later integration.

Set these only on the server in `.env.local`:

```text
OPENAI_API_KEY=your-server-side-key
OPENAI_MODEL=gpt-5.6-luna
```

The adapter uses the Responses API and a strict Zod-backed structured-output schema. If the provider is unavailable or rejects a response, the app safely falls back to the deterministic parser. In both modes, the model/parser produces only a draft; the financial engine recalculates and the user must confirm it.

## Verification

```powershell
npm run typecheck
npm run lint
npm test
npm run build
```

Current automated coverage includes the reference calculation `25 × ₹850 + 18% GST = ₹25,075`, CGST/SGST versus IGST, GST-inclusive pricing, scaled quantities, and Indian currency parsing.

The implementation was also smoke-tested end to end: command interpretation, confirmation, invoice persistence, PDF, UPI QR, partial payment, and remaining balance.

## Server routes

| Route | Purpose |
|---|---|
| `GET /api/bootstrap` | Business, masters, invoices, payments, audit, dashboard |
| `POST /api/assistant` | Interpret text and return a calculated preview |
| `POST /api/invoices/preview` | Deterministically recalculate an edited draft |
| `POST /api/invoices` | Confirm and issue an idempotent invoice |
| `GET /api/invoices/:id/pdf` | Generate invoice PDF |
| `GET /api/invoices/:id/qr` | Generate merchant UPI payment QR |
| `POST /api/payments` | Record an idempotent full/partial payment |
| `POST /api/customers` | Add a customer |
| `PUT /api/business` | Update business/invoice settings |
| `GET /api/export/invoices` | Download CA-facing invoice-register CSV |

## Code map

- `src/components/munim-app.tsx` — mobile/desktop product interface
- `src/lib/domain/money.ts` — exact rupee/paise and scaled-number helpers
- `src/lib/domain/gst.ts` — deterministic GST calculation
- `src/lib/domain/service.ts` — invoice, payment, customer, audit workflows
- `src/lib/assistant.ts` — optional OpenAI and deterministic parsing adapters
- `src/lib/db.ts` — replaceable local persistence adapter
- `src/lib/invoice-pdf.ts` — invoice PDF generation
- `src/app/api` — server endpoints

## Next production engineering gates

1. Obtain the 30-interview/10-design-partner product gate.
2. Finalise the 50+ CA-approved GST/invoice cases.
3. Replace local JSON with PostgreSQL, migrations, row-level tenant controls, and transactional invoice numbering.
4. Add production authentication, membership, roles, recovery, and audited support access.
5. Add credit notes/cancellation state machine and safe CSV import.
6. Add encrypted object storage, backups, restore testing, monitoring, and incident controls.
7. Benchmark voice providers on 200 consented Hindi/Hinglish/English utterances.
8. Complete WhatsApp BSP/policy review before implementing automated sends.
9. Connect only merchant-owned payment-provider accounts for webhook reconciliation.
10. Conduct security review and penetration testing before real customer data.
