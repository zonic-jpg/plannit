"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/goals", label: "Goals", icon: "🎯" },
  { href: "/tasks", label: "Tasks", icon: "✅" },
  { href: "/schedule", label: "Schedule", icon: "📅" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-zinc-900 text-white flex flex-col shrink-0">
      <div className="p-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight">plannit</h1>
        <p className="text-zinc-400 text-sm mt-1">Life planning tool</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-indigo-600 text-white"
                  : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-zinc-800">
        <p className="text-xs text-zinc-500 text-center">plannit v0.1.0</p>
      </div>
    </aside>
  );
}
