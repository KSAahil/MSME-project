export type InvoiceStatus =
  | "DRAFT"
  | "ISSUED"
  | "PART_PAID"
  | "PAID"
  | "OVERDUE"
  | "DISPUTED"
  | "CANCELLED";

export type PaymentMethod = "UPI" | "BANK" | "CASH" | "CHEQUE" | "OTHER";

export interface Business {
  id: string; name: string; legalName: string; gstin: string;
  gstRegistered: boolean; address: string; stateCode: string; stateName: string;
  phone: string; email: string; upiId: string; invoicePrefix: string;
  nextInvoiceNumber: number; defaultDueDays: number; financialYear: string;
  createdAt: string; updatedAt: string;
}

export interface Customer {
  id: string; businessId: string; name: string; phone: string; email: string;
  gstin: string; address: string; stateCode: string; stateName: string;
  createdAt: string; updatedAt: string;
}

export interface ItemTemplate {
  id: string; businessId: string; name: string; description: string; unit: string;
  unitPricePaise: number; taxRateBps: number; hsnSac: string;
  createdAt: string; updatedAt: string;
}

export interface InvoiceLineInput {
  description: string; quantity: string; unit: string; unitPricePaise: number;
  taxRateBps: number; priceIncludesTax: boolean; hsnSac: string;
}

export interface CalculatedInvoiceLine extends InvoiceLineInput {
  quantityMilli: number; grossPaise: number; taxablePaise: number;
  taxPaise: number; cgstPaise: number; sgstPaise: number; igstPaise: number;
  totalPaise: number;
}

export interface InvoiceTotals {
  taxablePaise: number; cgstPaise: number; sgstPaise: number; igstPaise: number;
  taxPaise: number; totalPaise: number;
}

export interface Invoice {
  id: string; businessId: string; customerId: string; customerSnapshot: Customer;
  businessSnapshot: Business; invoiceNumber: string; invoiceDate: string;
  dueDate: string; placeOfSupplyStateCode: string; interState: boolean;
  status: InvoiceStatus; lines: CalculatedInvoiceLine[]; totals: InvoiceTotals;
  paidPaise: number; balancePaise: number; notes: string; idempotencyKey: string;
  createdAt: string; updatedAt: string;
}

export interface Payment {
  id: string; businessId: string; customerId: string; invoiceId: string;
  amountPaise: number; method: PaymentMethod; reference: string; paidAt: string;
  idempotencyKey: string; createdAt: string;
}

export interface AuditEvent {
  id: string; businessId: string; actorId: string; action: string;
  entityType: string; entityId: string; metadata: Record<string, unknown>;
  createdAt: string;
}

export interface InvoiceDraft {
  customerId?: string; customerName: string; customerPhone?: string;
  customerStateCode?: string; invoiceDate: string; dueDate: string;
  lines: InvoiceLineInput[]; notes: string; uncertainFields: string[];
  sourceText?: string;
}

export interface InvoicePreview extends InvoiceDraft {
  customer?: Customer; interState: boolean; calculatedLines: CalculatedInvoiceLine[];
  totals: InvoiceTotals; warnings: string[];
}

export interface DatabaseShape {
  businesses: Business[]; customers: Customer[]; items: ItemTemplate[];
  invoices: Invoice[]; payments: Payment[]; auditEvents: AuditEvent[];
}
