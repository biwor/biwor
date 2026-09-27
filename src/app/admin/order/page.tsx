"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const DEFAULT_ITEMS = [
  { id: "hero", label: "Hero", visible: true },
  { id: "about", label: "About", visible: true },
  { id: "bangladesh", label: "Bangladesh story", visible: true },
  { id: "principles", label: "Principles", visible: true },
  { id: "services", label: "Services", visible: true },
  { id: "process5", label: "Five-stage process", visible: true },
  { id: "clients", label: "Who we work with", visible: true },
  { id: "leadtimes", label: "Lead times", visible: true },
  { id: "products", label: "Products", visible: true },
  { id: "certs", label: "Certifications", visible: true },
  { id: "gallery", label: "Gallery", visible: true },
  { id: "whyus", label: "Why us", visible: true },
  { id: "roadmap", label: "Tech pack to delivery", visible: true },
  { id: "terms", label: "Clear terms", visible: true },
  { id: "contact", label: "Contact", visible: true },
];

export default function SectionOrderPage() {
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/sections", { credentials: "include", cache: "no-store" })
      .then((r) => r.json())
      .then((all) => {
        const saved = all.homeOrder?.items;
        if (!Array.isArray(saved) || !saved.length) return;
        const known = Object.fromEntries(DEFAULT_ITEMS.map((d) => [d.id, d]));
        const ordered = saved.map((s: any) => ({
          ...known[s.id],
          ...s,
          label: known[s.id]?.label || s.label || s.id,
        }));
        const missing = DEFAULT_ITEMS.filter((d) => !saved.some((s: any) => s.id === d.id));
        setItems([...ordered, ...missing]);
      });
  }, []);

  function move(i: number, dir: -1 | 1) {
    const next = [...items];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    const tmp = next[i];
    next[i] = next[j];
    next[j] = tmp;
    setItems(next);
  }

  async function save() {
    const res = await fetch("/api/sections", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ key: "homeOrder", data: { items } }),
    });
    setMsg(res.ok ? "Saved. Open the homepage and hard refresh." : "Save failed — log in again");
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b">
        <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/admin" className="text-sm text-teal-800">\u2190 Dashboard</Link>
          <span className="text-sm text-slate-500">Section order</span>
        </div>
      </header>
      <main className="max-w-xl mx-auto px-4 py-8 space-y-3">
        <p className="text-sm text-slate-600">Tick to show. Untick to hide. Use Up / Down, then Save. After that hard-refresh the public homepage.</p>
        {items.map((item, i) => (
          <div key={item.id} className="bg-white border rounded-xl p-3 flex items-center gap-3">
            <span className="text-xs text-slate-400 w-5">{i + 1}</span>
            <label className="flex items-center gap-2 text-sm flex-1">
              <input
                type="checkbox"
                checked={item.visible !== false}
                onChange={(e) => {
                  const next = [...items];
                  next[i] = { ...item, visible: e.target.checked };
                  setItems(next);
                }}
              />
              {item.label}
            </label>
            <button type="button" className="text-xs border px-2 py-1 rounded" onClick={() => move(i, -1)}>Up</button>
            <button type="button" className="text-xs border px-2 py-1 rounded" onClick={() => move(i, 1)}>Down</button>
          </div>
        ))}
        {msg && <p className="text-sm text-teal-700">{msg}</p>}
        <button onClick={save} className="w-full bg-teal-800 text-white py-2.5 rounded-lg font-semibold">Save order</button>
      </main>
    </div>
  );
}
