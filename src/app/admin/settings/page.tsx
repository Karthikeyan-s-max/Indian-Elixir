"use client";

import { useEffect, useState } from "react";

type Settings = {
  companyName: string;
  companyBlurb: string;
  aboutStory: string;
  supportEmail: string;
  supportPhone: string;
  helpQueriesEmail: string;
  orderWhatsApp: string;
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => setSettings(d.settings));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setMessage(null);
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    setSaving(false);
    setMessage(res.ok ? "Saved! Changes are live on the site." : data.error);
  }

  if (!settings) {
    return <p className="text-ink-muted">Loading settings...</p>;
  }

  const field = (key: keyof Settings, label: string, opts?: { textarea?: boolean; hint?: string }) => (
    <div>
      <label className="label-field">{label}</label>
      {opts?.textarea ? (
        <textarea
          value={settings[key]}
          onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
          rows={4}
          className="input-field"
        />
      ) : (
        <input
          value={settings[key]}
          onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
          className="input-field"
        />
      )}
      {opts?.hint && <p className="mt-1 text-xs text-ink-muted">{opts.hint}</p>}
    </div>
  );

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-forest">Site Settings</h1>
      <p className="mt-1 text-ink-muted">
        Update the information shown to customers on your website.
      </p>

      <form onSubmit={save} className="mt-10 max-w-2xl space-y-8">
        <div className="rounded-xl2 border border-forest/5 bg-white p-8 shadow-card">
          <h2 className="font-display text-xl font-bold text-forest">Company Info</h2>
          <div className="mt-6 space-y-5">
            {field("companyName", "Company Name")}
            {field("companyBlurb", "Short Company Description", { textarea: true, hint: "Shown in the footer under the logo." })}
            {field("aboutStory", "About Us / Our Story", { textarea: true, hint: "Shown on the Our Story page." })}
          </div>
        </div>

        <div className="rounded-xl2 border border-forest/5 bg-white p-8 shadow-card">
          <h2 className="font-display text-xl font-bold text-forest">Contact Details</h2>
          <div className="mt-6 space-y-5">
            {field("supportEmail", "Support Email")}
            {field("supportPhone", "Phone / WhatsApp Number (Business)")}
            {field("helpQueriesEmail", "Help & Queries Email")}
          </div>
        </div>

        <div className="rounded-xl2 border border-forest/5 bg-white p-8 shadow-card">
          <h2 className="font-display text-xl font-bold text-forest">Order Confirmation</h2>
          <div className="mt-6">
            {field("orderWhatsApp", "WhatsApp Number for Order Confirmations", {
              hint: "Digits only with country code, e.g. 919876543210. Customer orders open a WhatsApp chat to this number.",
            })}
          </div>
        </div>

        {message && <p className="rounded-lg bg-forest/5 px-4 py-3 text-sm text-forest">{message}</p>}

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
