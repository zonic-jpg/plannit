"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b border-zinc-100">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight text-foreground">
          plan<span className="text-accent">it</span>
        </Link>
        <p className="text-sm text-muted hidden sm:block">Made for the long view.</p>
      </div>
    </header>
  );
}
