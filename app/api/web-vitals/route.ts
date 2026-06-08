import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const metric = await request.json();
  console.log("[web-vitals]", metric);
  return NextResponse.json({ ok: true });
}
