import { OfflineNavigationEngine, type OfflineRoutingProvider, type RouteResult } from "./index";

const mock: OfflineRoutingProvider = {
  async route(from,to,mode): Promise<RouteResult> {
    return {
      id:"r1", mode, generatedOffline:true, packIds:["test"],
      points:[from,{lat:(from.lat+to.lat)/2,lon:(from.lon+to.lon)/2},to],
      steps:[
        {maneuver:"start",instruction:"Start",point:from,distanceFromStartM:0},
        {maneuver:"arrive",instruction:"Cel",point:to,distanceFromStartM:1000}
      ],
      distanceM:1000
    };
  }
};

(async()=>{
  const nav=new OfflineNavigationEngine(mock,{rerouteDistanceM:50,arrivalDistanceM:20});
  await nav.start({lat:50,lon:17},{lat:50.01,lon:17.01},"walk");
  const p=nav.update({lat:50.01,lon:17.01});
  if(!p.arrived) throw new Error("Arrival should be detected");
})();
