import { LOCATIONS } from "@/data/locations";

/** @deprecated Import from `@/data/locations` */
export const MONTENEGRO_LOCATIONS = LOCATIONS;

export function getRegionLocations(regionId?: string) {
  void regionId;
  return LOCATIONS;
}

export { getLocationById } from "@/data/locations";
