import { NextRequest, NextResponse } from "next/server";
import { getSections, saveSections } from "@/lib/data";
function isAuth(req: NextRequest) {
  return req.cookies.get("biwor_admin")?.value === "authenticated";
}
export async function GET() {
  return NextResponse.json(await getSections());
}
export async function PUT(req: NextRequest) {
  if (!isAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    if (body.key && body.data !== undefined) {
      const sections = await getSections();
      sections[body.key] = body.data;
      await saveSections(sections);
      return NextResponse.json(sections);
    }
    await saveSections(body);
    return NextResponse.json(body);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
