import createRestBundle from "./create-rest-bundle";

export default createRestBundle({
  name: "alertSubscribe",
  uid: "id",
  prefetch: false,
  persist: false,
  getTemplate: "/my_alert_subscriptions",
  postTemplate: "/projects/:projectId/instruments/:instrumentId/alert_configs/:item.id/subscribe",
  forceFetchActions: ["ALERTSUBSCRIBE_SAVE_FINISHED"],
  urlParamSelectors: ["selectProjectsIdByRoute", "selectInstrumentsIdByRoute"],
});
