import { NextRequest, NextResponse } from "next/server";
import { addBuyer, getBuyers } from "@/lib/data";

function isAuth(req: NextRequest) {
  return req.cookies.get("biwor_admin")?.value === "authenticated";
}

export async function GET() {
  try {
    const buyers = await getBuyers();
    return NextResponse.json({ success: true, buyers });
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "DB error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    if (!body.name) return NextResponse.json({ success: false, error: "name is required" }, { status: 400 });
    const buyer = await addBuyer({
      name: String(body.name),
      email: body.email ?? null,
      company: body.company ?? null,
      country: body.country ?? null,
      notes: body.notes ?? null,
    });
    return NextResponse.json({ success: true, buyer });
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Failed" }, { status: 500 });
  }
}
