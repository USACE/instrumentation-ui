import createRestBundle from "./create-rest-bundle";

export default createRestBundle({
  name: "instrumentConstants",
  uid: "id",
  prefetch: true,
  staleAfter: 10000,
  persist: false,
  routeParam: "id",
  getTemplate: "/:", // "/:" disables any accidental trigger of a fetch
  putTemplate: "/timeseries/:item.id",
  postTemplate: "/timeseries",
  deleteTemplate: "/timeseries/:item.id",
  fetchActions: [],
});
