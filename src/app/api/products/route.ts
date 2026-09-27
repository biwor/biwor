import { NextRequest, NextResponse } from "next/server";
import { getProducts, saveProducts, Product } from "@/lib/data";

function isAuth(req: NextRequest) {
  return req.cookies.get("biwor_admin")?.value === "authenticated";
}

export async function GET() {
  return NextResponse.json(await getProducts());
}

export async function POST(req: NextRequest) {
  if (!isAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const products = await getProducts();
    const newProduct: Product = {
      id: String(Date.now()),
      name: body.name || "New Product",
      description: body.description || "",
      category: body.category || "General",
      moq: body.moq || "500 pcs",
      leadTime: body.leadTime || "45-55 days",
      image: body.image || "",
      featured: Boolean(body.featured),
    };
    products.push(newProduct);
    await saveProducts(products);
    return NextResponse.json(newProduct);
  } catch {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!isAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const products = await getProducts();
    const idx = products.findIndex((p) => p.id === body.id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    products[idx] = { ...products[idx], ...body };
    await saveProducts(products);
    return NextResponse.json(products[idx]);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    await saveProducts((await getProducts()).filter((p) => p.id !== id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
