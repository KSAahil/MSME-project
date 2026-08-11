import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { recordPayment } from "@/lib/domain/service";
import { paymentSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try { return NextResponse.json(await recordPayment(paymentSchema.parse(await request.json())), { status: 201 }); }
  catch (error) { return apiError(error); }
}
