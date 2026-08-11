import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { saveBusiness } from "@/lib/domain/service";
import { businessSchema } from "@/lib/validation";

export async function PUT(request: Request) {
  try { return NextResponse.json(await saveBusiness(businessSchema.parse(await request.json()))); }
  catch (error) { return apiError(error); }
}
