/** Legacy flight/hotel bands + corpus re-exports */
export { getGlobalCorpus, getLocationById } from "@/data/corpus/corpus";
export { loadLocationsFromJson, setCorpusOverride } from "@/data/corpus/load-locations";
export { SEED_LOCATIONS as LOCATIONS } from "@/data/corpus/seed-registry";

export const HOTEL_RANGES_5STAR = {
  podgorica: { min: 140, max: 220, currency: "EUR" as const },
  budva: { min: 280, max: 520, currency: "EUR" as const },
  kotor: { min: 240, max: 450, currency: "EUR" as const },
  tivat: { min: 320, max: 680, currency: "EUR" as const },
  default: { min: 200, max: 400, currency: "EUR" as const },
};

export const FLIGHT_BUSINESS_ABV = {
  min: 3200,
  max: 4800,
  currency: "USD" as const,
  note: "Static range — live fetch required for booking.",
};
