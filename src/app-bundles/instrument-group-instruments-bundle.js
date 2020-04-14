import createRestBundle from "./create-rest-bundle";
import { createSelector } from "redux-bundler";

export default createRestBundle({
  name: "instrumentGroupInstruments",
  uid: "id",
  prefetch: true,
  staleAfter: 10000,
  persist: false,
  routeParam: "groupId",
  getTemplate: "/instrument_groups/:groupId/instruments",
  putTemplate: "/instrument_groups/:item.id",
  postTemplate: "/instrument_groups",
  deleteTemplate: "/instrument_groups/:item.id",
  fetchActions: ["URL_UPDATED", "AUTH_LOGGED_IN"],
  forceFetchActions: [],
  urlParamSelectors: ["selectInstrumentGroupsIdByRoute"],
  addons: {
    selectInstrumentGroupInstrumentsItemsGeoJSON: createSelector(
      "selectInstrumentGroupInstrumentsItems",
      (items) => {
        return {
          type: "FeatureCollection",
          features: items.map((item) => {
            const feature = {
              type: "Feature",
              geometry: { ...item.geometry },
              properties: { ...item },
            };
            delete feature.properties.geometry;
            return feature;
          }),
        };
      }
    ),
  },
});
