"use client";

export interface Asset {
  id: string;
  name: string;
  category: string;
  url: string;
  tags: string[];
  uploadedAt: string;
}

export interface AssetDatabase {
  test: Asset[];
  live: Asset[];
}

const DB_KEY = "rubba_asset_db";
const MODE_KEY = "rubba_asset_mode";

const SEED_ASSETS: Asset[] = [
  { id: "a1", name: "Education", category: "education", url: "/images/goals/education.jpg", tags: ["university", "degree", "study"], uploadedAt: new Date().toISOString() },
  { id: "a2", name: "Property", category: "property", url: "/images/goals/property.jpg", tags: ["house", "home", "apartment"], uploadedAt: new Date().toISOString() },
  { id: "a3", name: "Vehicle", category: "vehicle", url: "/images/goals/vehicle.jpg", tags: ["car", "suv", "drive"], uploadedAt: new Date().toISOString() },
  { id: "a4", name: "Family", category: "family", url: "/images/goals/family.jpg", tags: ["wedding", "marriage", "children"], uploadedAt: new Date().toISOString() },
  { id: "a5", name: "Travel", category: "travel", url: "/images/goals/travel.jpg", tags: ["trip", "vacation", "dubai"], uploadedAt: new Date().toISOString() },
  { id: "a6", name: "Luxury", category: "luxury", url: "/images/goals/luxury.jpg", tags: ["watch", "rolex", "jewelry"], uploadedAt: new Date().toISOString() },
  { id: "a7", name: "Business", category: "business", url: "/images/goals/business.jpg", tags: ["startup", "company", "entrepreneur"], uploadedAt: new Date().toISOString() },
  { id: "a8", name: "Investment", category: "investment", url: "/images/goals/investment.jpg", tags: ["stocks", "portfolio", "savings"], uploadedAt: new Date().toISOString() },
  { id: "a9", name: "Health", category: "health", url: "/images/goals/health.jpg", tags: ["fitness", "gym", "wellness"], uploadedAt: new Date().toISOString() },
  { id: "a10", name: "Other", category: "other", url: "/images/goals/other.jpg", tags: ["general", "personal"], uploadedAt: new Date().toISOString() },
  { id: "a11", name: "Hero Image", category: "hero", url: "/images/hero.jpg", tags: ["landing", "hero", "aspirational"], uploadedAt: new Date().toISOString() },
  { id: "a12", name: "Woman Planning", category: "hero", url: "/images/woman-planning.jpg", tags: ["planning", "woman", "african"], uploadedAt: new Date().toISOString() },
  { id: "a13", name: "Goals Motivation", category: "hero", url: "/images/goals-motivation.jpg", tags: ["motivation", "woman", "african"], uploadedAt: new Date().toISOString() },
  { id: "a14", name: "Productivity", category: "hero", url: "/images/productivity.jpg", tags: ["productive", "man", "african"], uploadedAt: new Date().toISOString() },
  { id: "a15", name: "Schedule Focus", category: "hero", url: "/images/schedule-focus.jpg", tags: ["schedule", "woman", "african"], uploadedAt: new Date().toISOString() },
];

function getDB(): AssetDatabase {
  if (typeof window === "undefined") return { test: SEED_ASSETS, live: [] };
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* use default */ }
  const db: AssetDatabase = { test: SEED_ASSETS, live: [] };
  localStorage.setItem(DB_KEY, JSON.stringify(db));
  return db;
}

function saveDB(db: AssetDatabase) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

export function getAssetMode(): "test" | "live" {
  if (typeof window === "undefined") return "test";
  return (localStorage.getItem(MODE_KEY) as "test" | "live") || "test";
}

export function setAssetMode(mode: "test" | "live") {
  localStorage.setItem(MODE_KEY, mode);
}

export function getActiveAssets(): Asset[] {
  const db = getDB();
  return db[getAssetMode()];
}

export function getTestAssets(): Asset[] {
  return getDB().test;
}

export function getLiveAssets(): Asset[] {
  return getDB().live;
}

export function addAsset(asset: Omit<Asset, "id" | "uploadedAt">, target: "test" | "live"): Asset {
  const db = getDB();
  const newAsset: Asset = {
    ...asset,
    id: crypto.randomUUID(),
    uploadedAt: new Date().toISOString(),
  };
  db[target].push(newAsset);
  saveDB(db);
  return newAsset;
}

export function removeAsset(id: string, target: "test" | "live") {
  const db = getDB();
  db[target] = db[target].filter((a) => a.id !== id);
  saveDB(db);
}

export function promoteToLive(id: string) {
  const db = getDB();
  const asset = db.test.find((a) => a.id === id);
  if (!asset) return;
  if (db.live.some((a) => a.id === id)) return;
  db.live.push({ ...asset });
  saveDB(db);
}

export function getAssetsByCategory(category: string): Asset[] {
  return getActiveAssets().filter((a) => a.category === category);
}

export function getAssetUrl(category: string, fallback: string): string {
  const assets = getAssetsByCategory(category);
  if (assets.length === 0) return fallback;
  return assets[0].url;
}
