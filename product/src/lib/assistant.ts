import "server-only";

import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import type { Business, Customer, InvoiceDraft, ItemTemplate } from "./domain/types";
import { addDays, todayInIndia } from "./date";
import { rupeesToPaise } from "./domain/money";

const extractedCommandSchema = z.object({
  customerName: z.string(),
  customerId: z.string(),
  customerPhone: z.string(),
  customerStateCode: z.string(),
  dueDays: z.number().int(),
  notes: z.string(),
  uncertainFields: z.array(z.string()),
  lines: z.array(z.object({
    description: z.string(),
    quantity: z.string(),
    unit: z.string(),
    unitPriceRupees: z.string(),
    taxRatePercent: z.number(),
    priceIncludesTax: z.boolean(),
    hsnSac: z.string(),
  })),
});

function normalizeName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function bestCustomer(message: string, customers: Customer[]) {
  const lower = message.toLowerCase();
  return customers
    .filter((customer) => lower.includes(customer.name.toLowerCase()))
    .sort((a, b) => b.name.length - a.name.length)[0];
}

function bestItem(message: string, items: ItemTemplate[]) {
  const lower = message.toLowerCase();
  return items.find((item) => lower.includes(item.name.toLowerCase()) || lower.includes(item.description.toLowerCase()));
}

function parseWithRules(message: string, business: Business, customers: Customer[], items: ItemTemplate[]): InvoiceDraft {
  const today = todayInIndia();
  const customer = bestCustomer(message, customers);
  const item = bestItem(message, items);
  const customerMatch = message.match(/^(.+?)(?:\s+ka|\s+ko|\s+के लिए)\s+(?:invoice|bill)/i)
    || message.match(/(?:invoice|bill)\s+(?:bana\s*do|banado|for)?\s*(.+?)(?:,|\s+\d)/i);
  const customerName = customer?.name || normalizeName(customerMatch?.[1] || "New Customer");
  const quantityRate = message.match(/(\d+(?:\.\d+)?)\s*([a-zA-Z]+)?\s*(?:×|x|@|at)\s*₹?\s*([\d,]+(?:\.\d{1,2})?)/i);
  const amountOnly = message.match(/(?:₹|rs\.?|inr)\s*([\d,]+(?:\.\d{1,2})?)/i);
  const gst = message.match(/(?:gst\s*)?(\d+(?:\.\d+)?)\s*%/i);
  const due = message.match(/(\d+)\s*(?:din|days?)/i);
  const inclusive = /(?:gst\s*)?inclusive|including\s+gst|gst\s+included/i.test(message);
  const quantity = quantityRate?.[1] || "1";
  const unitFromText = quantityRate?.[2];
  const price = quantityRate?.[3] || amountOnly?.[1] || (item ? String(item.unitPricePaise / 100) : "0");
  const uncertainFields: string[] = [];
  if (!customer) uncertainFields.push("customer identity and state");
  if (!quantityRate && !amountOnly && !item) uncertainFields.push("item price");
  if (!gst && !item) uncertainFields.push("GST rate");
  return {
    customerId: customer?.id,
    customerName,
    customerPhone: customer?.phone,
    customerStateCode: customer?.stateCode || business.stateCode,
    invoiceDate: today,
    dueDate: addDays(today, due ? Number(due[1]) : business.defaultDueDays),
    lines: [{
      description: item?.description || unitFromText || "Goods / services",
      quantity,
      unit: item?.unit || unitFromText || "Nos",
      unitPricePaise: rupeesToPaise(price),
      taxRateBps: Math.round(Number(gst?.[1] || (item ? item.taxRateBps / 100 : 0)) * 100),
      priceIncludesTax: inclusive,
      hsnSac: item?.hsnSac || "",
    }],
    notes: "",
    uncertainFields,
    sourceText: message,
  };
}

async function parseWithOpenAI(message: string, business: Business, customers: Customer[], items: ItemTemplate[]): Promise<InvoiceDraft> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const today = todayInIndia();
  const response = await client.responses.parse({
    model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
    store: false,
    safety_identifier: business.id,
    instructions: [
      "Extract a draft Indian sales invoice command. Do not calculate totals or invent tax facts.",
      "Use a known customer/item ID only for a clear match. Otherwise leave the ID empty and mark uncertainty.",
      "All prices are per-unit rupee amounts. Preserve whether GST is inclusive.",
      `Today is ${today}. Business state code is ${business.stateCode}. Default due days is ${business.defaultDueDays}.`,
      `Known customers: ${JSON.stringify(customers.map(({ id, name, stateCode, phone }) => ({ id, name, stateCode, phone })))}`,
      `Known items: ${JSON.stringify(items.map(({ id, name, description, unit, unitPricePaise, taxRateBps, hsnSac }) => ({ id, name, description, unit, unitPriceRupees: unitPricePaise / 100, taxRatePercent: taxRateBps / 100, hsnSac })))}`,
    ].join("\n"),
    input: message,
    text: { format: zodTextFormat(extractedCommandSchema, "invoice_command") },
  });
  const result = response.output_parsed;
  if (!result || result.lines.length === 0) throw new Error("AI could not extract an invoice draft");
  const customer = customers.find((entry) => entry.id === result.customerId);
  return {
    customerId: customer?.id,
    customerName: customer?.name || normalizeName(result.customerName),
    customerPhone: customer?.phone || result.customerPhone || undefined,
    customerStateCode: customer?.stateCode || result.customerStateCode || business.stateCode,
    invoiceDate: today,
    dueDate: addDays(today, result.dueDays >= 0 ? result.dueDays : business.defaultDueDays),
    lines: result.lines.map((line) => ({
      description: line.description,
      quantity: line.quantity,
      unit: line.unit || "Nos",
      unitPricePaise: rupeesToPaise(line.unitPriceRupees),
      taxRateBps: Math.round(line.taxRatePercent * 100),
      priceIncludesTax: line.priceIncludesTax,
      hsnSac: line.hsnSac,
    })),
    notes: result.notes,
    uncertainFields: result.uncertainFields,
    sourceText: message,
  };
}

export async function interpretInvoiceCommand(message: string, business: Business, customers: Customer[], items: ItemTemplate[]) {
  if (process.env.OPENAI_API_KEY) {
    try {
      return { draft: await parseWithOpenAI(message, business, customers, items), provider: "OPENAI" as const };
    } catch (error) {
      console.error("OpenAI extraction failed; using deterministic parser", error);
    }
  }
  return { draft: parseWithRules(message, business, customers, items), provider: "RULES" as const };
}
