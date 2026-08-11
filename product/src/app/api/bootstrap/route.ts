import { NextResponse } from "next/server";
import { getSnapshot } from "@/lib/domain/service";

export async function GET() {
  return NextResponse.json(await getSnapshot());
}
