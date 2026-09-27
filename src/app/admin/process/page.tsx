"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProcessAdmin() {
  const [data, setData] = useState<any>({ title: "", subtitle: "", eyebrow: "", steps: [] });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/sections", { credentials: "include" })
      .then((r) => r.json())
      .then((all) => setData(all.processRoadmap || { title: "From tech pack to delivery", subtitle: "", eyebrow: "How an order moves", steps: [] }));
  }, []);

  function updateStep(i: number, key: string, value: string) {
    const steps = [...(data.steps || [])];
    steps[i] = { ...steps[i], [key]: value };
    setData({ ...data, steps });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/sections", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ key: "processRoadmap", data }),
    });
    setMsg(res.ok ? "Saved. Refresh the homepage." : "Save failed");
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/admin" className="text-sm text-teal-800">\u2190 Dashboard</Link>
          <span className="text-sm text-slate-500">Process steps</span>
        </div>
      </header>
      <form onSubmit={save} className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        <input className="w-full border rounded-lg px-3 py-2" placeholder="Eyebrow" value={data.eyebrow || ""} onChange={(e) => setData({ ...data, eyebrow: e.target.value })} />
        <input className="w-full border rounded-lg px-3 py-2 font-semibold" placeholder="Title" value={data.title || ""} onChange={(e) => setData({ ...data, title: e.target.value })} />
        <textarea className="w-full border rounded-lg px-3 py-2" placeholder="Subtitle" value={data.subtitle || ""} onChange={(e) => setData({ ...data, subtitle: e.target.value })} />
        {(data.steps || []).map((st: any, i: number) => (
          <div key={i} className="bg-white border rounded-xl p-4 grid sm:grid-cols-2 gap-2">
            <input className="border rounded px-2 py-1 text-sm" value={st.n || ""} onChange={(e) => updateStep(i, "n", e.target.value)} placeholder="Step no" />
            <input className="border rounded px-2 py-1 text-sm" value={st.time || ""} onChange={(e) => updateStep(i, "time", e.target.value)} placeholder="Time" />
            <input className="border rounded px-2 py-1 text-sm sm:col-span-2" value={st.phaseTitle || ""} onChange={(e) => updateStep(i, "phaseTitle", e.target.value)} placeholder="Phase title" />
            <input className="border rounded px-2 py-1 text-sm sm:col-span-2" value={st.title || ""} onChange={(e) => updateStep(i, "title", e.target.value)} placeholder="Title" />
            <textarea className="border rounded px-2 py-1 text-sm sm:col-span-2" value={st.text || ""} onChange={(e) => updateStep(i, "text", e.target.value)} placeholder="Text" />
          </div>
        ))}
        <button type="button" className="text-sm text-teal-800" onClick={() => setData({ ...data, steps: [...(data.steps || []), { n: String((data.steps || []).length + 1).padStart(2, "0"), title: "", text: "", time: "", phaseTitle: "" }] })}>
          + Add step
        </button>
        {msg && <p className="text-sm text-teal-700">{msg}</p>}
        <button className="w-full bg-teal-800 text-white py-2.5 rounded-lg font-semibold">Save process</button>
      </form>
    </div>
  );
}
