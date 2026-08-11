import { getSnapshot } from "@/lib/domain/service";
import { paiseToRupees } from "@/lib/domain/money";

function csvCell(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET() {
  const snapshot = await getSnapshot();
  const header = ["Invoice Number", "Invoice Date", "Due Date", "Customer", "GSTIN", "Place of Supply", "Status", "Taxable", "CGST", "SGST", "IGST", "Total", "Collected", "Outstanding"];
  const rows = snapshot.invoices.map((invoice) => [
    invoice.invoiceNumber, invoice.invoiceDate, invoice.dueDate, invoice.customerSnapshot.name,
    invoice.customerSnapshot.gstin, invoice.placeOfSupplyStateCode, invoice.status,
    paiseToRupees(invoice.totals.taxablePaise), paiseToRupees(invoice.totals.cgstPaise),
    paiseToRupees(invoice.totals.sgstPaise), paiseToRupees(invoice.totals.igstPaise),
    paiseToRupees(invoice.totals.totalPaise), paiseToRupees(invoice.paidPaise), paiseToRupees(invoice.balancePaise),
  ]);
  const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
  return new Response(`\uFEFF${csv}`, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="invoice-register-${new Date().toISOString().slice(0, 10)}.csv"`,
      "cache-control": "private, no-store",
    },
  });
}
