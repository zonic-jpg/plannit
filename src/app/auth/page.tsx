"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register, login } from "@/lib/auth";
import { trackEvent } from "@/lib/analytics";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (mode === "register") {
      if (!name.trim()) { setError("Name is required."); return; }
      const result = register(name.trim(), email.trim(), password);
      if (!result.ok) { setError(result.error); return; }
      trackEvent("signup", { userId: result.user.id, metadata: { email: email.trim() } });
    } else {
      const result = login(email.trim(), password);
      if (!result.ok) { setError(result.error); return; }
      trackEvent("login", { userId: result.user.id, metadata: { email: email.trim() } });
    }
    router.push("/");
  }

  return (
    <div className="min-h-full flex items-center justify-center px-4 py-16 bg-card-bg">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">RUBBA</h1>
          <p className="text-muted mt-1">Plan your life, your way.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex bg-card-bg rounded-xl p-1 mb-6">
            <button
              onClick={() => { setMode("register"); setError(""); }}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${mode === "register" ? "bg-white text-foreground shadow-sm" : "text-muted"}`}
            >
              Create account
            </button>
            <button
              onClick={() => { setMode("login"); setError(""); }}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${mode === "login" ? "bg-white text-foreground shadow-sm" : "text-muted"}`}
            >
              Sign in
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required={mode === "register"}
                  className="w-full px-4 py-3 bg-card-bg border-0 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 bg-card-bg border-0 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-4 py-3 bg-card-bg border-0 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">{error}</p>}

            <button type="submit" className="w-full py-4 bg-accent text-white text-base font-semibold rounded-xl hover:bg-accent/90 transition-colors">
              {mode === "register" ? "Create free account" : "Sign in"}
            </button>
          </form>

          <p className="text-xs text-muted text-center mt-4">
            {mode === "register" ? "No payment required. Completely free." : "Welcome back."}
          </p>
        </div>
      </div>
    </div>
  );
}
