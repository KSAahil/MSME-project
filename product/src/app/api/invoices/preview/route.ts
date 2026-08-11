import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { previewInvoice } from "@/lib/domain/service";
import { invoiceDraftSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try { return NextResponse.json(await previewInvoice(invoiceDraftSchema.parse(await request.json()))); }
  catch (error) { return apiError(error); }
}
