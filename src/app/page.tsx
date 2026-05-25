"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { COUNTRIES } from "@/lib/types";

export default function HomePage() {
  const router = useRouter();
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("NG");
  const [goals, setGoals] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!age || !goals.trim()) return;
    setLoading(true);
    const params = new URLSearchParams({ age, country, goals: goals.trim() });
    router.push(`/results?${params.toString()}`);
  }

  return (
    <div className="min-h-full flex flex-col">
      <Header />

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-16 md:py-24 lg:py-32 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight max-w-3xl">
          Your life, <span className="text-accent">planned.</span>
        </h1>
        <p className="mt-6 text-base sm:text-lg md:text-xl text-muted max-w-2xl leading-relaxed">
          Turn every ambition — a first home, a wedding, your kid&apos;s
          university, or your 50th birthday — into a costed, editable Life Plan.
        </p>
        <button
          onClick={() => setShowForm(true)}
          className="mt-10 inline-flex items-center gap-2 bg-accent text-white px-8 py-4 rounded-full text-base sm:text-lg font-medium hover:bg-accent/90 transition-colors"
        >
          Build my Life Plan
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="ml-1">
            <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </section>

      {/* Input Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Tell us about you</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 text-muted"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Age</label>
                    <input
                      type="number"
                      min={16}
                      max={80}
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="25"
                      required
                      className="w-full px-4 py-3 bg-card-bg border-0 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-accent/40"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Country</label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-4 py-3 bg-card-bg border-0 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-accent/40"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Your life goals
                  </label>
                  <p className="text-xs text-muted mb-2">
                    Write freely — e.g. &quot;Get a master&apos;s degree, buy a home, start a family, buy a BMW, travel to Dubai&quot;
                  </p>
                  <textarea
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                    rows={5}
                    required
                    placeholder="I want to get a bachelor's degree, then a master's, buy a car, purchase a home, get married, travel to Dubai, and start investing..."
                    className="w-full px-4 py-3 bg-card-bg border-0 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-accent/40 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-accent text-white text-base font-semibold rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-50"
                >
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
          {[
            {
              icon: "🎯",
              title: "Pick your goals",
              desc: "Choose from 12 life categories or invent your own — spiritual, family, milestones, anything.",
            },
            {
              icon: "✦",
              title: "See the real cost",
              desc: "Live inflation-aware valuations show what each goal will cost the year you want it.",
            },
            {
              icon: "📄",
              title: "Export your plan",
              desc: "A clean PDF report you can save, share with your partner, or take to your advisor.",
            },
          ].map((card) => (
            <div key={card.title} className="bg-white rounded-2xl p-6 sm:p-8">
              <div className="text-2xl mb-4">{card.icon}</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{card.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
