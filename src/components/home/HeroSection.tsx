import Image from "next/image";
import { copy } from "@/content/en";

export function HeroSection() {
  return (
    <section className="relative mb-8 min-h-[52vh] overflow-hidden rounded-3xl border border-white/10">
      <Image
        src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&q=80"
        alt="Bay of Kotor, Montenegro at golden hour"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#070605] via-[#070605]/70 to-[#070605]/20" />
      <div className="relative z-10 flex h-full min-h-[52vh] flex-col justify-end p-6 sm:p-10">
        <p className="text-xs uppercase tracking-[0.28em] text-sky-200/80">
          {copy.tagline}
        </p>
        <h1 className="mt-3 max-w-2xl text-4xl font-light leading-tight text-stone-50 sm:text-5xl">
          {copy.heroTitle}
        </h1>
        <p className="mt-3 max-w-xl text-base text-stone-300 sm:text-lg">
          {copy.heroSubtitle}
        </p>
      </div>
    </section>
  );
}
