"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import type { SettingsRow } from "../types";
import { useToast } from "@/components/ui/Toast";
import {
  updateSiteInfoAction,
  updateSeoAction,
  updateSocialAction,
  updateContactAction,
  updateMaintenanceAction,
} from "../actions";

// ─── Shared primitives ────────────────────────────────────────────────────────

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

const inputCls =
  "w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#CC2200] transition-colors";

function SectionFooter({
  isPending,
  error,
}: {
  isPending: boolean;
  error: string | null;
}) {
  return (
    <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
          {error}
        </p>
      )}
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}

// ─── Section: Site Info ───────────────────────────────────────────────────────

function SiteInfoSection({ settings }: { settings: SettingsRow | null }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await updateSiteInfoAction({
        site_name: fd.get("site_name") as string,
        site_tagline: (fd.get("site_tagline") as string) || null,
        site_logo_url: (fd.get("site_logo_url") as string) || null,
        site_logo_dark_url: (fd.get("site_logo_dark_url") as string) || null,
        favicon_url: (fd.get("favicon_url") as string) || null,
      });
      if (res.success) {
        toast.success("Site Information saved.");
      } else {
        const msg = res.error ?? "Unknown error";
        setError(msg);
        toast.error(msg);
      }
    });
  }

  return (
    <Card>
      <CardHeader>Site Information</CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Site Name *">
            <input
              name="site_name"
              type="text"
              required
              defaultValue={settings?.site_name ?? "Bharatendu Shikhar"}
              className={inputCls}
            />
          </Field>
          <Field label="Light Logo URL" hint="Full URL to SVG or PNG logo for light mode">
            <input
              name="site_logo_url"
              type="url"
              defaultValue={settings?.site_logo_url ?? ""}
              placeholder="https://..."
              className={inputCls}
            />
          </Field>
          <Field label="Dark Logo URL" hint="Full URL to SVG or PNG logo for dark mode">
            <input
              name="site_logo_dark_url"
              type="url"
              defaultValue={settings?.site_logo_dark_url ?? ""}
              placeholder="https://..."
              className={inputCls}
            />
          </Field>
          <Field label="Favicon URL">
            <input
              name="favicon_url"
              type="url"
              defaultValue={settings?.favicon_url ?? ""}
              placeholder="https://..."
              className={inputCls}
            />
          </Field>
          <SectionFooter isPending={isPending} error={error} />
        </form>
      </CardBody>
    </Card>
  );
}

// ─── Section: SEO ────────────────────────────────────────────────────────────

function SeoSection({ settings }: { settings: SettingsRow | null }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await updateSeoAction({
        meta_title: (fd.get("meta_title") as string) || null,
        meta_description: (fd.get("meta_description") as string) || null,
        meta_keywords: (fd.get("meta_keywords") as string) || null,
        og_image_url: (fd.get("og_image_url") as string) || null,
      });
      if (res.success) {
        toast.success("SEO Defaults saved.");
      } else {
        const msg = res.error ?? "Unknown error";
        setError(msg);
        toast.error(msg);
      }
    });
  }

  return (
    <Card>
      <CardHeader>SEO Defaults</CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Default Meta Title" hint="Max 70 characters">
            <input
              name="meta_title"
              type="text"
              maxLength={70}
              defaultValue={settings?.meta_title ?? ""}
              className={inputCls}
            />
          </Field>
          <Field label="Default Meta Description" hint="Max 160 characters">
            <textarea
              name="meta_description"
              rows={3}
              maxLength={160}
              defaultValue={settings?.meta_description ?? ""}
              className={inputCls}
            />
          </Field>
          <Field label="Default Keywords" hint="Comma-separated">
            <input
              name="meta_keywords"
              type="text"
              defaultValue={settings?.meta_keywords ?? ""}
              placeholder="news, india, hindi"
              className={inputCls}
            />
          </Field>
          <Field label="Open Graph Image URL">
            <input
              name="og_image_url"
              type="url"
              defaultValue={settings?.og_image_url ?? ""}
              placeholder="https://..."
              className={inputCls}
            />
          </Field>
          <SectionFooter isPending={isPending} error={error} />
        </form>
      </CardBody>
    </Card>
  );
}

// ─── Section: Social Media ────────────────────────────────────────────────────

function SocialSection({ settings }: { settings: SettingsRow | null }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const platforms = [
    { name: "facebook_url", label: "Facebook", val: settings?.facebook_url },
    { name: "twitter_url", label: "Twitter / X", val: settings?.twitter_url },
    { name: "instagram_url", label: "Instagram", val: settings?.instagram_url },
    { name: "youtube_url", label: "YouTube", val: settings?.youtube_url },
    { name: "linkedin_url", label: "LinkedIn", val: settings?.linkedin_url },
  ] as const;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await updateSocialAction({
        facebook_url: (fd.get("facebook_url") as string) || null,
        twitter_url: (fd.get("twitter_url") as string) || null,
        instagram_url: (fd.get("instagram_url") as string) || null,
        youtube_url: (fd.get("youtube_url") as string) || null,
        linkedin_url: (fd.get("linkedin_url") as string) || null,
      });
      if (res.success) {
        toast.success("Social Media Links saved.");
      } else {
        const msg = res.error ?? "Unknown error";
        setError(msg);
        toast.error(msg);
      }
    });
  }

  return (
    <Card>
      <CardHeader>Social Media Links</CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          {platforms.map((p) => (
            <Field key={p.name} label={p.label}>
              <input
                name={p.name}
                type="url"
                defaultValue={p.val ?? ""}
                placeholder="https://..."
                className={inputCls}
              />
            </Field>
          ))}
          <SectionFooter isPending={isPending} error={error} />
        </form>
      </CardBody>
    </Card>
  );
}

// ─── Section: Contact ─────────────────────────────────────────────────────────

function ContactSection({ settings }: { settings: SettingsRow | null }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await updateContactAction({
        contact_email: (fd.get("contact_email") as string) || null,
        contact_phone: (fd.get("contact_phone") as string) || null,
        contact_address: (fd.get("contact_address") as string) || null,
      });
      if (res.success) {
        toast.success("Contact Information saved.");
      } else {
        const msg = res.error ?? "Unknown error";
        setError(msg);
        toast.error(msg);
      }
    });
  }

  return (
    <Card>
      <CardHeader>Contact Information</CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Contact Email">
            <input
              name="contact_email"
              type="email"
              defaultValue={settings?.contact_email ?? ""}
              placeholder="contact@example.com"
              className={inputCls}
            />
          </Field>
          <Field label="Phone Number">
            <input
              name="contact_phone"
              type="tel"
              defaultValue={settings?.contact_phone ?? ""}
              placeholder="+91 XXXXX XXXXX"
              className={inputCls}
            />
          </Field>
          <Field label="Address">
            <textarea
              name="contact_address"
              rows={3}
              defaultValue={settings?.contact_address ?? ""}
              placeholder="Street, City, State, PIN"
              className={inputCls}
            />
          </Field>
          <SectionFooter isPending={isPending} error={error} />
        </form>
      </CardBody>
    </Card>
  );
}

// ─── Section: Maintenance ─────────────────────────────────────────────────────

function MaintenanceSection({ settings }: { settings: SettingsRow | null }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const [active, setActive] = useState(settings?.maintenance_mode ?? false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await updateMaintenanceAction({
        maintenance_mode: fd.get("maintenance_mode") === "true",
        maintenance_message: (fd.get("maintenance_message") as string) || null,
      });
      if (res.success) {
        toast.success("Maintenance Mode Settings saved.");
      } else {
        const msg = res.error ?? "Unknown error";
        setError(msg);
        toast.error(msg);
      }
    });
  }

  return (
    <Card>
      <CardHeader>Maintenance Mode</CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-start gap-3">
            <input
              id="maintenance_mode"
              name="maintenance_mode"
              type="checkbox"
              value="true"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#CC2200] focus:ring-[#CC2200] self-center"
            />
            <div>
              <label htmlFor="maintenance_mode" className="text-sm font-medium text-gray-700">
                Enable Maintenance Mode
              </label>
              <p className="text-xs text-gray-400">
                Puts the public site into maintenance. Admin panel stays accessible.
              </p>
            </div>
          </div>
          {active && (
            <Field label="Maintenance Message (Optional)">
              <textarea
                name="maintenance_message"
                rows={2}
                defaultValue={settings?.maintenance_message ?? ""}
                placeholder="We'll be back soon..."
                className={inputCls}
              />
            </Field>
          )}
          {active && (
            <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
              <span>⚠</span>
              <span>The public-facing website will show the maintenance page until this is disabled.</span>
            </div>
          )}
          <SectionFooter isPending={isPending} error={error} />
        </form>
      </CardBody>
    </Card>
  );
}

// ─── Root Export ──────────────────────────────────────────────────────────────

export function SettingsForm({ settings }: { settings: SettingsRow | null }) {
  const [activeTab, setActiveTab] = useState("site");

  const tabs = [
    { id: "site", label: "Site Info" },
    { id: "seo", label: "SEO" },
    { id: "social", label: "Social Media" },
    { id: "contact", label: "Contact" },
    { id: "maintenance", label: "Maintenance" },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar tabs */}
      <aside className="w-full md:w-52 shrink-0">
        <nav className="flex md:flex-col gap-1 md:gap-0.5 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-surface-container-high text-primary font-bold border-l-2 border-primary"
                    : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high border-transparent"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Form canvas */}
      <div className="flex-1 max-w-3xl">
        <div className="cms-card p-6 md:p-8">
          <h2 className="cms-card-label mb-6">
            {tabs.find((t) => t.id === activeTab)?.label}
          </h2>
          {activeTab === "site" && <SiteInfoSection settings={settings} />}
          {activeTab === "seo" && <SeoSection settings={settings} />}
          {activeTab === "social" && <SocialSection settings={settings} />}
          {activeTab === "contact" && <ContactSection settings={settings} />}
          {activeTab === "maintenance" && <MaintenanceSection settings={settings} />}
        </div>
      </div>
    </div>
  );
}
