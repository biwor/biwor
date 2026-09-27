"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function FooterEditorPage() {
  const [settings, setSettings] = useState<any>(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings", { credentials: "include" })
      .then((r) => r.json())
      .then(setSettings)
      .finally(() => setLoading(false));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(settings),
    });
    if (res.status === 401) {
      setMsg("Please log in again");
      return;
    }
    setMsg(res.ok ? "Footer saved. Refresh the homepage." : "Save failed");
  }

  if (loading || !settings) return <div className="min-h-screen flex items-center justify-center text-sm text-slate-500">Loading...</div>;

  const field = (key: string, label: string, multiline = false) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {multiline ? (
        <textarea
          value={settings[key] || ""}
          onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-teal-500"
        />
      ) : (
        <input
          value={settings[key] || ""}
          onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-teal-500"
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/admin" className="text-sm text-teal-800">← Dashboard</Link>
          <span className="text-sm text-slate-500">Footer</span>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={save} className="bg-white border rounded-2xl p-6 space-y-4">
          <h1 className="text-lg font-semibold">Footer content</h1>
          {field("footerText", "About text", true)}
          {field("footerCopyright", "Copyright line")}
          {field("footerCol2Title", "Links column title")}
          {field("footerCol3Title", "Contact column title")}
          {field("address", "Address")}
          {field("email", "Email")}
          {field("phone", "Phone")}
          {field("whatsapp", "WhatsApp number")}
          {field("facebookUrl", "Facebook URL")}
          {field("linkedinUrl", "LinkedIn URL")}
          {field("instagramUrl", "Instagram URL")}
          {field("twitterUrl", "X / Twitter URL")}
          {msg && <p className="text-sm text-teal-700">{msg}</p>}
          <button className="w-full bg-teal-800 text-white font-semibold py-2.5 rounded-lg">Save footer</button>
        </form>
      </main>
    </div>
  );
}
