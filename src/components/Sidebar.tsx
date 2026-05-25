"use client";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-zinc-900 text-white flex flex-col shrink-0">
      <div className="p-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight">plannit</h1>
        <p className="text-zinc-400 text-sm mt-1">Life planning tool</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        <div className="px-4 py-3 text-sm text-zinc-400 font-medium">How it works</div>
        <div className="flex items-center gap-3 px-4 py-2">
          <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">1</span>
          <span className="text-sm text-zinc-300">Enter your age & goals</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-2">
          <span className="w-6 h-6 rounded-full bg-indigo-600/60 text-white text-xs flex items-center justify-center font-bold">2</span>
          <span className="text-sm text-zinc-300">AI builds your timeline</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-2">
          <span className="w-6 h-6 rounded-full bg-indigo-600/40 text-white text-xs flex items-center justify-center font-bold">3</span>
          <span className="text-sm text-zinc-300">Browse options & prices</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-2">
          <span className="w-6 h-6 rounded-full bg-indigo-600/20 text-white text-xs flex items-center justify-center font-bold">4</span>
          <span className="text-sm text-zinc-300">Get your cost estimate</span>
        </div>
      </nav>
      <div className="p-4 border-t border-zinc-800">
        <p className="text-xs text-zinc-500 text-center">plannit v0.1.0</p>
      </div>
    </aside>
  );
}
