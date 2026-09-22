import type { GeoPoint, OfflineMapPackState, RouteResult, SearchResult, TravelMode } from "./types";

export interface OfflineSearchProvider {
  search(query: string, near?: GeoPoint, limit?: number): Promise<SearchResult[]>;
}

export interface OfflineRoutingProvider {
  route(from: GeoPoint, to: GeoPoint, mode: TravelMode): Promise<RouteResult>;
}

export interface OfflineMapPackProvider {
  list(): Promise<OfflineMapPackState[]>;
  isCoverageAvailable(point: GeoPoint): Promise<boolean>;
  verify(packId: string): Promise<boolean>;
}

export interface LocationProvider {
  current(): Promise<GeoPoint | null>;
  watch(onLocation: (point: GeoPoint) => void): () => void;
}
