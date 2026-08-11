import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { issueInvoice } from "@/lib/domain/service";
import { issueInvoiceSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const input = issueInvoiceSchema.parse(await request.json());
    return NextResponse.json(await issueInvoice(input.draft, input.idempotencyKey), { status: 201 });
  } catch (error) { return apiError(error); }
}
