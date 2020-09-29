import createRestBundle from "./create-rest-bundle";

export default createRestBundle({
  name: "alertSubscribe",
  uid: "id",
  prefetch: false,
  persist: false,
  postTemplate: "/projects/:projectId/instruments/:instrumentId/alert_configs/:item.id/subscribe",
  urlParamSelectors: ["selectProjectsIdByRoute", "selectInstrumentsIdByRoute"],
});
