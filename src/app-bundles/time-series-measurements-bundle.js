import createRestBundle from "./create-rest-bundle";

export default createRestBundle({
  name: "timeseriesMeasurements",
  uid: "timeseries_id",
  prefetch: true,
  staleAfter: 10000,
  persist: false,
  routeParam: "",
  getTemplate: `/timeseries/:timeseriesId/measurements?after=1900-01-01T00:00:00.00Z&before=2025-01-01T00:00:00.00Z`,
  putTemplate: "",
  postTemplate: "/projects/:projectId/timeseries_measurements",
  deleteTemplate: "",
  fetchActions: ["URL_UPDATED", "AUTH_LOGGED_IN"],
  forceFetchActions: ["INSTRUMENTTIMESERIES_SET_ACTIVE_ID"],
  urlParamSelectors: [
    "selectInstrumentTimeseriesActiveIdParam",
    "selectProjectsIdByRoute",
  ],
  mergeItems: true,
  addons: {},
});
