"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { getGlobalCorpus } from "@/data/corpus/corpus";
import { useTripStore } from "@/stores/trip-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { copy } from "@/content/en";

const DARK_STYLE = "mapbox://styles/mapbox/dark-v11";

export function TripMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const plan = useTripStore((s) => s.plan);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    if (!containerRef.current || !token) return;
    mapboxgl.accessToken = token;
    const locations = plan?.locations ?? getGlobalCorpus().slice(0, 12);
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: DARK_STYLE,
      center: locations[0]?.coordinates ?? [0, 20],
      zoom: locations.length > 6 ? 2 : 5,
      pitch: 40,
      bearing: -8,
    });
    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach((loc, index) => {
      const score = "totalScore" in loc ? (loc as { totalScore: number }).totalScore : 50;
      bounds.extend(loc.coordinates);
      const el = document.createElement("div");
      el.className =
        "rounded-full bg-sky-200 text-stone-950 text-xs font-medium px-2 py-1 shadow-lg";
      el.textContent = String(index + 1);
      new mapboxgl.Marker({ element: el })
        .setLngLat(loc.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 16 }).setHTML(
            `<strong>${loc.name}</strong><br/>${loc.country}<br/>Score ${Math.round(score)}`,
          ),
        )
        .addTo(map);
    });

    if (locations.length > 1) {
      map.fitBounds(bounds, { padding: 48, maxZoom: locations.length > 8 ? 4 : 8, duration: 800 });
    }

    return () => map.remove();
  }, [plan, token]);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Map — scored destinations</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {token ? (
          <div ref={containerRef} className="h-[420px] w-full" />
        ) : (
          <div className="flex h-[420px] flex-col items-center justify-center gap-2 bg-[radial-gradient(circle_at_30%_20%,#1c1917,#0c0a09)] px-6 text-center text-sm text-stone-400">
            <p>{copy.mapTokenHint}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
