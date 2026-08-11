import QRCode from "qrcode";
import { findInvoice } from "@/lib/domain/service";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const invoice = await findInvoice(id);
  if (!invoice) return new Response("Invoice not found", { status: 404 });
  if (!invoice.businessSnapshot.upiId) return new Response("UPI ID not configured", { status: 400 });
  const uri = new URL("upi://pay");
  uri.searchParams.set("pa", invoice.businessSnapshot.upiId);
  uri.searchParams.set("pn", invoice.businessSnapshot.name);
  uri.searchParams.set("am", (invoice.balancePaise / 100).toFixed(2));
  uri.searchParams.set("cu", "INR");
  uri.searchParams.set("tn", invoice.invoiceNumber);
  const png = await QRCode.toBuffer(uri.toString(), { type: "png", width: 420, margin: 2, errorCorrectionLevel: "M" });
  const body = new Uint8Array(png.byteLength);
  body.set(png);
  return new Response(body, { headers: { "content-type": "image/png", "cache-control": "private, no-store" } });
}
