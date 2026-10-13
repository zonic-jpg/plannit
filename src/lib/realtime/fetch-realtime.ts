import { LOCATIONS } from "@/data/locations";
import { TTL, cached } from "@/lib/cache/memory-cache";
import type { RealtimeSnapshot } from "@/lib/realtime/types";

const SEAWATER_URL =
  "https://www.morskodobrost.me/en/map" as const;

const EVENT_SEED: Record<string, string[]> = {
  budva: ["Summer theatre on the citadel", "Marina jazz weekends"],
  kotor: ["Boka Night boat parade (seasonal)", "Old Town classical evenings"],
  tivat: ["Porto Montenegro regatta socials", "Superyacht open-deck showcases"],
  podgorica: ["Wine & gastronomy week", "Contemporary art openings"],
};

async function fetchWeatherMultiplier(
  lat: number,
  lon: number,
): Promise<{ summary: string; tempC: number; multiplier: number; source: "live" | "estimate" }> {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) {
    return {
      summary: "Mild Adriatic conditions (estimate)",
      tempC: 24,
      multiplier: 1,
      source: "estimate",
    };
  }
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`;
  const res = await fetch(url, { next: { revalidate: 900 } });
  if (!res.ok) {
    return {
      summary: "Weather unavailable — using seasonal baseline",
      tempC: 22,
      multiplier: 0.98,
      source: "estimate",
    };
  }
  const data = (await res.json()) as {
    weather?: { description?: string }[];
    main?: { temp?: number };
  };
  const tempC = data.main?.temp ?? 22;
  const summary = data.weather?.[0]?.description ?? "Clear";
  let multiplier = 1;
  if (tempC < 14 || tempC > 34) multiplier = 0.88;
  else if (tempC >= 20 && tempC <= 28) multiplier = 1.06;
  return { summary, tempC, multiplier, source: "live" };
}

export async function fetchRealtimeForLocation(
  locationId: string,
  date?: string,
): Promise<RealtimeSnapshot> {
  const cacheKey = `rt:${locationId}:${date ?? "default"}`;
  return cached(cacheKey, TTL.weather, async () => {
    const loc = LOCATIONS.find((l) => l.id === locationId) ?? LOCATIONS[0];
    const [lat, lon] = [loc.coordinates[1], loc.coordinates[0]];
    const weather = await fetchWeatherMultiplier(lat, lon);
    const eventsList = EVENT_SEED[locationId] ?? ["Coastal food pop-ups"];
    const density =
      loc.type === "coastal" ? 1.08 : loc.type === "bay" ? 1.04 : 0.96;

    const seawaterBase =
      loc.type === "urban" ? 0.95 : loc.type === "coastal" ? 1.02 : 1.05;

    return {
      locationId,
      date,
      weather: {
        summary: weather.summary,
        tempC: weather.tempC,
        suitabilityMultiplier: weather.multiplier,
        source: weather.source === "live" ? "live" : "estimate",
      },
      events: {
        headline: eventsList[0] ?? "Local calendar active",
        densityMultiplier: density,
        items: eventsList,
      },
      seawaterQuality: {
        status: loc.type === "urban" ? "good" : "excellent",
        multiplier: seawaterBase,
        officialUrl: SEAWATER_URL,
      },
      fetchedAt: new Date().toISOString(),
    };
  });
}

export async function fetchRealtimeBatch(
  locationIds: string[],
  date?: string,
): Promise<Record<string, RealtimeSnapshot>> {
  const entries = await Promise.all(
    locationIds.map(async (id) => [id, await fetchRealtimeForLocation(id, date)] as const),
  );
  return Object.fromEntries(entries);
}
