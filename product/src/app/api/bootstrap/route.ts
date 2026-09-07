import { NextResponse } from "next/server";
import { getSnapshot } from "@/lib/domain/service";
import { apiError } from "@/lib/api";

export async function GET() {
  try {
    return NextResponse.json(await getSnapshot(), { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    return apiError(error);
  }
}
