import type { GeoPoint } from "./types";

const EARTH_M = 6371000;

function rad(v: number) { return v * Math.PI / 180; }

export function haversineMeters(a: GeoPoint, b: GeoPoint): number {
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const la1 = rad(a.lat);
  const la2 = rad(b.lat);
  const h = Math.sin(dLat/2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon/2) ** 2;
  return 2 * EARTH_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function polylineLengthMeters(points: GeoPoint[]): number {
  let total = 0;
  for (let i=1;i<points.length;i++) total += haversineMeters(points[i-1], points[i]);
  return total;
}

export function nearestPointIndex(points: GeoPoint[], current: GeoPoint): { index:number; distanceM:number } {
  if (!points.length) return { index:-1, distanceM:Infinity };
  let best=0, bestD=Infinity;
  points.forEach((p,i) => {
    const d=haversineMeters(p,current);
    if (d<bestD) { best=i; bestD=d; }
  });
  return { index:best, distanceM:bestD };
}

export function remainingDistanceMeters(points: GeoPoint[], fromIndex: number, current?: GeoPoint): number {
  if (!points.length || fromIndex < 0 || fromIndex >= points.length) return 0;
  let total = current ? haversineMeters(current, points[fromIndex]) : 0;
  for (let i=fromIndex+1;i<points.length;i++) total += haversineMeters(points[i-1],points[i]);
  return total;
}
