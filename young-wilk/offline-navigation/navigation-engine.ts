import type { GeoPoint, NavigationProgress, RouteResult, RouteStep, TravelMode } from "./types";
import type { OfflineRoutingProvider } from "./contracts";
import { haversineMeters, nearestPointIndex, remainingDistanceMeters } from "./geo";

export interface NavigationOptions {
  rerouteDistanceM?: number;
  arrivalDistanceM?: number;
  stepAdvanceDistanceM?: number;
}

export class OfflineNavigationEngine {
  private route?: RouteResult;
  private stepIndex = 0;
  private destination?: GeoPoint;
  private mode: TravelMode = "walk";
  private options: Required<NavigationOptions>;

  constructor(private router: OfflineRoutingProvider, options: NavigationOptions = {}) {
    this.options = {
      rerouteDistanceM: options.rerouteDistanceM ?? 45,
      arrivalDistanceM: options.arrivalDistanceM ?? 25,
      stepAdvanceDistanceM: options.stepAdvanceDistanceM ?? 30
    };
  }

  async start(from: GeoPoint, to: GeoPoint, mode: TravelMode): Promise<RouteResult> {
    const route = await this.router.route(from,to,mode);
    if (!route.points.length) throw new Error("Router returned empty route");
    this.route = route;
    this.destination = to;
    this.mode = mode;
    this.stepIndex = 0;
    return route;
  }

  stop() {
    this.route = undefined;
    this.destination = undefined;
    this.stepIndex = 0;
  }

  currentRoute() { return this.route; }

  update(current: GeoPoint): NavigationProgress {
    if (!this.route || !this.destination) return { active:false, rerouteSuggested:false, arrived:false };

    const nearest = nearestPointIndex(this.route.points,current);
    const toDestination = haversineMeters(current,this.destination);
    const arrived = toDestination <= this.options.arrivalDistanceM;

    while (this.stepIndex < this.route.steps.length - 1) {
      const next = this.route.steps[this.stepIndex];
      const d = haversineMeters(current,next.point);
      if (d <= this.options.stepAdvanceDistanceM) this.stepIndex++;
      else break;
    }

    const nextStep: RouteStep | undefined = this.route.steps[this.stepIndex];
    return {
      active: !arrived,
      routeId: this.route.id,
      distanceToRouteM: nearest.distanceM,
      distanceToDestinationM: remainingDistanceMeters(this.route.points, Math.max(0,nearest.index), current),
      nextStep,
      nextStepDistanceM: nextStep ? haversineMeters(current,nextStep.point) : undefined,
      rerouteSuggested: !arrived && nearest.distanceM > this.options.rerouteDistanceM,
      arrived
    };
  }

  async reroute(current: GeoPoint): Promise<RouteResult> {
    if (!this.destination) throw new Error("Navigation not active");
    return this.start(current,this.destination,this.mode);
  }
}
