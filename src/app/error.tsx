"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#070605] px-6 text-center">
      <p className="text-stone-300">Something went wrong loading Aether.</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-full border border-white/15 px-5 py-2 text-sm text-stone-100 hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-sky-300/50"
      >
        Try again
      </button>
    </div>
  );
}
