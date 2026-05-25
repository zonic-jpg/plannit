"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { COUNTRIES } from "@/lib/types";

export default function HomePage() {
  const router = useRouter();
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("NG");
  const [goals, setGoals] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!age || !goals.trim()) return;
    setLoading(true);
    const params = new URLSearchParams({
      age,
      country,
      goals: goals.trim(),
    });
    router.push(`/results?${params.toString()}`);
  }

  return (
    <div className="min-h-full flex flex-col">
      <div className="relative h-72 shrink-0">
        <Image
          src="/images/woman-planning.jpg"
          alt="Plan your life goals"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/50 to-transparent flex items-center">
          <div className="px-10">
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
              Plan your best life
            </h1>
            <p className="text-indigo-100 text-lg max-w-lg">
              Tell us your age and your dreams. We&apos;ll organize them into a
              timeline, cost them out, and show you how to get there.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-8 max-w-3xl mx-auto w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-zinc-800 mb-2">
                Your current age
              </label>
              <input
                type="number"
                min={16}
                max={80}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 25"
                required
                className="w-full px-4 py-3 border border-zinc-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-800 mb-2">
                Your country
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-3 border border-zinc-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-800 mb-2">
              What are your life goals?
            </label>
            <p className="text-xs text-zinc-500 mb-2">
              Write freely — e.g. &quot;Get a master&apos;s degree, buy a house
              in Lagos, start a family, buy a BMW, travel to Dubai, start my
              own business, invest for retirement&quot;
            </p>
            <textarea
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              rows={6}
              required
              placeholder="I want to get a bachelor's degree, then a master's degree, buy a car, purchase a home, get married, travel to Dubai, buy a Rolex, and start investing..."
              className="w-full px-4 py-3 border border-zinc-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white text-lg font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Analyzing your goals..." : "Plan My Life"}
          </button>
        </form>

        <div className="mt-10 grid grid-cols-3 gap-4">
          <div className="relative rounded-xl overflow-hidden h-36 group">
            <Image src="/images/goals-motivation.jpg" alt="Goals" fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
              <p className="text-white text-sm font-medium">Set Goals</p>
            </div>
          </div>
          <div className="relative rounded-xl overflow-hidden h-36 group">
            <Image src="/images/productivity.jpg" alt="Plan" fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
              <p className="text-white text-sm font-medium">See Costs</p>
            </div>
          </div>
          <div className="relative rounded-xl overflow-hidden h-36 group">
            <Image src="/images/schedule-focus.jpg" alt="Achieve" fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
              <p className="text-white text-sm font-medium">Achieve Dreams</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
