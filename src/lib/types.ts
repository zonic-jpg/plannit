export interface UserInput {
  age: number;
  country: string;
  goals: string;
}

export type GoalDependency = "none" | string;

export interface LifeGoal {
  id: string;
  title: string;
  category: GoalCategory;
  description: string;
  startAge: number;
  endAge: number;
  dependsOn: GoalDependency;
  concurrent: boolean;
  estimatedCost: number;
  inflationAdjustedCost: number;
  currency: string;
  options: GoalOption[];
  selectedOptionId: string | null;
  aiNotes: string;
}

export type GoalCategory =
  | "education"
  | "career"
  | "property"
  | "vehicle"
  | "family"
  | "travel"
  | "luxury"
  | "investment"
  | "health"
  | "business"
  | "other";

export interface GoalOption {
  id: string;
  name: string;
  brand: string;
  description: string;
  imageUrl: string;
  estimatedPrice: number;
  supplier: string;
  link: string;
}

export interface AnalysisResult {
  goals: LifeGoal[];
  totalCost: number;
  totalInflationAdjusted: number;
  currency: string;
  advice: string[];
  timelineYears: number;
}

export const CATEGORY_LABELS: Record<GoalCategory, string> = {
  education: "Education",
  career: "Career",
  property: "Property",
  vehicle: "Vehicle",
  family: "Family",
  travel: "Travel",
  luxury: "Luxury",
  investment: "Investment",
  health: "Health & Wellness",
  business: "Business",
  other: "Other",
};

export const CATEGORY_ICONS: Record<GoalCategory, string> = {
  education: "\u{1F393}",
  career: "\u{1F4BC}",
  property: "\u{1F3E0}",
  vehicle: "\u{1F697}",
  family: "\u{1F46A}",
  travel: "\u{2708}\u{FE0F}",
  luxury: "\u{231A}",
  investment: "\u{1F4C8}",
  health: "\u{1F3CB}\u{FE0F}",
  business: "\u{1F3E2}",
  other: "\u{2B50}",
};

export const COUNTRIES = [
  { code: "NG", name: "Nigeria", currency: "NGN", inflationRate: 0.22 },
  { code: "ZA", name: "South Africa", currency: "ZAR", inflationRate: 0.05 },
  { code: "KE", name: "Kenya", currency: "KES", inflationRate: 0.07 },
  { code: "GH", name: "Ghana", currency: "GHS", inflationRate: 0.23 },
  { code: "ET", name: "Ethiopia", currency: "ETB", inflationRate: 0.28 },
  { code: "TZ", name: "Tanzania", currency: "TZS", inflationRate: 0.04 },
  { code: "UG", name: "Uganda", currency: "UGX", inflationRate: 0.05 },
  { code: "RW", name: "Rwanda", currency: "RWF", inflationRate: 0.10 },
  { code: "EG", name: "Egypt", currency: "EGP", inflationRate: 0.25 },
  { code: "US", name: "United States", currency: "USD", inflationRate: 0.03 },
  { code: "GB", name: "United Kingdom", currency: "GBP", inflationRate: 0.04 },
  { code: "AE", name: "UAE", currency: "AED", inflationRate: 0.02 },
];
