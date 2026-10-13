import { apiError, apiOk } from "@/lib/api/errors";
import { fetchRealtimeForLocation } from "@/lib/realtime/fetch-realtime";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const location = searchParams.get("location");
  const date = searchParams.get("date") ?? undefined;

  if (!location) {
    return apiError(400, "MISSING_LOCATION", "Query param location is required");
  }

  try {
    const snapshot = await fetchRealtimeForLocation(location, date);
    return apiOk({
      weather: snapshot.weather,
      events: snapshot.events,
      cleanliness: snapshot.seawaterQuality,
      fetchedAt: snapshot.fetchedAt,
    });
  } catch {
    return apiError(503, "REALTIME_UNAVAILABLE", "Live data temporarily unavailable");
  }
}
