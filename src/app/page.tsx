"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getSiteConfig } from "@/lib/siteConfig";
import type { SiteConfig } from "@/lib/siteConfig";
import { getSession } from "@/lib/auth";

export default function HomePage() {
  const router = useRouter();
  const [cfg] = useState<SiteConfig>(() => getSiteConfig());
  const [showForm, setShowForm] = useState(false);
  const [age, setAge] = useState("");
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
    const params = new URLSearchParams({ age, country, goals: goals.trim() });
    router.push(`/results?${params.toString()}`);
  }

  return (
    <div className="min-h-full flex flex-col">
      {/* Nav */}
      <header className="absolute top-0 left-0 right-0 z-20 px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-xl font-bold text-white tracking-tight drop-shadow">{cfg.brandName}</span>
          <div className="flex items-center gap-4">
            {getSession() ? (
              <>
                <span className="text-sm text-white/80 hidden sm:block">{getSession()?.name}</span>
                {getSession()?.isAdmin && (
                  <button onClick={() => router.push("/admin")} className="text-sm text-white/80 hover:text-white">Admin</button>
                )}
                <button
                  onClick={() => { import("@/lib/auth").then((m) => { m.logout(); window.location.reload(); }); }}
                  className="text-sm text-white/60 hover:text-white"
                >
                  Sign out
                </button>
              </>
            ) : (
              <button onClick={() => router.push("/auth")} className="text-sm font-medium text-white/90 hover:text-white px-4 py-2 border border-white/30 rounded-full backdrop-blur-sm">
                Sign in
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex-1 flex flex-col items-center justify-center px-6 py-28 sm:py-32 md:py-40 lg:py-48 text-center overflow-hidden min-h-[90vh]">
        <div className="absolute inset-0 -z-10">
          <Image
            src={cfg.heroImageUrl}
            alt="Looking towards the future"
            fill
            className="object-cover object-top"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-white" />
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight max-w-3xl text-white drop-shadow-lg">
          {cfg.heroTitle} <span className="text-accent">{cfg.heroAccent}</span>
        </h1>
        <p className="mt-6 text-base sm:text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed drop-shadow">
          {cfg.heroSubtitle}
        </p>
        <button
          onClick={handleCTA}
          className="mt-10 inline-flex items-center gap-2 bg-accent text-white px-8 py-4 rounded-full text-base sm:text-lg font-medium hover:bg-accent/90 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
        >
          {cfg.heroButtonText}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </section>

      {/* Input Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Tell us about you</h2>
                <button onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 text-muted">✕</button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Age</label>
                    <input type="number" min={16} max={80} value={age} onChange={(e) => setAge(e.target.value)} placeholder="25" required className="w-full px-4 py-3 bg-card-bg border-0 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-accent/40" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Country</label>
                    <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full px-4 py-3 bg-card-bg border-0 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-accent/40">
                      {cfg.countries.map((c) => (
                        <option key={c.code} value={c.code}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Your life goals</label>
                  <p className="text-xs text-muted mb-2">Write freely — e.g. &quot;Get a master&apos;s degree, buy a home, start a family, buy a BMW, travel to Dubai&quot;</p>
                  <textarea value={goals} onChange={(e) => setGoals(e.target.value)} rows={5} required placeholder="I want to get a bachelor's degree, then a master's, buy a car, purchase a home, get married, travel to Dubai, and start investing..." className="w-full px-4 py-3 bg-card-bg border-0 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-accent/40 resize-none" />
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
