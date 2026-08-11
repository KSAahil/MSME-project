import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { interpretInvoiceCommand } from "@/lib/assistant";
import { getSnapshot, previewInvoice } from "@/lib/domain/service";
import { assistantInputSchema, invoiceDraftSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const { message } = assistantInputSchema.parse(await request.json());
    const snapshot = await getSnapshot();
    const interpreted = await interpretInvoiceCommand(message, snapshot.business, snapshot.customers, snapshot.items);
    const draft = invoiceDraftSchema.parse(interpreted.draft);
    return NextResponse.json({ provider: interpreted.provider, preview: await previewInvoice(draft) });
  } catch (error) { return apiError(error); }
}
