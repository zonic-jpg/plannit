import { SiteHeader } from "@/components/layout/SiteHeader";
import { TripMap } from "@/components/map/TripMap";
import { ChatComposer } from "@/components/planner/ChatComposer";
import { PreferencePanel } from "@/components/planner/PreferencePanel";
import { PlanResults } from "@/components/results/PlanResults";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(251,191,36,0.12),transparent)]" />
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 pb-24 pt-10">
        <section className="mb-14 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.28em] text-amber-200/70">
            AI-native travel companion
          </p>
          <h1 className="mt-4 text-4xl font-light leading-tight text-stone-50 sm:text-5xl">
            Montenegro, scored and staged — from Abuja to the Adriatic in five
            calm days.
          </h1>
          <p className="mt-4 text-lg text-stone-400">
            Describe your mood, tune the preference engine, and receive ranked
            destinations, a live cost band, and a cinematic day-by-day flow.
          </p>
        </section>

        <section id="planner" className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <PreferencePanel />
          <div className="space-y-6">
            <ChatComposer />
            <TripMap />
          </div>
        </section>

        <div className="mt-12">
          <PlanResults />
        </div>
      </main>
    </div>
  );
}
