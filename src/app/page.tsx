"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getSiteConfig } from "@/lib/siteConfig";
import type { SiteConfig } from "@/lib/siteConfig";
import { getSession } from "@/lib/auth";
import { CATEGORY_LABELS, CATEGORY_SUBTITLES, CATEGORY_TAGS, CATEGORY_ICONS } from "@/lib/types";
import type { GoalCategory } from "@/lib/types";

export default function HomePage() {
  const router = useRouter();
  const [cfg] = useState<SiteConfig>(() => getSiteConfig());
  const [showForm, setShowForm] = useState(false);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("NG");
  const [goals, setGoals] = useState("");
  const [loading, setLoading] = useState(false);

  function handleCTA() {
    const user = getSession();
    if (!user) {
      router.push("/auth");
      return;
    }
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!age || !goals.trim()) return;
    setLoading(true);
    const params = new URLSearchParams({ age, gender, country, goals: goals.trim() });
    router.push(`/results?${params.toString()}`);
  }

  const session = getSession();

  return (
    <div className="min-h-full flex flex-col bg-white">
      {/* Nav */}
      <header className="absolute top-0 left-0 right-0 z-20 px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-xl font-bold text-white tracking-tight drop-shadow-lg">{cfg.brandName}</span>
          <div className="flex items-center gap-3">
            {session ? (
              <>
                <span className="text-sm text-white/80 hidden sm:block">{session.name}</span>
                {session.isAdmin && (
                  <button onClick={() => router.push("/admin")} className="text-sm text-white/80 hover:text-white transition-colors">Admin</button>
                )}
                <button
                  onClick={() => { import("@/lib/auth").then((m) => { m.logout(); window.location.reload(); }); }}
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <button onClick={() => router.push("/auth")} className="text-sm font-medium text-white bg-white/20 backdrop-blur-sm hover:bg-white/30 px-5 py-2 rounded-full transition-colors">
                Sign in
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero — split layout: text left, image right */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden">
        {/* Image — right half on desktop, full background on mobile */}
        <div className="absolute inset-0 lg:left-1/2">
          <Image
            src={cfg.heroImageUrl}
            alt="Young person looking towards the future"
            fill
            className="object-cover object-top"
            priority
            sizes="100vw"
          />
        </div>
        {/* Gradient — dark on left for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/20 lg:from-black/90 lg:via-black/70 lg:to-transparent" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 py-32 lg:py-0">
          <div className="max-w-xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              {cfg.heroTitle}<br />
              <span className="text-accent">{cfg.heroAccent}</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-white/70 leading-relaxed max-w-md">
              {cfg.heroSubtitle}
            </p>

            <div className="mt-8 space-y-3 text-sm text-white/50">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center font-bold">1</span>
                <span>Tell us your age, goals, and dreams</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center font-bold">2</span>
                <span>AI organizes them into a costed timeline</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center font-bold">3</span>
                <span>Pick options, export your plan, sync to calendar</span>
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCTA}
                className="inline-flex items-center justify-center gap-2 bg-accent text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-accent/90 transition-all shadow-lg hover:shadow-xl"
              >
                {cfg.heroButtonText}
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              {!session && (
                <button
                  onClick={() => router.push("/auth")}
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-medium text-white border border-white/20 hover:bg-white/10 transition-colors"
                >
                  Create free account
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Input Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-foreground">What do you want from life?</h2>
                <button onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 text-muted">✕</button>
              </div>
              <p className="text-sm text-muted mb-6">Tap categories for inspiration, then describe your goals below.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Age</label>
                    <input type="number" min={16} max={80} value={age} onChange={(e) => setAge(e.target.value)} placeholder="25" required className="w-full px-3 py-2.5 bg-card-bg border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/40" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Gender</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)} required className="w-full px-3 py-2.5 bg-card-bg border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/40">
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non-binary">Non-binary</option>
                      <option value="prefer-not">Prefer not to say</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Country</label>
                    <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full px-3 py-2.5 bg-card-bg border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/40">
                      {cfg.countries.map((c) => (
                        <option key={c.code} value={c.code}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Category cards */}
                <div>
                  <label className="block text-xs font-medium text-foreground mb-2">Pick categories that matter to you</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {(["property", "vehicle", "education", "investment", "career", "family", "travel", "luxury", "health", "spiritual", "achievement", "other"] as GoalCategory[]).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          const hint = CATEGORY_SUBTITLES[cat].split(",")[0].toLowerCase();
                          if (!goals.toLowerCase().includes(hint.slice(0, 10))) {
                            setGoals((prev) => (prev ? prev + ", " : "") + hint);
                          }
                        }}
                        className="text-left p-3 rounded-xl border border-zinc-100 bg-card-bg hover:border-accent/30 transition-all"
                      >
                        <span className="text-lg">{CATEGORY_ICONS[cat]}</span>
                        <p className="text-xs font-semibold text-foreground mt-1">{CATEGORY_LABELS[cat]}</p>
                        <p className="text-[10px] text-muted leading-tight mt-0.5">{CATEGORY_SUBTITLES[cat]}</p>
                        <div className="flex gap-1 mt-1.5">
                          {CATEGORY_TAGS[cat].map((tag) => (
                            <span key={tag} className="text-[9px] uppercase tracking-wide text-muted/60 font-medium">{tag}</span>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Describe your goals in your own words</label>
                  <textarea value={goals} onChange={(e) => setGoals(e.target.value)} rows={4} required placeholder="I want to get a degree, buy a home, start a family, travel to Dubai, grow spiritually..." className="w-full px-3 py-2.5 bg-card-bg border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 resize-none" />
                </div>

                <button type="submit" disabled={loading} className="w-full py-4 bg-accent text-white text-base font-semibold rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-50">
                  {loading ? "Analyzing..." : "Plan My Life →"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Feature cards */}
      <section className="bg-card-bg py-16 md:py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {cfg.featureCards.map((card) => (
            <div key={card.title} className="bg-white rounded-2xl p-6 sm:p-8">
              <div className="text-2xl mb-4">{card.icon}</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{card.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-8">
        <p className="text-center text-sm text-muted">&copy; {new Date().getFullYear()} {cfg.footerText}</p>
      </footer>
    </div>
  );
}
