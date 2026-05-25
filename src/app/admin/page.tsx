"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getSiteConfig, saveSiteConfig } from "@/lib/siteConfig";
import type { SiteConfig, BrandPlacement } from "@/lib/siteConfig";
import { getOverviewAnalytics, getBrandAnalytics } from "@/lib/analytics";
import type { OverviewAnalytics, BrandAnalytics } from "@/lib/analytics";

type Tab = "site" | "countries" | "brands" | "analytics";

export default function AdminPage() {
  const router = useRouter();
  const [cfg, setCfg] = useState<SiteConfig>(() => getSiteConfig());
  const [tab, setTab] = useState<Tab>("site");
  const [overview] = useState<OverviewAnalytics>(() => getOverviewAnalytics());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const user = getSession();
    if (!user?.isAdmin) { router.push("/"); }
  }, [router]);

  function computeBrandStats() {
    const stats: Record<string, BrandAnalytics> = {};
    for (const b of cfg.brandPlacements) {
      stats[b.id] = getBrandAnalytics(b.id);
    }
    return stats;
  }

  const brandStats = tab === "analytics" ? computeBrandStats() : {};

  function save() {
    if (!cfg) return;
    saveSiteConfig(cfg);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function updateField<K extends keyof SiteConfig>(key: K, value: SiteConfig[K]) {
    setCfg((prev) => prev ? { ...prev, [key]: value } : prev);
  }

  if (!cfg) return null;

  const tabs: { id: Tab; label: string }[] = [
    { id: "site", label: "Site Content" },
    { id: "countries", label: "Countries" },
    { id: "brands", label: "Brand Placements" },
    { id: "analytics", label: "Analytics" },
  ];

  return (
    <div className="min-h-full bg-card-bg">
      {/* Header */}
      <header className="bg-white border-b border-zinc-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/")} className="text-xl font-bold text-foreground">RUBBA</button>
            <span className="text-xs font-medium text-white bg-accent px-2 py-0.5 rounded">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            {saved && <span className="text-sm text-green-600 font-medium">Saved!</span>}
            <button onClick={save} className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors">
              Save changes
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 mb-8 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                tab === t.id ? "bg-accent text-white" : "text-muted hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Site Content */}
        {tab === "site" && (
          <div className="space-y-6">
            <Section title="Branding">
              <Field label="Brand name" value={cfg.brandName} onChange={(v) => updateField("brandName", v)} />
              <Field label="Tagline" value={cfg.tagline} onChange={(v) => updateField("tagline", v)} />
              <Field label="Footer text" value={cfg.footerText} onChange={(v) => updateField("footerText", v)} />
            </Section>
            <Section title="Hero Section">
              <Field label="Title (before accent)" value={cfg.heroTitle} onChange={(v) => updateField("heroTitle", v)} />
              <Field label="Accent word" value={cfg.heroAccent} onChange={(v) => updateField("heroAccent", v)} />
              <Field label="Subtitle" value={cfg.heroSubtitle} onChange={(v) => updateField("heroSubtitle", v)} multiline />
              <Field label="Button text" value={cfg.heroButtonText} onChange={(v) => updateField("heroButtonText", v)} />
              <Field label="Hero image URL" value={cfg.heroImageUrl} onChange={(v) => updateField("heroImageUrl", v)} />
            </Section>
            <Section title="Feature Cards">
              {cfg.featureCards.map((card, i) => (
                <div key={i} className="bg-card-bg rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted">Card {i + 1}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Field label="Icon" value={card.icon} onChange={(v) => {
                      const cards = [...cfg.featureCards];
                      cards[i] = { ...cards[i], icon: v };
                      updateField("featureCards", cards);
                    }} />
                    <Field label="Title" value={card.title} onChange={(v) => {
                      const cards = [...cfg.featureCards];
                      cards[i] = { ...cards[i], title: v };
                      updateField("featureCards", cards);
                    }} />
                  </div>
                  <Field label="Description" value={card.desc} onChange={(v) => {
                    const cards = [...cfg.featureCards];
                    cards[i] = { ...cards[i], desc: v };
                    updateField("featureCards", cards);
                  }} multiline />
                </div>
              ))}
            </Section>
          </div>
        )}

        {/* Countries */}
        {tab === "countries" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-foreground">Countries & Inflation Rates</h2>
              <button
                onClick={() => updateField("countries", [...cfg.countries, { code: "", name: "", currency: "", inflationRate: 0.05 }])}
                className="px-3 py-1.5 text-sm font-medium text-accent bg-accent-light rounded-lg"
              >
                + Add country
              </button>
            </div>
            {cfg.countries.map((c, i) => (
              <div key={i} className="bg-white rounded-xl p-4 grid grid-cols-2 sm:grid-cols-5 gap-3 items-end">
                <Field label="Code" value={c.code} onChange={(v) => {
                  const countries = [...cfg.countries];
                  countries[i] = { ...countries[i], code: v };
                  updateField("countries", countries);
                }} />
                <Field label="Name" value={c.name} onChange={(v) => {
                  const countries = [...cfg.countries];
                  countries[i] = { ...countries[i], name: v };
                  updateField("countries", countries);
                }} />
                <Field label="Currency" value={c.currency} onChange={(v) => {
                  const countries = [...cfg.countries];
                  countries[i] = { ...countries[i], currency: v };
                  updateField("countries", countries);
                }} />
                <Field label="Inflation %" value={String(Math.round(c.inflationRate * 100))} onChange={(v) => {
                  const countries = [...cfg.countries];
                  countries[i] = { ...countries[i], inflationRate: parseFloat(v) / 100 || 0 };
                  updateField("countries", countries);
                }} />
                <button
                  onClick={() => updateField("countries", cfg.countries.filter((_, j) => j !== i))}
                  className="text-xs text-red-500 hover:text-red-700 font-medium py-3"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Brand Placements */}
        {tab === "brands" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-foreground">Brand Placements</h2>
              <button
                onClick={() => {
                  const newBrand: BrandPlacement = {
                    id: crypto.randomUUID(),
                    brand: "New Brand",
                    tagline: "Brand tagline",
                    imageUrl: "/images/goals/other.jpg",
                    linkUrl: "#",
                    categories: ["other"],
                    active: true,
                  };
                  updateField("brandPlacements", [...cfg.brandPlacements, newBrand]);
                }}
                className="px-3 py-1.5 text-sm font-medium text-accent bg-accent-light rounded-lg"
              >
                + Add brand
              </button>
            </div>
            {cfg.brandPlacements.map((b, i) => (
              <div key={b.id} className="bg-white rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-muted">ID: {b.id}</span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={b.active}
                        onChange={(e) => {
                          const brands = [...cfg.brandPlacements];
                          brands[i] = { ...brands[i], active: e.target.checked };
                          updateField("brandPlacements", brands);
                        }}
                        className="accent-accent"
                      />
                      Active
                    </label>
                    <button
                      onClick={() => updateField("brandPlacements", cfg.brandPlacements.filter((_, j) => j !== i))}
                      className="text-xs text-red-500 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Brand name" value={b.brand} onChange={(v) => {
                    const brands = [...cfg.brandPlacements];
                    brands[i] = { ...brands[i], brand: v };
                    updateField("brandPlacements", brands);
                  }} />
                  <Field label="Tagline" value={b.tagline} onChange={(v) => {
                    const brands = [...cfg.brandPlacements];
                    brands[i] = { ...brands[i], tagline: v };
                    updateField("brandPlacements", brands);
                  }} />
                  <Field label="Image URL" value={b.imageUrl} onChange={(v) => {
                    const brands = [...cfg.brandPlacements];
                    brands[i] = { ...brands[i], imageUrl: v };
                    updateField("brandPlacements", brands);
                  }} />
                  <Field label="Link URL" value={b.linkUrl} onChange={(v) => {
                    const brands = [...cfg.brandPlacements];
                    brands[i] = { ...brands[i], linkUrl: v };
                    updateField("brandPlacements", brands);
                  }} />
                </div>
                <Field label="Categories (comma-separated)" value={b.categories.join(", ")} onChange={(v) => {
                  const brands = [...cfg.brandPlacements];
                  brands[i] = { ...brands[i], categories: v.split(",").map((s) => s.trim()).filter(Boolean) };
                  updateField("brandPlacements", brands);
                }} />
              </div>
            ))}
          </div>
        )}

        {/* Analytics */}
        {tab === "analytics" && overview && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Stat label="Total Users" value={overview.totalUsers} />
              <Stat label="Plans Created" value={overview.totalPlans} />
              <Stat label="Brand Impressions" value={overview.totalBrandImpressions} />
              <Stat label="Brand Clicks" value={overview.totalBrandClicks} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Stat label="Overall CTR" value={`${(overview.overallCTR * 100).toFixed(1)}%`} />
              <Stat label="Signups (24h)" value={overview.recentSignups} />
            </div>

            {overview.topCategories.length > 0 && (
              <div className="bg-white rounded-xl p-6">
                <h3 className="text-sm font-semibold text-foreground mb-4">Top Categories</h3>
                <div className="space-y-2">
                  {overview.topCategories.map((c) => (
                    <div key={c.category} className="flex items-center justify-between text-sm">
                      <span className="text-foreground capitalize">{c.category}</span>
                      <span className="text-muted">{c.count} events</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <h2 className="text-lg font-semibold text-foreground">Brand Performance</h2>
            {cfg.brandPlacements.map((b) => {
              const stats = brandStats[b.id];
              if (!stats) return null;
              return (
                <div key={b.id} className="bg-white rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-semibold text-foreground">{b.brand}</h3>
                      <p className="text-xs text-muted font-mono">ID: {b.id}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${b.active ? "bg-green-50 text-green-700" : "bg-zinc-100 text-muted"}`}>
                      {b.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Stat label="Impressions" value={stats.impressions} small />
                    <Stat label="Clicks" value={stats.clicks} small />
                    <Stat label="CTR" value={`${(stats.ctr * 100).toFixed(1)}%`} small />
                    <Stat label="Unique Users" value={stats.uniqueUsers} small />
                  </div>
                  {Object.keys(stats.byCategory).length > 0 && (
                    <div className="mt-4 text-xs text-muted">
                      <p className="font-medium mb-1">By category:</p>
                      {Object.entries(stats.byCategory).map(([cat, data]) => (
                        <span key={cat} className="inline-block mr-3 capitalize">{cat}: {data.impressions}imp / {data.clicks}clk</span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, multiline }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  const cls = "w-full px-3 py-2 bg-card-bg border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/40";
  return (
    <div>
      <label className="block text-xs font-medium text-muted mb-1">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className={`${cls} resize-none`} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
    </div>
  );
}

function Stat({ label, value, small }: { label: string; value: string | number; small?: boolean }) {
  return (
    <div className={`bg-card-bg rounded-xl ${small ? "p-3" : "p-5"}`}>
      <p className="text-xs text-muted mb-1">{label}</p>
      <p className={`font-bold text-foreground ${small ? "text-lg" : "text-2xl"}`}>{value}</p>
    </div>
  );
}
