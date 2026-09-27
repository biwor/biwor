"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function TermsAdmin() {
  const [data, setData] = useState<any>({ title: "", subtitle: "", eyebrow: "", cards: [{}, {}, {}] });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/sections", { credentials: "include" })
      .then((r) => r.json())
      .then((all) => setData(all.commercialTerms || { title: "Clear terms, no surprises", subtitle: "", eyebrow: "Working with us", cards: [{}, {}, {}] }));
  }, []);

  function updateCard(i: number, key: string, value: string) {
    const cards = [...(data.cards || [])];
    cards[i] = { ...cards[i], [key]: value };
    setData({ ...data, cards });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/sections", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ key: "commercialTerms", data }),
    });
    setMsg(res.ok ? "Saved. Refresh the homepage." : "Save failed");
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/admin" className="text-sm text-teal-800">\u2190 Dashboard</Link>
          <span className="text-sm text-slate-500">Terms</span>
        </div>
      </header>
      <form onSubmit={save} className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        <input className="w-full border rounded-lg px-3 py-2" placeholder="Eyebrow" value={data.eyebrow || ""} onChange={(e) => setData({ ...data, eyebrow: e.target.value })} />
        <input className="w-full border rounded-lg px-3 py-2 font-semibold" placeholder="Title" value={data.title || ""} onChange={(e) => setData({ ...data, title: e.target.value })} />
        <textarea className="w-full border rounded-lg px-3 py-2" placeholder="Subtitle" value={data.subtitle || ""} onChange={(e) => setData({ ...data, subtitle: e.target.value })} />
        {(data.cards || []).map((c: any, i: number) => (
          <div key={i} className="bg-white border rounded-xl p-4 space-y-2">
            <input className="w-full border rounded px-2 py-1 text-sm" value={c.label || ""} onChange={(e) => updateCard(i, "label", e.target.value)} placeholder="Label" />
            <input className="w-full border rounded px-2 py-1 text-sm" value={c.title || ""} onChange={(e) => updateCard(i, "title", e.target.value)} placeholder="Title" />
            <textarea className="w-full border rounded px-2 py-1 text-sm" value={c.text || ""} onChange={(e) => updateCard(i, "text", e.target.value)} placeholder="Text" />
          </div>
        ))}
        {msg && <p className="text-sm text-teal-700">{msg}</p>}
        <button className="w-full bg-teal-800 text-white py-2.5 rounded-lg font-semibold">Save terms</button>
      </form>
    </div>
  );
}
