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
  updateLegalAction,
} from "../actions";
import { RichEditor } from "@/components/ui/RichEditor";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Switch } from "@/components/ui/Switch";

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
      <label className="block text-sm font-medium text-on-surface">{label}</label>
      {children}
      {hint && <p className="text-xs text-on-surface-variant">{hint}</p>}
    </div>
  );
}

// Removed inputCls since we use Input component now

function SectionFooter({
  isPending,
  error,
}: {
  isPending: boolean;
  error: string | null;
}) {
  return (
    <div className="flex flex-col gap-3 pt-4 border-t border-outline-variant mt-4">
      {error && (
        <p className="text-xs text-error bg-error-container border border-error/20 rounded px-3 py-2">
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
        site_url: fd.get("site_url") as string,
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
            <Input
              name="site_name"
              type="text"
              required
              placeholder="e.g. Bhartendu Shikhar"
              defaultValue={settings?.site_name ?? "Bharatendu Shikhar"}
            />
          </Field>
          <Field label="Site URL *" hint="The canonical base URL for the site">
            <Input
              name="site_url"
              type="url"
              required
              placeholder="https://www.bhartendushikhar.com"
              defaultValue={settings?.site_url ?? ""}
            />
          </Field>
          <Field label="Light Logo URL" hint="Full URL to SVG or PNG logo for light mode">
            <Input
              name="site_logo_url"
              type="url"
              defaultValue={settings?.site_logo_url ?? ""}
              placeholder="https://..."
            />
          </Field>
          <Field label="Dark Logo URL" hint="Full URL to SVG or PNG logo for dark mode">
            <Input
              name="site_logo_dark_url"
              type="url"
              defaultValue={settings?.site_logo_dark_url ?? ""}
              placeholder="https://..."
            />
          </Field>
          <Field label="Favicon URL">
            <Input
              name="favicon_url"
              type="url"
              defaultValue={settings?.favicon_url ?? ""}
              placeholder="https://..."
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
        og_image_url: fd.get("og_image_url") as string,
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
          <Field label="Default Meta Title" hint="Recommended: 50–60 characters">
            <Input
              name="meta_title"
              type="text"
              maxLength={70}
              placeholder="e.g. Latest News & Updates"
              defaultValue={settings?.meta_title ?? ""}
            />
          </Field>
          <Field label="Default Meta Description" hint="Max 160 characters">
            <Textarea
              name="meta_description"
              rows={3}
              maxLength={160}
              placeholder="A short description of the site for search engines..."
              defaultValue={settings?.meta_description ?? ""}
            />
          </Field>
          <Field label="Default OG Image *" hint="Recommended: 1200 × 630 px">
            <Input
              name="og_image_url"
              type="url"
              required
              defaultValue={settings?.og_image_url ?? ""}
              placeholder="https://..."
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
              <Input
                name={p.name}
                type="url"
                defaultValue={p.val ?? ""}
                placeholder="https://..."
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
            <Input
              name="contact_email"
              type="email"
              defaultValue={settings?.contact_email ?? ""}
              placeholder="contact@example.com"
            />
          </Field>
          <Field label="Phone Number">
            <Input
              name="contact_phone"
              type="tel"
              defaultValue={settings?.contact_phone ?? ""}
              placeholder="+91 XXXXX XXXXX"
            />
          </Field>
          <Field label="Address">
            <Textarea
              name="contact_address"
              rows={3}
              defaultValue={settings?.contact_address ?? ""}
              placeholder="Street, City, State, PIN"
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
          <div className="flex items-center gap-3">
            <Switch
              id="maintenance_mode"
              name="maintenance_mode"
              value="true"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
            <div>
              <label htmlFor="maintenance_mode" className="text-sm font-medium text-on-surface cursor-pointer">
                Enable Maintenance Mode
              </label>
              <p className="text-xs text-on-surface-variant">
                Puts the public site into maintenance. Admin panel stays accessible.
              </p>
            </div>
          </div>
          {active && (
            <Field label="Maintenance Message (Optional)">
              <Textarea
                name="maintenance_message"
                rows={2}
                defaultValue={settings?.maintenance_message ?? ""}
                placeholder="We'll be back soon..."
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

// ─── Section: Advertisements ──────────────────────────────────────────────────

function AdvertisementsSection({ settings }: { settings: SettingsRow | null }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const [active, setActive] = useState(settings?.hide_all_ads ?? false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      // Must import dynamically or use top-level import
      const { updateAdvertisementsAction } = await import("../actions");
      const res = await updateAdvertisementsAction({
        hide_all_ads: fd.get("hide_all_ads") === "true",
      });
      if (res.success) {
        toast.success("Advertisements Settings saved.");
      } else {
        const msg = res.error ?? "Unknown error";
        setError(msg);
        toast.error(msg);
      }
    });
  }

  return (
    <Card>
      <CardHeader>Global Advertisement Settings</CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-3">
            <Switch
              id="hide_all_ads"
              name="hide_all_ads"
              value="true"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
            <div>
              <label htmlFor="hide_all_ads" className="text-sm font-medium text-on-surface cursor-pointer">
                Disable & Hide All Ads Globally
              </label>
              <p className="text-xs text-on-surface-variant">
                If checked, no advertisements will be shown on the public site, regardless of their individual status.
              </p>
            </div>
          </div>
          <SectionFooter isPending={isPending} error={error} />
        </form>
      </CardBody>
    </Card>
  );
}

// ─── Section: Legal & Policies ──────────────────────────────────────────────────

function LegalSection({ settings }: { settings: SettingsRow | null }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const [copyrightText, setCopyrightText] = useState(settings?.copyright_text ?? "Bharatendu Shikhar. All rights reserved.");
  const [aboutUs, setAboutUs] = useState(settings?.about_us ?? "");
  const [privacyPolicy, setPrivacyPolicy] = useState(settings?.privacy_policy ?? "");
  const [termsConditions, setTermsConditions] = useState(settings?.terms_conditions ?? "");
  const [editorialPolicy, setEditorialPolicy] = useState(settings?.editorial_policy ?? "");
  const [correctionPolicy, setCorrectionPolicy] = useState(settings?.correction_policy ?? "");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await updateLegalAction({
        copyright_text: copyrightText || null,
        about_us: aboutUs || null,
        privacy_policy: privacyPolicy || null,
        terms_conditions: termsConditions || null,
        editorial_policy: editorialPolicy || null,
        correction_policy: correctionPolicy || null,
      });
      if (res.success) {
        toast.success("Legal & Policies saved.");
      } else {
        const msg = res.error ?? "Unknown error";
        setError(msg);
        toast.error(msg);
      }
    });
  }

  return (
    <Card>
      <CardHeader>Legal & Policies</CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Field label="Copyright Text">
            <Input
              type="text"
              name="copyright_text"
              value={copyrightText}
              onChange={(e) => setCopyrightText(e.target.value)}
              placeholder="e.g. Bharatendu Shikhar. All rights reserved."
            />
          </Field>
          <Field label="About Us">
            <RichEditor value={aboutUs} onChange={setAboutUs} />
          </Field>
          <Field label="Privacy Policy">
            <RichEditor value={privacyPolicy} onChange={setPrivacyPolicy} />
          </Field>
          <Field label="Terms & Conditions">
            <RichEditor value={termsConditions} onChange={setTermsConditions} />
          </Field>
          <Field label="Editorial Policy">
            <RichEditor value={editorialPolicy} onChange={setEditorialPolicy} />
          </Field>
          <Field label="Correction Policy">
            <RichEditor value={correctionPolicy} onChange={setCorrectionPolicy} />
          </Field>
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
    { id: "advertisements", label: "Advertisements" },
    { id: "legal", label: "Legal & Policies" },
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
        <div className="cms-card p-4 sm:p-6 md:p-8">
          <h2 className="cms-card-label mb-6">
            {tabs.find((t) => t.id === activeTab)?.label}
          </h2>
          {activeTab === "site" && <SiteInfoSection settings={settings} />}
          {activeTab === "seo" && <SeoSection settings={settings} />}
          {activeTab === "social" && <SocialSection settings={settings} />}
          {activeTab === "contact" && <ContactSection settings={settings} />}
          { activeTab === "advertisements" && <AdvertisementsSection settings={settings} /> }
          { activeTab === "legal" && <LegalSection settings={settings} /> }
          { activeTab === "maintenance" && <MaintenanceSection settings={settings} /> }
        </div>
      </div>
    </div>
  );
}
