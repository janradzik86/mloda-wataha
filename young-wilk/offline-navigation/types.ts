export type TravelMode = "walk" | "bike" | "car";
export type Maneuver = "start" | "continue" | "turn_left" | "turn_right" | "u_turn" | "arrive";

export interface GeoPoint {
  lat: number;
  lon: number;
}

export interface SearchResult {
  id: string;
  name: string;
  subtitle?: string;
  point: GeoPoint;
  category?: string;
  packId: string;
}

export interface RouteStep {
  maneuver: Maneuver;
  instruction: string;
  point: GeoPoint;
  distanceFromStartM: number;
}

export interface RouteResult {
  id: string;
  mode: TravelMode;
  points: GeoPoint[];
  steps: RouteStep[];
  distanceM: number;
  durationSec?: number;
  generatedOffline: boolean;
  packIds: string[];
}

export interface NavigationProgress {
  active: boolean;
  routeId?: string;
  distanceToRouteM?: number;
  distanceToDestinationM?: number;
  nextStep?: RouteStep;
  nextStepDistanceM?: number;
  rerouteSuggested: boolean;
  arrived: boolean;
}

export interface OfflineMapPackManifest {
  id: string;
  name: string;
  regionType: "country" | "voivodeship" | "corridor" | "custom";
  version: string;
  bbox: [number, number, number, number];
  mapFile: string;
  searchFile: string;
  routingPath: string;
  sha256?: string;
  signature?: string;
}

export interface OfflineMapPackState {
  manifest: OfflineMapPackManifest;
  installed: boolean;
  verified: boolean;
  installedAt?: string;
}
