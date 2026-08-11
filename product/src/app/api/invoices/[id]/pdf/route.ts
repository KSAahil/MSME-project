import { findInvoice } from "@/lib/domain/service";
import { createInvoicePdf } from "@/lib/invoice-pdf";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const invoice = await findInvoice(id);
  if (!invoice) return new Response("Invoice not found", { status: 404 });
  const pdf = await createInvoicePdf(invoice);
  return new Response(Buffer.from(pdf), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `inline; filename="${invoice.invoiceNumber.replace(/\//g, "-")}.pdf"`,
      "cache-control": "private, no-store",
    },
  });
}
