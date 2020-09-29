import createRestBundle from "./create-rest-bundle";

export default createRestBundle({
  name: "alertUnsubscribe",
  uid: "id",
  prefetch: false,
  persist: false,
  postTemplate: "/projects/:projectId/instruments/:instrumentId/alert_configs/:item.id/unsubscribe",
  urlParamSelectors: ["selectProjectsIdByRoute", "selectInstrumentsIdByRoute"],
});
