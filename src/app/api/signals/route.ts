import { getRegionLocations } from "@/lib/locations/montenegro";
import { scoreLocations } from "@/lib/scoring";
import { buildLiveSignals } from "@/lib/signals";
import { DEFAULT_PREFERENCES } from "@/types/domain";

export const dynamic = "force-dynamic";

export async function GET() {
  const locations = scoreLocations(
    getRegionLocations("montenegro"),
    DEFAULT_PREFERENCES,
  );
  const signals = buildLiveSignals(locations);

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      let tick = 0;
      const send = () => {
        const payload = signals[tick % signals.length];
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ ...payload, tick })}\n\n`),
        );
        tick += 1;
      };
      send();
      const interval = setInterval(send, 4000);
      const close = () => {
        clearInterval(interval);
        controller.close();
      };
      setTimeout(close, 20000);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
