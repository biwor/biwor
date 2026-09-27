import { NextRequest, NextResponse } from "next/server";
import { getAdminPassword, setAdminPassword } from "@/lib/admin-password";

function isAuth(req: NextRequest) {
  return req.cookies.get("biwor_admin")?.value === "authenticated";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password } = body;
    const expected = await getAdminPassword();
    if (password === expected) {
      const res = NextResponse.json({ success: true });
      res.cookies.set("biwor_admin", "authenticated", {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
      return res;
    }
    return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, error: "Bad request" }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  if (!isAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const current = String(body.currentPassword || "");
    const next = String(body.newPassword || "");
    if (next.length < 8) {
      return NextResponse.json({ success: false, error: "New password must be at least 8 characters" }, { status: 400 });
    }
    const expected = await getAdminPassword();
    if (current !== expected) {
      return NextResponse.json({ success: false, error: "Current password is wrong" }, { status: 400 });
    }
    await setAdminPassword(next);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Failed" }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set("biwor_admin", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    sameSite: "lax",
  });
  return res;
}
