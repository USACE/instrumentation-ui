import createRestBundle from "./create-rest-bundle";

export default createRestBundle({
  name: "alertUnsubscribe",
  uid: "id",
  prefetch: false,
  persist: false,
  getTemplate: "/my_alert_subscriptions",
  postTemplate: "/projects/:projectId/instruments/:instrumentId/alert_configs/:item.id/unsubscribe",
  forceFetchActions: ["ALERTUNSUBSCRIBE_SAVE_FINISHED"],
  urlParamSelectors: ["selectProjectsIdByRoute", "selectInstrumentsIdByRoute"],
});
