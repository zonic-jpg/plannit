"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DEFAULT_PREFERENCES,
  REFERENCE_TRIP,
  type PreferenceWeights,
  type TripPlanResponse,
  type TripRequest,
} from "@/types/domain";

type TripStore = {
  request: TripRequest;
  plan: TripPlanResponse | null;
  setPreference: <K extends keyof PreferenceWeights>(
    key: K,
    value: PreferenceWeights[K],
  ) => void;
  setFreeText: (text: string) => void;
  setDuration: (days: number) => void;
  setOrigin: (origin: string) => void;
  setPlan: (plan: TripPlanResponse | null) => void;
  resetReferenceTrip: () => void;
};

export const useTripStore = create<TripStore>()(
  persist(
    (set) => ({
      request: REFERENCE_TRIP,
      plan: null,
      setPreference: (key, value) =>
        set((state) => ({
          request: {
            ...state.request,
            preferences: { ...state.request.preferences, [key]: value },
          },
        })),
      setFreeText: (text) =>
        set((state) => ({ request: { ...state.request, freeText: text } })),
      setDuration: (days) =>
        set((state) => ({
          request: { ...state.request, durationDays: Math.min(14, Math.max(1, days)) },
        })),
      setOrigin: (origin) =>
        set((state) => ({
          request: { ...state.request, origin: origin.toUpperCase().slice(0, 8) },
        })),
      setPlan: (plan) => set({ plan }),
      resetReferenceTrip: () => set({ request: REFERENCE_TRIP, plan: null }),
    }),
    { name: "aether-trip-v1" },
  ),
);

export function buildRequestFromStore(state: TripStore): TripRequest {
  return {
    ...state.request,
    preferences: { ...DEFAULT_PREFERENCES, ...state.request.preferences },
  };
}
