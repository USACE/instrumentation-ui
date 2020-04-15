import createRestBundle from "./create-rest-bundle";

export default createRestBundle({
  name: "timeseriesMeasurements",
  uid: "id",
  prefetch: true,
  staleAfter: 10000,
  persist: false,
  routeParam: "",
  getTemplate: `/timeseries/:timeseriesId/measurements?after=:after&before=:before`,
  putTemplate: "",
  postTemplate: "",
  deleteTemplate: "",
  fetchActions: ["URL_UPDATED", "AUTH_LOGGED_IN"],
  forceFetchActions: [],
  urlParamSelectors: ["selectInstrumentTimeseriesActiveIdParam"],
  addons: {},
});
