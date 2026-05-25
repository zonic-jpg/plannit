"use client";

export type EventType =
  | "page_view"
  | "brand_impression"
  | "brand_click"
  | "goal_created"
  | "option_selected"
  | "plan_shared"
  | "plan_exported"
  | "calendar_synced"
  | "signup"
  | "login";

export interface AnalyticsEvent {
  id: string;
  type: EventType;
  userId: string | null;
  brandId: string | null;
  goalCategory: string | null;
  metadata: Record<string, string>;
  timestamp: string;
  sessionId: string;
}

const EVENTS_KEY = "rubba_analytics";
let sessionId: string | null = null;

function getSessionId(): string {
  if (sessionId) return sessionId;
  if (typeof window === "undefined") return "server";
  const stored = sessionStorage.getItem("rubba_sid");
  if (stored) { sessionId = stored; return stored; }
  sessionId = crypto.randomUUID();
  sessionStorage.setItem("rubba_sid", sessionId);
  return sessionId;
}

export function trackEvent(
  type: EventType,
  opts: {
    userId?: string | null;
    brandId?: string | null;
    goalCategory?: string | null;
    metadata?: Record<string, string>;
  } = {}
) {
  if (typeof window === "undefined") return;
  const events = getEvents();
  events.push({
    id: crypto.randomUUID(),
    type,
    userId: opts.userId ?? null,
    brandId: opts.brandId ?? null,
    goalCategory: opts.goalCategory ?? null,
    metadata: opts.metadata ?? {},
    timestamp: new Date().toISOString(),
    sessionId: getSessionId(),
  });
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

export function getEvents(): AnalyticsEvent[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(EVENTS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function getEventsByBrand(brandId: string): AnalyticsEvent[] {
  return getEvents().filter((e) => e.brandId === brandId);
}

export function getEventsByUser(userId: string): AnalyticsEvent[] {
  return getEvents().filter((e) => e.userId === userId);
}

export function getEventsByType(type: EventType): AnalyticsEvent[] {
  return getEvents().filter((e) => e.type === type);
}

export interface BrandAnalytics {
  brandId: string;
  impressions: number;
  clicks: number;
  ctr: number;
  uniqueUsers: number;
  byCategory: Record<string, { impressions: number; clicks: number }>;
  recentEvents: AnalyticsEvent[];
}

export function getBrandAnalytics(brandId: string): BrandAnalytics {
  const events = getEventsByBrand(brandId);
  const impressions = events.filter((e) => e.type === "brand_impression").length;
  const clicks = events.filter((e) => e.type === "brand_click").length;
  const uniqueUsers = new Set(events.map((e) => e.userId).filter(Boolean)).size;

  const byCategory: Record<string, { impressions: number; clicks: number }> = {};
  for (const e of events) {
    const cat = e.goalCategory || "unknown";
    if (!byCategory[cat]) byCategory[cat] = { impressions: 0, clicks: 0 };
    if (e.type === "brand_impression") byCategory[cat].impressions++;
    if (e.type === "brand_click") byCategory[cat].clicks++;
  }

  return {
    brandId,
    impressions,
    clicks,
    ctr: impressions > 0 ? clicks / impressions : 0,
    uniqueUsers,
    byCategory,
    recentEvents: events.slice(-20).reverse(),
  };
}

export interface OverviewAnalytics {
  totalUsers: number;
  totalPlans: number;
  totalBrandImpressions: number;
  totalBrandClicks: number;
  overallCTR: number;
  topCategories: { category: string; count: number }[];
  recentSignups: number;
}

export function getOverviewAnalytics(): OverviewAnalytics {
  const events = getEvents();
  const signups = events.filter((e) => e.type === "signup");
  const plans = events.filter((e) => e.type === "goal_created");
  const impressions = events.filter((e) => e.type === "brand_impression");
  const clicks = events.filter((e) => e.type === "brand_click");

  const catCounts: Record<string, number> = {};
  for (const e of events) {
    if (e.goalCategory) {
      catCounts[e.goalCategory] = (catCounts[e.goalCategory] || 0) + 1;
    }
  }
  const topCategories = Object.entries(catCounts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const oneDayAgo = new Date(Date.now() - 86400000).toISOString();
  const recentSignups = signups.filter((e) => e.timestamp > oneDayAgo).length;

  return {
    totalUsers: signups.length,
    totalPlans: plans.length,
    totalBrandImpressions: impressions.length,
    totalBrandClicks: clicks.length,
    overallCTR: impressions.length > 0 ? clicks.length / impressions.length : 0,
    topCategories,
    recentSignups,
  };
}
