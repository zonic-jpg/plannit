import { v4 as uuidv4 } from "uuid";
import type {
  LifeGoal,
  GoalCategory,
  GoalOption,
  AnalysisResult,
  UserInput,
} from "./types";
import { COUNTRIES } from "./types";
import { getAssetUrl } from "./assetDatabase";

const GOAL_PATTERNS: {
  keywords: string[];
  category: GoalCategory;
  baseCost: number;
  durationYears: number;
  dependsOnCategory?: GoalCategory;
  options: Omit<GoalOption, "id">[];
}[] = [
  {
    keywords: ["bachelor", "first degree", "undergraduate", "bachelors", "university degree"],
    category: "education",
    baseCost: 25000,
    durationYears: 4,
    options: [
      { name: "University of Lagos", brand: "UNILAG", description: "Top Nigerian university", imageUrl: "/images/goals/education.jpg", estimatedPrice: 15000, supplier: "UNILAG Admissions", link: "#" },
      { name: "University of Cape Town", brand: "UCT", description: "Leading South African university", imageUrl: "/images/goals/education.jpg", estimatedPrice: 30000, supplier: "UCT Admissions", link: "#" },
      { name: "Ashesi University", brand: "Ashesi", description: "Premier Ghanaian university", imageUrl: "/images/goals/education.jpg", estimatedPrice: 20000, supplier: "Ashesi Admissions", link: "#" },
    ],
  },
  {
    keywords: ["master", "masters", "mba", "postgraduate", "graduate degree"],
    category: "education",
    baseCost: 40000,
    durationYears: 2,
    dependsOnCategory: "education",
    options: [
      { name: "Lagos Business School MBA", brand: "LBS", description: "Top African MBA program", imageUrl: "/images/goals/education.jpg", estimatedPrice: 35000, supplier: "LBS", link: "#" },
      { name: "Strathmore University MBA", brand: "Strathmore", description: "Leading East African business school", imageUrl: "/images/goals/education.jpg", estimatedPrice: 25000, supplier: "Strathmore", link: "#" },
      { name: "GIBS MBA", brand: "GIBS", description: "Gordon Institute of Business Science", imageUrl: "/images/goals/education.jpg", estimatedPrice: 45000, supplier: "GIBS SA", link: "#" },
    ],
  },
  {
    keywords: ["house", "home", "property", "apartment", "flat", "land"],
    category: "property",
    baseCost: 150000,
    durationYears: 1,
    options: [
      { name: "3-Bed Apartment, Lekki", brand: "Urban Living", description: "Modern apartment in prime Lagos location", imageUrl: "/images/goals/property.jpg", estimatedPrice: 120000, supplier: "PropertyPro Nigeria", link: "#" },
      { name: "4-Bed House, Sandton", brand: "Suburban Home", description: "Family home in Johannesburg suburb", imageUrl: "/images/goals/property.jpg", estimatedPrice: 200000, supplier: "Private Property SA", link: "#" },
      { name: "2-Bed Apartment, Westlands", brand: "City Living", description: "Modern flat in Nairobi", imageUrl: "/images/goals/property.jpg", estimatedPrice: 85000, supplier: "BuyRentKenya", link: "#" },
    ],
  },
  {
    keywords: ["car", "vehicle", "suv", "bmw", "mercedes", "toyota", "drive"],
    category: "vehicle",
    baseCost: 35000,
    durationYears: 1,
    options: [
      { name: "Toyota Land Cruiser", brand: "Toyota", description: "Rugged SUV popular across Africa", imageUrl: "/images/goals/vehicle.jpg", estimatedPrice: 55000, supplier: "Toyota Africa", link: "#" },
      { name: "BMW 3 Series", brand: "BMW", description: "Luxury sedan", imageUrl: "/images/goals/vehicle.jpg", estimatedPrice: 45000, supplier: "BMW Dealers", link: "#" },
      { name: "Mercedes-Benz C-Class", brand: "Mercedes", description: "Premium sedan", imageUrl: "/images/goals/vehicle.jpg", estimatedPrice: 48000, supplier: "Mercedes Africa", link: "#" },
    ],
  },
  {
    keywords: ["family", "marry", "marriage", "wedding", "children", "kids", "baby"],
    category: "family",
    baseCost: 20000,
    durationYears: 2,
    options: [
      { name: "Traditional Wedding", brand: "Cultural", description: "Traditional African wedding ceremony", imageUrl: "/images/goals/family.jpg", estimatedPrice: 15000, supplier: "Local planners", link: "#" },
      { name: "Destination Wedding", brand: "Premium", description: "Beach or resort wedding", imageUrl: "/images/goals/family.jpg", estimatedPrice: 35000, supplier: "Event planners", link: "#" },
      { name: "Intimate Ceremony", brand: "Simple", description: "Small family gathering", imageUrl: "/images/goals/family.jpg", estimatedPrice: 8000, supplier: "Local venue", link: "#" },
    ],
  },
  {
    keywords: ["travel", "trip", "vacation", "holiday", "dubai", "europe", "usa", "london", "paris"],
    category: "travel",
    baseCost: 5000,
    durationYears: 1,
    options: [
      { name: "Dubai Luxury Trip", brand: "Dubai Tourism", description: "7-day luxury Dubai experience", imageUrl: "/images/goals/travel.jpg", estimatedPrice: 8000, supplier: "Emirates Holidays", link: "#" },
      { name: "European Tour", brand: "Europe", description: "14-day multi-city European tour", imageUrl: "/images/goals/travel.jpg", estimatedPrice: 12000, supplier: "TravelStart", link: "#" },
      { name: "East African Safari", brand: "Safari", description: "10-day Serengeti & Masai Mara safari", imageUrl: "/images/goals/travel.jpg", estimatedPrice: 6000, supplier: "SafariBookings", link: "#" },
    ],
  },
  {
    keywords: ["watch", "rolex", "jewelry", "luxury item", "designer"],
    category: "luxury",
    baseCost: 10000,
    durationYears: 1,
    options: [
      { name: "Rolex Submariner", brand: "Rolex", description: "Iconic luxury dive watch", imageUrl: "/images/goals/luxury.jpg", estimatedPrice: 12000, supplier: "Authorized Rolex Dealer", link: "#" },
      { name: "Omega Seamaster", brand: "Omega", description: "Premium Swiss timepiece", imageUrl: "/images/goals/luxury.jpg", estimatedPrice: 6000, supplier: "Omega Boutique", link: "#" },
      { name: "TAG Heuer Carrera", brand: "TAG Heuer", description: "Sport luxury chronograph", imageUrl: "/images/goals/luxury.jpg", estimatedPrice: 4000, supplier: "TAG Heuer Dealer", link: "#" },
    ],
  },
  {
    keywords: ["business", "startup", "company", "entrepreneur", "shop", "store"],
    category: "business",
    baseCost: 50000,
    durationYears: 2,
    options: [
      { name: "Tech Startup", brand: "Technology", description: "Software or app-based business", imageUrl: "/images/goals/business.jpg", estimatedPrice: 30000, supplier: "Co-creation Hub", link: "#" },
      { name: "Retail Business", brand: "Retail", description: "Physical or online store", imageUrl: "/images/goals/business.jpg", estimatedPrice: 50000, supplier: "Local chamber", link: "#" },
      { name: "Franchise", brand: "Franchise", description: "Licensed franchise operation", imageUrl: "/images/goals/business.jpg", estimatedPrice: 75000, supplier: "Franchise Direct", link: "#" },
    ],
  },
  {
    keywords: ["invest", "stocks", "portfolio", "savings", "retirement", "pension"],
    category: "investment",
    baseCost: 20000,
    durationYears: 5,
    options: [
      { name: "Stock Portfolio", brand: "Equities", description: "Diversified African stock portfolio", imageUrl: "/images/goals/investment.jpg", estimatedPrice: 20000, supplier: "Bamboo / Chaka", link: "#" },
      { name: "Real Estate Fund", brand: "Property", description: "Real estate investment trust", imageUrl: "/images/goals/investment.jpg", estimatedPrice: 30000, supplier: "REIT providers", link: "#" },
      { name: "Pension Plan", brand: "Retirement", description: "Long-term pension savings", imageUrl: "/images/goals/investment.jpg", estimatedPrice: 15000, supplier: "PenCom", link: "#" },
    ],
  },
  {
    keywords: ["fitness", "gym", "health", "marathon", "sport", "weight"],
    category: "health",
    baseCost: 3000,
    durationYears: 1,
    options: [
      { name: "Premium Gym Membership", brand: "Fitness", description: "Annual premium gym membership", imageUrl: "/images/goals/health.jpg", estimatedPrice: 2000, supplier: "Virgin Active / Body & Soul", link: "#" },
      { name: "Personal Training Program", brand: "Training", description: "12-month personal trainer", imageUrl: "/images/goals/health.jpg", estimatedPrice: 5000, supplier: "Local trainers", link: "#" },
      { name: "Marathon Training", brand: "Running", description: "Structured marathon prep course", imageUrl: "/images/goals/health.jpg", estimatedPrice: 1500, supplier: "RunAfrica", link: "#" },
    ],
  },
  {
    keywords: ["spiritual", "faith", "church", "mosque", "pilgrimage", "hajj", "meditation", "pray", "give back", "charity", "tithe", "volunteer"],
    category: "spiritual" as GoalCategory,
    baseCost: 5000,
    durationYears: 1,
    options: [
      { name: "Hajj Pilgrimage", brand: "Sacred Journey", description: "Once-in-a-lifetime spiritual pilgrimage", imageUrl: "/images/goals/other.jpg", estimatedPrice: 8000, supplier: "Hajj Operators", link: "#" },
      { name: "Holy Land Tour", brand: "Faith Travel", description: "Visit Jerusalem, Bethlehem, and sacred sites", imageUrl: "/images/goals/other.jpg", estimatedPrice: 6000, supplier: "Faith Tours", link: "#" },
      { name: "Meditation Retreat", brand: "Inner Peace", description: "30-day mindfulness and wellness retreat", imageUrl: "/images/goals/other.jpg", estimatedPrice: 3000, supplier: "Retreat centers", link: "#" },
    ],
  },
  {
    keywords: ["achievement", "award", "book", "publish", "speak", "public speaking", "ted talk", "record", "certification", "license"],
    category: "achievement" as GoalCategory,
    baseCost: 5000,
    durationYears: 2,
    options: [
      { name: "Publish a Book", brand: "Author", description: "Write and self-publish your story", imageUrl: "/images/goals/other.jpg", estimatedPrice: 5000, supplier: "Amazon KDP / Local publishers", link: "#" },
      { name: "Professional Certification", brand: "Credential", description: "Industry-recognized certification", imageUrl: "/images/goals/education.jpg", estimatedPrice: 3000, supplier: "Professional bodies", link: "#" },
      { name: "Public Speaking Course", brand: "Stage", description: "Master the art of public speaking", imageUrl: "/images/goals/other.jpg", estimatedPrice: 2000, supplier: "Toastmasters / coaches", link: "#" },
    ],
  },
];

function matchGoals(text: string): typeof GOAL_PATTERNS[number][] {
  const lower = text.toLowerCase();
  const matched: typeof GOAL_PATTERNS[number][] = [];
  for (const pattern of GOAL_PATTERNS) {
    if (pattern.keywords.some((kw) => lower.includes(kw))) {
      matched.push(pattern);
    }
  }
  if (matched.length === 0) {
    matched.push({
      keywords: [],
      category: "other",
      baseCost: 10000,
      durationYears: 2,
      options: [
        { name: "Custom Goal", brand: "Personal", description: "Personalized goal planning", imageUrl: "/images/goals/other.jpg", estimatedPrice: 10000, supplier: "Self-directed", link: "#" },
      ],
    });
  }
  return matched;
}

function adjustForInflation(
  baseCost: number,
  yearsFromNow: number,
  inflationRate: number
): number {
  return Math.round(baseCost * Math.pow(1 + inflationRate, yearsFromNow));
}

export function analyzeGoals(input: UserInput): AnalysisResult {
  const country = COUNTRIES.find((c) => c.code === input.country) ?? COUNTRIES[0];
  const matched = matchGoals(input.goals);

  let currentAge = input.age;
  const goals: LifeGoal[] = [];
  const categoryAgeMap: Partial<Record<GoalCategory, number>> = {};

  const sorted = [...matched].sort((a, b) => {
    if (a.dependsOnCategory && !b.dependsOnCategory) return 1;
    if (!a.dependsOnCategory && b.dependsOnCategory) return -1;
    return 0;
  });

  for (const pattern of sorted) {
    let startAge = currentAge;

    if (pattern.dependsOnCategory && categoryAgeMap[pattern.dependsOnCategory]) {
      startAge = categoryAgeMap[pattern.dependsOnCategory]!;
    }

    const canBeConcurrent =
      !pattern.dependsOnCategory &&
      pattern.category !== "education" &&
      goals.length > 0;

    if (canBeConcurrent && goals.length > 0) {
      const lastGoal = goals[goals.length - 1];
      startAge = Math.max(currentAge, lastGoal.startAge);
    } else if (!canBeConcurrent && goals.length > 0) {
      startAge = Math.max(startAge, currentAge);
    }

    const endAge = startAge + pattern.durationYears;
    const yearsFromNow = startAge - input.age;
    const inflationAdjusted = adjustForInflation(
      pattern.baseCost,
      yearsFromNow,
      country.inflationRate
    );

    const goal: LifeGoal = {
      id: uuidv4(),
      title: getGoalTitle(pattern.category, input.goals),
      category: pattern.category,
      description: getGoalDescription(pattern.category),
      startAge,
      endAge,
      dependsOn: pattern.dependsOnCategory ?? "none",
      concurrent: canBeConcurrent,
      estimatedCost: pattern.baseCost,
      inflationAdjustedCost: inflationAdjusted,
      currency: country.currency,
      options: pattern.options.map((o) => ({
        ...o,
        id: uuidv4(),
        estimatedPrice: adjustForInflation(o.estimatedPrice, yearsFromNow, country.inflationRate),
      })),
      selectedOptionId: null,
      aiNotes: generateNotes(pattern.category, startAge, endAge),
    };

    goals.push(goal);
    categoryAgeMap[pattern.category] = endAge;

    if (!canBeConcurrent) {
      currentAge = endAge;
    }
  }

  const totalCost = goals.reduce((sum, g) => sum + g.estimatedCost, 0);
  const totalInflation = goals.reduce((sum, g) => sum + g.inflationAdjustedCost, 0);
  const maxAge = Math.max(...goals.map((g) => g.endAge));

  const finalGoals = goals.map((g) => ({
    ...g,
    options: g.options.map((o) => ({
      ...o,
      imageUrl: getAssetUrl(g.category, o.imageUrl),
    })),
  }));

  return {
    goals: finalGoals,
    totalCost,
    totalInflationAdjusted: totalInflation,
    currency: country.currency,
    advice: generateAdvice(goals, input, country),
    timelineYears: maxAge - input.age,
  };
}

function getGoalTitle(category: GoalCategory, rawInput: string): string {
  const lower = rawInput.toLowerCase();
  const titles: Record<GoalCategory, string> = {
    education: lower.includes("master") ? "Obtain Master's Degree" : "Obtain Bachelor's Degree",
    career: "Build Career",
    property: "Purchase Property",
    vehicle: lower.includes("bmw") ? "Buy a BMW" : lower.includes("mercedes") ? "Buy a Mercedes" : "Purchase Vehicle",
    family: lower.includes("wedding") || lower.includes("marry") ? "Wedding & Marriage" : "Start a Family",
    travel: lower.includes("dubai") ? "Trip to Dubai" : lower.includes("europe") ? "European Vacation" : "Travel Adventure",
    luxury: lower.includes("rolex") ? "Buy a Rolex" : lower.includes("watch") ? "Purchase Luxury Watch" : "Luxury Purchase",
    investment: "Build Investment Portfolio",
    health: "Health & Fitness Program",
    business: "Launch a Business",
    spiritual: lower.includes("hajj") ? "Hajj Pilgrimage" : lower.includes("meditat") ? "Meditation Practice" : "Spiritual Journey",
    achievement: lower.includes("book") || lower.includes("publish") ? "Publish a Book" : lower.includes("speak") ? "Public Speaking Mastery" : "Personal Achievement",
    other: "Personal Goal",
  };
  return titles[category];
}

function getGoalDescription(category: GoalCategory): string {
  const descs: Record<GoalCategory, string> = {
    education: "Invest in your education for long-term career growth and personal development.",
    career: "Advance your career through strategic moves and skill development.",
    property: "Secure real estate as a home and long-term investment asset.",
    vehicle: "Acquire reliable and aspirational transportation.",
    family: "Build your family foundation with proper planning and budgeting.",
    travel: "Experience the world and broaden your horizons.",
    luxury: "Reward your achievements with quality luxury items.",
    investment: "Grow your wealth through diversified investments.",
    health: "Invest in your physical and mental wellbeing.",
    business: "Create an additional income stream through entrepreneurship.",
    spiritual: "Nurture your inner life, faith, and sense of purpose.",
    achievement: "Reach a meaningful personal milestone that defines your legacy.",
    other: "A personal milestone worth planning for.",
  };
  return descs[category];
}

function generateNotes(category: GoalCategory, startAge: number, endAge: number): string {
  return `Planned for ages ${startAge}–${endAge}. ${
    category === "education"
      ? "Education is a prerequisite for many career goals. Consider scholarships and financial aid."
      : category === "property"
      ? "Property is both a lifestyle asset and investment. Research mortgage options in your market."
      : category === "vehicle"
      ? "Consider total cost of ownership including insurance, maintenance, and fuel."
      : category === "family"
      ? "Family planning involves both emotional readiness and financial preparation."
      : "Start planning early to spread costs and maximize opportunities."
  }`;
}

function generateAdvice(
  goals: LifeGoal[],
  input: UserInput,
  country: { name: string; inflationRate: number; currency: string }
): string[] {
  const advice: string[] = [];
  advice.push(
    `Based on your goals, you'll need to plan across approximately ${Math.max(...goals.map((g) => g.endAge)) - input.age} years starting from age ${input.age}.`
  );
  advice.push(
    `Inflation in ${country.name} is approximately ${(country.inflationRate * 100).toFixed(0)}% annually. Costs have been adjusted accordingly.`
  );

  const hasEducation = goals.some((g) => g.category === "education");
  if (hasEducation) {
    advice.push(
      "Education goals are sequenced first as they unlock career advancement and higher earning potential."
    );
  }

  const concurrent = goals.filter((g) => g.concurrent);
  if (concurrent.length > 0) {
    advice.push(
      `${concurrent.length} of your goals can run concurrently, optimizing your timeline.`
    );
  }

  advice.push(
    `Consider setting aside ${(country.currency)} savings each month to stay on track. Automate your savings where possible.`
  );

  advice.push(
    "Review and adjust your plan annually to account for life changes, salary growth, and market conditions."
  );

  if (input.gender === "female") {
    advice.push(
      "Consider factoring in maternity leave periods when planning career and family goals concurrently."
    );
  }
  if (input.gender === "male") {
    advice.push(
      "Factor in paternity leave and family support costs when planning career and family goals together."
    );
  }

  return advice;
}
