"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminSecurityPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setError("");
    if (newPassword !== confirm) {
      setError("New passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.status === 401) {
        setError("Please log in again");
        return;
      }
      if (data.success) {
        setMsg("Password updated");
        setCurrentPassword("");
        setNewPassword("");
        setConfirm("");
      } else {
        setError(data.error || "Failed to update password");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200/80">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/admin" className="text-sm font-medium text-teal-800">
            ← Dashboard
          </Link>
          <span className="text-sm text-neutral-500">Change password</span>
        </div>
      </header>
      <main className="max-w-lg mx-auto px-4 py-10">
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
          <h1 className="text-lg font-semibold text-slate-900 mb-1">Admin password</h1>
          <p className="text-sm text-slate-500 mb-6">Use a new password that only you know. Minimum 8 characters.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Current password</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-teal-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">New password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-teal-500" minLength={8} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirm new password</label>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-teal-500" minLength={8} required />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {msg && <p className="text-sm text-teal-700">{msg}</p>}
            <button type="submit" disabled={loading} className="w-full bg-teal-800 hover:bg-teal-900 text-white font-semibold py-2.5 rounded-lg disabled:opacity-60">
              {loading ? "Saving..." : "Update password"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
