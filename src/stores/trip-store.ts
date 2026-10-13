"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DEFAULT_PREFERENCES,
  REFERENCE_TRIP,
  type Continent,
  type PreferenceWeights,
  type Region,
  type TripFilters,
  type TripPlanResponse,
  type TripRequest,
} from "@/types/domain";

type TripStore = {
  request: TripRequest;
  plan: TripPlanResponse | null;
  hasPlannedOnce: boolean;
  setPreference: <K extends keyof PreferenceWeights>(
    key: K,
    value: PreferenceWeights[K],
  ) => void;
  setFreeText: (text: string) => void;
  setDuration: (days: number) => void;
  setOrigin: (origin: string) => void;
  setContinentFilter: (continent: Continent | null) => void;
  setRegionFilter: (region: Region | null) => void;
  setPlan: (plan: TripPlanResponse | null) => void;
  resetReferenceTrip: () => void;
};

export const useTripStore = create<TripStore>()(
  persist(
    (set) => ({
      request: REFERENCE_TRIP,
      plan: null,
      hasPlannedOnce: false,
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
          request: {
            ...state.request,
            durationDays: Math.min(14, Math.max(1, days)),
          },
        })),
      setOrigin: (origin) =>
        set((state) => ({
          request: {
            ...state.request,
            origin: origin.toUpperCase().slice(0, 8),
          },
        })),
      setContinentFilter: (continent) =>
        set((state) => {
          const filters: TripFilters = { ...state.request.filters, maxResults: 8 };
          if (continent) filters.continents = [continent];
          else delete filters.continents;
          return { request: { ...state.request, filters } };
        }),
      setRegionFilter: (region) =>
        set((state) => {
          const filters: TripFilters = { ...state.request.filters, maxResults: 8 };
          if (region) filters.regions = [region];
          else delete filters.regions;
          return { request: { ...state.request, filters } };
        }),
      setPlan: (plan) =>
        set((state) => ({
          plan,
          hasPlannedOnce: plan ? true : state.hasPlannedOnce,
        })),
      resetReferenceTrip: () =>
        set({ request: REFERENCE_TRIP, plan: null, hasPlannedOnce: false }),
    }),
    { name: "aether-trip-v2" },
  ),
);

export function buildRequestFromStore(state: TripStore): TripRequest {
  return {
    ...state.request,
    preferences: { ...DEFAULT_PREFERENCES, ...state.request.preferences },
    filters: { maxResults: 8, ...state.request.filters },
  };
}
