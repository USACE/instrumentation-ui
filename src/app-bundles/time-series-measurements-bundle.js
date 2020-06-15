import createRestBundle from "./create-rest-bundle";
import { createSelector } from "redux-bundler";

export default createRestBundle({
  name: "timeseriesMeasurements",
  uid: "timeseries_id",
  prefetch: true,
  staleAfter: 10000,
  persist: false,
  routeParam: "",
  getTemplate: `/timeseries/:timeseriesId/measurements?after=1900-01-01T00:00:00.00Z&before=2025-01-01T00:00:00.00Z`,
  putTemplate: "",
  postTemplate: "",
  deleteTemplate: "",
  fetchActions: ["URL_UPDATED", "AUTH_LOGGED_IN"],
  forceFetchActions: ["INSTRUMENTTIMESERIES_SET_ACTIVE_ID"],
  urlParamSelectors: ["selectInstrumentTimeseriesActiveIdParam"],
  mergeItems: true,
  addons: {
    selectTimeseriesMeasurementsX: createSelector(
      "selectTimeseriesMeasurementsItemsObject",
      (item) => {
        let time = [];
        Object.keys(item).forEach(function (key) {
          let val = item[key];
          val.items.map((x) => time.push(x.time));
        });
        return time;
      }
    ),
    selectTimeseriesMeasurementsY: createSelector(
      "selectTimeseriesMeasurementsItemsObject",
      (item) => {
        let value = [];
        Object.keys(item).forEach(function (key) {
          let val = item[key];
          val.items.map((y) => value.push(y.value));
        });
        return value;
      }
    ),
  },
});
