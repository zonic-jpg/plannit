import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#070605]/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-200/30 bg-amber-100/10 text-sm font-medium text-amber-100">
            Æ
          </span>
          <div>
            <p className="text-sm font-medium tracking-[0.22em] text-stone-100">
              AETHER
            </p>
            <p className="text-[10px] uppercase tracking-[0.28em] text-stone-500">
              Montenegro MVP
            </p>
          </div>
        </Link>
        <nav className="hidden gap-6 text-xs uppercase tracking-[0.16em] text-stone-400 sm:flex">
          <a href="#planner" className="hover:text-stone-100">
            Plan
          </a>
          <a href="#results" className="hover:text-stone-100">
            Results
          </a>
        </nav>
      </div>
    </header>
  );
}
