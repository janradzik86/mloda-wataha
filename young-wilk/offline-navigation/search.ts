import type { GeoPoint, SearchResult } from "./types";
import type { OfflineSearchProvider } from "./contracts";
import { haversineMeters } from "./geo";

export class MemoryOfflineSearchProvider implements OfflineSearchProvider {
  constructor(private items: SearchResult[]) {}

  async search(query: string, near?: GeoPoint, limit=20): Promise<SearchResult[]> {
    const q=query.trim().toLowerCase();
    if (!q) return [];
    return this.items
      .filter(x => (x.name+" "+(x.subtitle??"")+" "+(x.category??"")).toLowerCase().includes(q))
      .sort((a,b) => near ? haversineMeters(near,a.point)-haversineMeters(near,b.point) : a.name.localeCompare(b.name))
      .slice(0,limit);
  }
}
