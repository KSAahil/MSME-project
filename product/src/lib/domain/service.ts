import "server-only";

import { randomUUID } from "node:crypto";
import { DEMO_ACTOR_ID, DEMO_BUSINESS_ID, getDatabase, withDatabaseWrite } from "../db";
import { calculateInvoice } from "./gst";
import type { Business, Customer, DatabaseShape, Invoice, InvoiceDraft, InvoicePreview, InvoiceStatus, Payment, PaymentMethod } from "./types";
import { todayInIndia } from "../date";

function addAudit(data: DatabaseShape, action: string, entityType: string, entityId: string, metadata: Record<string, unknown>) {
  data.auditEvents.push({
    id: randomUUID(), businessId: DEMO_BUSINESS_ID, actorId: DEMO_ACTOR_ID,
    action, entityType, entityId, metadata, createdAt: new Date().toISOString(),
  });
}

export function effectiveInvoiceStatus(invoice: Invoice): InvoiceStatus {
  if (["PAID", "CANCELLED", "DISPUTED"].includes(invoice.status)) return invoice.status;
  if (invoice.balancePaise <= 0) return "PAID";
  if (invoice.paidPaise > 0) return "PART_PAID";
  if (invoice.dueDate < todayInIndia()) return "OVERDUE";
  return "ISSUED";
}

export async function getSnapshot() {
  const db = await getDatabase();
  await db.read();
  const business = db.data.businesses.find((entry) => entry.id === DEMO_BUSINESS_ID)!;
  const invoices = db.data.invoices
    .filter((entry) => entry.businessId === DEMO_BUSINESS_ID)
    .map((invoice) => ({ ...invoice, status: effectiveInvoiceStatus(invoice) }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const active = invoices.filter((invoice) => invoice.status !== "CANCELLED");
  const stats = {
    invoicedPaise: active.reduce((sum, invoice) => sum + invoice.totals.totalPaise, 0),
    collectedPaise: active.reduce((sum, invoice) => sum + invoice.paidPaise, 0),
    outstandingPaise: active.reduce((sum, invoice) => sum + invoice.balancePaise, 0),
    overduePaise: active.filter((invoice) => invoice.status === "OVERDUE").reduce((sum, invoice) => sum + invoice.balancePaise, 0),
  };
  return {
    business,
    customers: db.data.customers.filter((entry) => entry.businessId === DEMO_BUSINESS_ID),
    items: db.data.items.filter((entry) => entry.businessId === DEMO_BUSINESS_ID),
    invoices,
    payments: db.data.payments.filter((entry) => entry.businessId === DEMO_BUSINESS_ID),
    auditEvents: db.data.auditEvents.filter((entry) => entry.businessId === DEMO_BUSINESS_ID).slice(-50).reverse(),
    stats,
    mode: process.env.OPENAI_API_KEY ? "AI" : "DETERMINISTIC_DEMO",
  };
}

export async function previewInvoice(draft: InvoiceDraft): Promise<InvoicePreview> {
  const db = await getDatabase();
  await db.read();
  const business = db.data.businesses.find((entry) => entry.id === DEMO_BUSINESS_ID)!;
  const customer = draft.customerId
    ? db.data.customers.find((entry) => entry.id === draft.customerId && entry.businessId === DEMO_BUSINESS_ID)
    : db.data.customers.find((entry) => entry.businessId === DEMO_BUSINESS_ID && entry.name.toLowerCase() === draft.customerName.toLowerCase());
  const stateCode = customer?.stateCode || draft.customerStateCode || business.stateCode;
  const interState = stateCode !== business.stateCode;
  const calculated = calculateInvoice(draft.lines, interState);
  const warnings = [...draft.uncertainFields.map((field) => `Please confirm ${field}.`)];
  if (!customer && !draft.customerPhone) warnings.push("New customer will be saved without a phone number.");
  if (!business.gstin && business.gstRegistered) warnings.push("Add and verify your GSTIN before using this invoice in production.");
  if (!draft.lines.every((line) => line.hsnSac)) warnings.push("One or more HSN/SAC codes are blank; confirm with your CA if required.");
  return { ...draft, customer, interState, calculatedLines: calculated.lines, totals: calculated.totals, warnings };
}

export async function issueInvoice(draft: InvoiceDraft, idempotencyKey: string): Promise<Invoice> {
  return withDatabaseWrite(async (data) => {
    const prior = data.invoices.find((invoice) => invoice.businessId === DEMO_BUSINESS_ID && invoice.idempotencyKey === idempotencyKey);
    if (prior) return prior;
    const business = data.businesses.find((entry) => entry.id === DEMO_BUSINESS_ID)!;
    let customer = draft.customerId ? data.customers.find((entry) => entry.id === draft.customerId) : undefined;
    if (!customer) customer = data.customers.find((entry) => entry.businessId === DEMO_BUSINESS_ID && entry.name.toLowerCase() === draft.customerName.toLowerCase());
    if (!customer) {
      const timestamp = new Date().toISOString();
      customer = {
        id: randomUUID(), businessId: DEMO_BUSINESS_ID, name: draft.customerName,
        phone: draft.customerPhone || "", email: "", gstin: "", address: "",
        stateCode: draft.customerStateCode || business.stateCode,
        stateName: draft.customerStateCode === business.stateCode ? business.stateName : "",
        createdAt: timestamp, updatedAt: timestamp,
      };
      data.customers.push(customer);
      addAudit(data, "CUSTOMER_CREATED_FROM_INVOICE", "CUSTOMER", customer.id, { name: customer.name });
    }
    const stateCode = customer.stateCode || business.stateCode;
    const interState = stateCode !== business.stateCode;
    const calculated = calculateInvoice(draft.lines, interState);
    const timestamp = new Date().toISOString();
    const invoiceNumber = `${business.invoicePrefix}/${business.financialYear}/${String(business.nextInvoiceNumber).padStart(4, "0")}`;
    business.nextInvoiceNumber += 1;
    business.updatedAt = timestamp;
    const invoice: Invoice = {
      id: randomUUID(), businessId: business.id, customerId: customer.id,
      customerSnapshot: structuredClone(customer), businessSnapshot: structuredClone(business),
      invoiceNumber, invoiceDate: draft.invoiceDate, dueDate: draft.dueDate,
      placeOfSupplyStateCode: stateCode, interState, status: "ISSUED",
      lines: calculated.lines, totals: calculated.totals, paidPaise: 0,
      balancePaise: calculated.totals.totalPaise, notes: draft.notes,
      idempotencyKey, createdAt: timestamp, updatedAt: timestamp,
    };
    data.invoices.push(invoice);
    addAudit(data, "INVOICE_ISSUED", "INVOICE", invoice.id, { invoiceNumber, totalPaise: invoice.totals.totalPaise });
    return invoice;
  });
}

export async function recordPayment(input: { invoiceId: string; amountPaise: number; method: PaymentMethod; reference: string; paidAt: string; idempotencyKey: string }): Promise<Payment> {
  return withDatabaseWrite((data) => {
    const prior = data.payments.find((payment) => payment.businessId === DEMO_BUSINESS_ID && payment.idempotencyKey === input.idempotencyKey);
    if (prior) return prior;
    const invoice = data.invoices.find((entry) => entry.id === input.invoiceId && entry.businessId === DEMO_BUSINESS_ID);
    if (!invoice) throw new Error("Invoice not found");
    if (["CANCELLED", "DISPUTED"].includes(invoice.status)) throw new Error("Payment cannot be recorded against this invoice state");
    if (input.amountPaise > invoice.balancePaise) throw new Error("Payment cannot exceed the outstanding balance");
    const payment: Payment = {
      id: randomUUID(), businessId: DEMO_BUSINESS_ID, customerId: invoice.customerId,
      invoiceId: invoice.id, amountPaise: input.amountPaise, method: input.method,
      reference: input.reference, paidAt: input.paidAt, idempotencyKey: input.idempotencyKey,
      createdAt: new Date().toISOString(),
    };
    data.payments.push(payment);
    invoice.paidPaise += payment.amountPaise;
    invoice.balancePaise = invoice.totals.totalPaise - invoice.paidPaise;
    invoice.status = invoice.balancePaise === 0 ? "PAID" : "PART_PAID";
    invoice.updatedAt = new Date().toISOString();
    addAudit(data, "PAYMENT_RECORDED", "PAYMENT", payment.id, { invoiceId: invoice.id, amountPaise: payment.amountPaise, method: payment.method });
    return payment;
  });
}

export async function saveBusiness(update: Omit<Business, "id" | "nextInvoiceNumber" | "financialYear" | "createdAt" | "updatedAt">) {
  return withDatabaseWrite((data) => {
    const business = data.businesses.find((entry) => entry.id === DEMO_BUSINESS_ID)!;
    Object.assign(business, update, { updatedAt: new Date().toISOString() });
    addAudit(data, "BUSINESS_PROFILE_UPDATED", "BUSINESS", business.id, { fields: Object.keys(update) });
    return business;
  });
}

export async function addCustomer(input: Omit<Customer, "id" | "businessId" | "createdAt" | "updatedAt">) {
  return withDatabaseWrite((data) => {
    const timestamp = new Date().toISOString();
    const customer: Customer = { ...input, id: randomUUID(), businessId: DEMO_BUSINESS_ID, createdAt: timestamp, updatedAt: timestamp };
    data.customers.push(customer);
    addAudit(data, "CUSTOMER_CREATED", "CUSTOMER", customer.id, { name: customer.name });
    return customer;
  });
}

export async function findInvoice(id: string) {
  const db = await getDatabase();
  await db.read();
  return db.data.invoices.find((invoice) => invoice.id === id && invoice.businessId === DEMO_BUSINESS_ID);
}
