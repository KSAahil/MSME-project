import { z } from "zod";

export const invoiceLineSchema = z.object({
  description: z.string().trim().min(1).max(200),
  quantity: z.string().regex(/^\d+(?:\.\d{1,3})?$/),
  unit: z.string().trim().min(1).max(20).default("Nos"),
  unitPricePaise: z.number().int().nonnegative().max(100_000_000_00),
  taxRateBps: z.number().int().min(0).max(10000),
  priceIncludesTax: z.boolean().default(false),
  hsnSac: z.string().trim().max(20).default(""),
});

export const invoiceDraftSchema = z.object({
  customerId: z.string().optional(),
  customerName: z.string().trim().min(2).max(120),
  customerPhone: z.string().trim().max(20).optional(),
  customerStateCode: z.string().regex(/^\d{2}$/).optional(),
  invoiceDate: z.iso.date(),
  dueDate: z.iso.date(),
  lines: z.array(invoiceLineSchema).min(1).max(50),
  notes: z.string().trim().max(500).default(""),
  uncertainFields: z.array(z.string()).default([]),
  sourceText: z.string().max(2000).optional(),
});

export const issueInvoiceSchema = z.object({
  draft: invoiceDraftSchema,
  idempotencyKey: z.string().min(8).max(100),
});

export const paymentSchema = z.object({
  invoiceId: z.string().min(1),
  amountPaise: z.number().int().positive(),
  method: z.enum(["UPI", "BANK", "CASH", "CHEQUE", "OTHER"]),
  reference: z.string().trim().max(100).default(""),
  paidAt: z.iso.datetime(),
  idempotencyKey: z.string().min(8).max(100),
});

export const customerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().max(20).default(""),
  email: z.string().trim().max(120).default(""),
  gstin: z.string().trim().max(15).default(""),
  address: z.string().trim().max(300).default(""),
  stateCode: z.string().regex(/^\d{2}$/),
  stateName: z.string().trim().min(2).max(60),
});

export const businessSchema = z.object({
  name: z.string().trim().min(2).max(120),
  legalName: z.string().trim().min(2).max(160),
  gstRegistered: z.boolean(),
  gstin: z.string().trim().max(15),
  address: z.string().trim().min(5).max(300),
  stateCode: z.string().regex(/^\d{2}$/),
  stateName: z.string().trim().min(2).max(60),
  phone: z.string().trim().max(20),
  email: z.string().trim().max(120),
  upiId: z.string().trim().max(100),
  invoicePrefix: z.string().trim().min(1).max(20),
  defaultDueDays: z.number().int().min(0).max(365),
});

export const assistantInputSchema = z.object({
  message: z.string().trim().min(3).max(2000),
});
