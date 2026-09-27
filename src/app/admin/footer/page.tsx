"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function FooterEditorPage() {
  const [settings, setSettings] = useState<any>(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/settings", { credentials: "include" })
      .then((r) => r.json())
      .then(setSettings)
      .finally(() => setLoading(false));
  }, []);

  async function uploadLogo(file: File) {
    setUploading(true);
    setMsg("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("type", "logo");
      const res = await fetch("/api/upload", { method: "POST", body: fd, credentials: "include" });
      const data = await res.json();
      if (!data.success || !data.url) {
        setMsg(data.error || "Upload failed");
        return;
      }
      const next = { ...settings, footerLogo: data.url };
      setSettings(next);
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(next),
      });
      setMsg("Footer logo uploaded. Refresh the homepage.");
    } catch {
      setMsg("Upload failed");
    } finally {
      setUploading(false);
    }
  }

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

  const logoUrl = settings.footerLogo || settings.logo;

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

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Footer logo</label>
            {logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="Footer logo" className="h-12 w-auto mb-3 object-contain bg-slate-950 p-2 rounded" />
            )}
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadLogo(file);
              }}
              className="block w-full text-sm text-slate-600"
            />
            <p className="text-xs text-slate-500 mt-1">PNG or SVG works best on the dark footer.</p>
          </div>

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
          <button disabled={uploading} className="w-full bg-teal-800 text-white font-semibold py-2.5 rounded-lg disabled:opacity-60">
            {uploading ? "Uploading..." : "Save footer"}
          </button>
        </form>
      </main>
    </div>
  );
}
