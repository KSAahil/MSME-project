import "server-only";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { Invoice } from "./domain/types";
import { paiseToRupees } from "./domain/money";

export async function createInvoicePdf(invoice: Invoice) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const muted = rgb(0.35, 0.38, 0.43);
  const ink = rgb(0.08, 0.11, 0.16);
  const green = rgb(0.05, 0.45, 0.30);
  let y = 790;
  const text = (value: string, x: number, size = 10, font = regular, color = ink) => page.drawText(value.replace(/₹/g, "INR "), { x, y, size, font, color });
  text("TAX INVOICE", 42, 20, bold, green);
  text(invoice.invoiceNumber, 390, 12, bold);
  y -= 34;
  text(invoice.businessSnapshot.name, 42, 16, bold);
  y -= 18;
  text(invoice.businessSnapshot.address || "Address not configured", 42, 9, regular, muted);
  y -= 14;
  text(`GSTIN: ${invoice.businessSnapshot.gstin || "Not configured"}`, 42, 9, regular, muted);
  text(`Date: ${invoice.invoiceDate}`, 390, 9, regular, muted);
  y -= 38;
  page.drawLine({ start: { x: 42, y }, end: { x: 553, y }, thickness: 1, color: rgb(0.85, 0.87, 0.89) });
  y -= 26;
  text("BILL TO", 42, 9, bold, muted);
  text("PAYMENT", 390, 9, bold, muted);
  y -= 18;
  text(invoice.customerSnapshot.name, 42, 12, bold);
  text(`Due: ${invoice.dueDate}`, 390, 10, bold);
  y -= 16;
  text(invoice.customerSnapshot.address || "Address not provided", 42, 9, regular, muted);
  text(`UPI: ${invoice.businessSnapshot.upiId || "Not configured"}`, 390, 9, regular, muted);
  y -= 36;
  page.drawRectangle({ x: 42, y: y - 5, width: 511, height: 24, color: rgb(0.94, 0.96, 0.95) });
  text("Description", 50, 9, bold); text("Qty", 300, 9, bold); text("Rate", 350, 9, bold); text("GST", 420, 9, bold); text("Amount", 485, 9, bold);
  y -= 28;
  for (const line of invoice.lines) {
    text(line.description.slice(0, 40), 50, 9);
    text(line.quantity, 300, 9);
    text(paiseToRupees(line.unitPricePaise), 350, 9);
    text(`${line.taxRateBps / 100}%`, 420, 9);
    text(paiseToRupees(line.totalPaise), 485, 9);
    y -= 23;
  }
  y -= 12;
  page.drawLine({ start: { x: 330, y }, end: { x: 553, y }, thickness: 1, color: rgb(0.85, 0.87, 0.89) });
  y -= 22;
  const totalRow = (label: string, amount: number, strong = false) => {
    text(label, 360, strong ? 11 : 9, strong ? bold : regular);
    text(`INR ${paiseToRupees(amount)}`, 475, strong ? 11 : 9, strong ? bold : regular);
    y -= strong ? 25 : 18;
  };
  totalRow("Taxable", invoice.totals.taxablePaise);
  if (invoice.interState) totalRow("IGST", invoice.totals.igstPaise);
  else { totalRow("CGST", invoice.totals.cgstPaise); totalRow("SGST", invoice.totals.sgstPaise); }
  totalRow("Total", invoice.totals.totalPaise, true);
  y = 90;
  text("This invoice was generated from details confirmed by the merchant.", 42, 8, regular, muted);
  y -= 14;
  text("Please verify tax treatment with your CA where applicable.", 42, 8, regular, muted);
  return pdf.save();
}
