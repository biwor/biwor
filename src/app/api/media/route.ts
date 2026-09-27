import { NextRequest, NextResponse } from "next/server";
import { getMedia, saveMedia } from "@/lib/data";
import { getImages } from "@/lib/cf";
function isAuth(req: NextRequest) {
  return req.cookies.get("biwor_admin")?.value === "authenticated";
}
export async function GET() {
  return NextResponse.json(await getMedia());
}
export async function DELETE(req: NextRequest) {
  if (!isAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const items = await getMedia();
    const item = items.find((m) => m.id === id);
    if (item) {
      const r2 = await getImages();
      if (r2 && item.url) {
        const key = item.url.replace(r2.publicUrl + "/", "").replace(/^\//, "");
        try { await r2.bucket.delete(key); } catch {}
      }
      await saveMedia(items.filter((m) => m.id !== id));
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
