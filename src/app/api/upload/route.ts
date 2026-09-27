import { NextRequest, NextResponse } from "next/server";
import { addMedia } from "@/lib/data";
import { getImages } from "@/lib/cf";

function isAuth(req: NextRequest) {
  return req.cookies.get("biwor_admin")?.value === "authenticated";
}

function keyFor(file: File, type: string) {
  const ext = (file.name.match(/\.[a-zA-Z0-9]+$/) || [".jpg"])[0];
  const safe = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  if (type === "logo") return `uploads/logo${ext}`;
  if (type === "favicon") return `uploads/favicon.ico`;
  if (type === "hero") return `uploads/hero/hero-${stamp}${ext}`;
  if (type === "product") return `uploads/products/${stamp}-${safe}`;
  if (type === "gallery") return `uploads/gallery/${stamp}-${safe}`;
  if (type === "cert") return `uploads/certs/${stamp}-${safe}`;
  return `uploads/library/${stamp}-${safe}`;
}

async function saveOne(file: File, type: string) {
  const bytes = await file.arrayBuffer();
  const r2 = await getImages();
  if (!r2) throw new Error("R2 is not bound. Add IMAGES binding and PUBLIC_R2_URL.");
  const key = keyFor(file, type);
  await r2.bucket.put(key, bytes, {
    httpMetadata: { contentType: file.type || "application/octet-stream" },
  });
  const url = r2.publicUrl ? `${r2.publicUrl}/${key}` : `/${key}`;
  const mediaItem = await addMedia({
    id: String(Date.now()) + Math.random().toString(36).slice(2, 6),
    url,
    name: file.name,
    type: type || "media",
    size: bytes.byteLength,
    createdAt: new Date().toISOString(),
  });
  return { url, media: mediaItem };
}

export async function POST(req: NextRequest) {
  if (!isAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const formData = await req.formData();
    const type = (formData.get("type") as string) || "media";
    const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
    const single = formData.get("file");
    if (single instanceof File && single.size > 0) files.push(single);
    if (files.length === 0) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    const results = [];
    for (const file of files) results.push(await saveOne(file, type));
    if (results.length === 1) return NextResponse.json({ success: true, url: results[0].url, media: results[0].media });
    return NextResponse.json({ success: true, urls: results.map((r) => r.url), media: results.map((r) => r.media), count: results.length });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Upload failed" }, { status: 500 });
  }
}
