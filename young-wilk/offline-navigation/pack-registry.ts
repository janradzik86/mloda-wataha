import type { GeoPoint, OfflineMapPackManifest, OfflineMapPackState } from "./types";

export function pointInsideBbox(point: GeoPoint, bbox: [number,number,number,number]) {
  const [minLon,minLat,maxLon,maxLat]=bbox;
  return point.lon>=minLon && point.lon<=maxLon && point.lat>=minLat && point.lat<=maxLat;
}

export class OfflineMapPackRegistry {
  constructor(private states: OfflineMapPackState[]) {}

  list() { return [...this.states]; }

  covering(point: GeoPoint) {
    return this.states.filter(s => s.installed && s.verified && pointInsideBbox(point,s.manifest.bbox));
  }

  canNavigate(from: GeoPoint,to: GeoPoint) {
    return this.covering(from).length>0 && this.covering(to).length>0;
  }

  update(state: OfflineMapPackState) {
    const i=this.states.findIndex(x=>x.manifest.id===state.manifest.id);
    if (i>=0) this.states[i]=state; else this.states.push(state);
  }
}
