"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useTripStore } from "@/stores/trip-store";
import { MONTENEGRO_LOCATIONS } from "@/lib/locations/montenegro";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DARK_STYLE = "mapbox://styles/mapbox/dark-v11";

export function TripMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const plan = useTripStore((s) => s.plan);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    if (!containerRef.current || !token) return;
    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: DARK_STYLE,
      center: [18.84, 42.35],
      zoom: 8.2,
      pitch: 42,
      bearing: -12,
    });
    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");

    const locations = plan?.locations ?? MONTENEGRO_LOCATIONS;
    locations.forEach((loc, index) => {
      const score =
        "totalScore" in loc && typeof loc.totalScore === "number"
          ? loc.totalScore
          : 0.5;
      const el = document.createElement("div");
      el.className =
        "rounded-full bg-amber-100 text-stone-950 text-xs font-medium px-2 py-1 shadow-lg";
      el.textContent = String(index + 1);
      new mapboxgl.Marker({ element: el })
        .setLngLat(loc.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 16 }).setHTML(
            `<strong>${loc.name}</strong><br/>Score ${Math.round(score * 100)}`,
          ),
        )
        .addTo(map);
    });

    return () => map.remove();
  }, [plan, token]);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Map — Montenegro coast</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {token ? (
          <div ref={containerRef} className="h-[420px] w-full" />
        ) : (
          <div className="flex h-[420px] flex-col items-center justify-center gap-2 bg-[radial-gradient(circle_at_30%_20%,#1c1917,#0c0a09)] px-6 text-center text-sm text-stone-400">
            <p>Add NEXT_PUBLIC_MAPBOX_TOKEN for the live dark Mapbox layer.</p>
            <p className="text-xs text-stone-500">
              Podgorica · Budva · Kotor · Tivat still score without the map token.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
