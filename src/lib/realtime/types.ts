export type RealtimeSnapshot = {
  locationId: string;
  date?: string;
  weather: {
    summary: string;
    tempC: number;
    suitabilityMultiplier: number;
    source: "live" | "cached" | "estimate";
  };
  events: {
    headline: string;
    densityMultiplier: number;
    items: string[];
  };
  seawaterQuality: {
    status: "excellent" | "good" | "moderate";
    multiplier: number;
    officialUrl: string;
  };
  fetchedAt: string;
};
