"use client";

export interface SiteConfig {
  heroTitle: string;
  heroAccent: string;
  heroSubtitle: string;
  heroButtonText: string;
  heroImageUrl: string;
  featureCards: { icon: string; title: string; desc: string }[];
  footerText: string;
  brandName: string;
  tagline: string;
  countries: {
    code: string;
    name: string;
    currency: string;
    inflationRate: number;
  }[];
  brandPlacements: BrandPlacement[];
}

export interface BrandPlacement {
  id: string;
  brand: string;
  tagline: string;
  imageUrl: string;
  linkUrl: string;
  categories: string[];
  active: boolean;
}

const CONFIG_KEY = "rubba_site_config";

const DEFAULT_CONFIG: SiteConfig = {
  brandName: "RUBBA",
  tagline: "Plan your life, your way.",
  heroTitle: "Your life,",
  heroAccent: "planned.",
  heroSubtitle:
    "Turn every ambition — a first home, a wedding, your kid's university, or your 50th birthday — into a costed, editable Life Plan.",
  heroButtonText: "Build my Life Plan",
  heroImageUrl: "/images/hero.jpg",
  featureCards: [
    {
      icon: "🎯",
      title: "Pick your goals",
      desc: "Choose from 12 life categories or invent your own — spiritual, family, milestones, anything.",
    },
    {
      icon: "✦",
      title: "See the real cost",
      desc: "Live inflation-aware valuations show what each goal will cost the year you want it.",
    },
    {
      icon: "📄",
      title: "Export your plan",
      desc: "A clean report you can save, share with your partner, or take to your advisor.",
    },
  ],
  footerText: "RUBBA. Plan your life, your way.",
  countries: [
    { code: "NG", name: "Nigeria", currency: "NGN", inflationRate: 0.22 },
    { code: "ZA", name: "South Africa", currency: "ZAR", inflationRate: 0.05 },
    { code: "KE", name: "Kenya", currency: "KES", inflationRate: 0.07 },
    { code: "GH", name: "Ghana", currency: "GHS", inflationRate: 0.23 },
    { code: "ET", name: "Ethiopia", currency: "ETB", inflationRate: 0.28 },
    { code: "TZ", name: "Tanzania", currency: "TZS", inflationRate: 0.04 },
    { code: "UG", name: "Uganda", currency: "UGX", inflationRate: 0.05 },
    { code: "RW", name: "Rwanda", currency: "RWF", inflationRate: 0.1 },
    { code: "EG", name: "Egypt", currency: "EGP", inflationRate: 0.25 },
    { code: "US", name: "United States", currency: "USD", inflationRate: 0.03 },
    { code: "GB", name: "United Kingdom", currency: "GBP", inflationRate: 0.04 },
    { code: "AE", name: "UAE", currency: "AED", inflationRate: 0.02 },
  ],
  brandPlacements: [
    { id: "1", brand: "Toyota Africa", tagline: "Built for every road ahead", imageUrl: "/images/goals/vehicle.jpg", linkUrl: "#", categories: ["vehicle"], active: true },
    { id: "2", brand: "Lagos Business School", tagline: "Shape the future of African business", imageUrl: "/images/goals/education.jpg", linkUrl: "#", categories: ["education"], active: true },
    { id: "3", brand: "PropertyPro", tagline: "Find your dream home in Africa", imageUrl: "/images/goals/property.jpg", linkUrl: "#", categories: ["property"], active: true },
    { id: "4", brand: "Emirates Holidays", tagline: "Fly to your next adventure", imageUrl: "/images/goals/travel.jpg", linkUrl: "#", categories: ["travel"], active: true },
    { id: "5", brand: "Rolex", tagline: "A crown for every achievement", imageUrl: "/images/goals/luxury.jpg", linkUrl: "#", categories: ["luxury"], active: true },
    { id: "6", brand: "Bamboo Invest", tagline: "Grow your wealth from anywhere", imageUrl: "/images/goals/investment.jpg", linkUrl: "#", categories: ["investment"], active: true },
  ],
};

export function getSiteConfig(): SiteConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    return raw ? { ...DEFAULT_CONFIG, ...JSON.parse(raw) } : DEFAULT_CONFIG;
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveSiteConfig(config: SiteConfig) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

export function getDefaultConfig(): SiteConfig {
  return DEFAULT_CONFIG;
}
