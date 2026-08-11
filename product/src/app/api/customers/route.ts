import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { addCustomer } from "@/lib/domain/service";
import { customerSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try { return NextResponse.json(await addCustomer(customerSchema.parse(await request.json())), { status: 201 }); }
  catch (error) { return apiError(error); }
}
