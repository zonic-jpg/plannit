"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b border-zinc-100">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight text-foreground">
          RUBBA
        </Link>
        <p className="text-sm text-muted hidden sm:block">Plan your life, your way.</p>
      </div>
    </header>
  );
}
