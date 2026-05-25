"use client";

import Image from "next/image";
import { useEffect } from "react";
import type { BrandPlacement } from "@/lib/siteConfig";
import { trackEvent } from "@/lib/analytics";

interface BrandCardProps {
  brand: BrandPlacement;
  goalCategory: string;
  userId: string | null;
}

export default function BrandCard({ brand, goalCategory, userId }: BrandCardProps) {
  useEffect(() => {
    trackEvent("brand_impression", {
      brandId: brand.id,
      userId,
      goalCategory,
      metadata: { brandName: brand.brand },
    });
  }, [brand.id, userId, goalCategory, brand.brand]);

  function handleClick() {
    trackEvent("brand_click", {
      brandId: brand.id,
      userId,
      goalCategory,
      metadata: { brandName: brand.brand, linkUrl: brand.linkUrl },
    });
    if (brand.linkUrl && brand.linkUrl !== "#") {
      window.open(brand.linkUrl, "_blank", "noopener");
    }
  }

  return (
    <button
      onClick={handleClick}
      className="w-full text-left bg-gradient-to-r from-accent-light to-white rounded-xl border border-accent/10 overflow-hidden flex items-center gap-4 p-4 hover:shadow-md transition-all group"
    >
      <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-card-bg">
        <Image
          src={brand.imageUrl}
          alt={brand.brand}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-foreground">{brand.brand}</p>
          <span className="text-[10px] text-accent/60 font-medium px-1.5 py-0.5 bg-accent/5 rounded">Sponsored</span>
        </div>
        <p className="text-xs text-muted mt-0.5">{brand.tagline}</p>
      </div>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-muted group-hover:text-accent transition-colors">
        <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
