import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function apiError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json({ error: "Please check the entered details.", details: error.issues }, { status: 400 });
  }
  const message = error instanceof Error ? error.message : "Unexpected error";
  console.error(error);
  return NextResponse.json({ error: message }, { status: 400 });
}
