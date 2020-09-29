import createRestBundle from "./create-rest-bundle";

export default createRestBundle({
  name: "instrumentConstants",
  uid: "id",
  prefetch: true,
  staleAfter: 10000,
  persist: false,
  routeParam: "id",
  getTemplate: "/:", // "/:" disables any accidental trigger of a fetch
  putTemplate:
    "/projects/:project_id/instruments/:instrument_id/constants/:item.id",
  postTemplate: "/projects/:project_id/instruments/:instrument_id/constants",
  deleteTemplate:
    "/projects/:project_id/instruments/:instrument_id/constants/:item.id",
  fetchActions: [],
  urlParamSelectors: ["selectProjectsIdByRoute", "selectInstrumentsIdByRoute"],
});
