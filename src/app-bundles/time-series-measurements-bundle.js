import createRestBundle from "./create-rest-bundle";
import { createSelector } from "redux-bundler"

export default createRestBundle({
  name: "timeseriesMeasurements",
  uid: "id",
  prefetch: true,
  staleAfter: 10000,
  persist: false,
  routeParam: "",
  // getTemplate: `/timeseries/:timeseriesId/measurements?after=:after&before=:before`,
  getTemplate: `/timeseries/:timeseriesId/measurements?after=1900-01-01T00:00:00.00Z&before=2021-01-01T00:00:00.00Z`,
  putTemplate: "",
  postTemplate: "",
  deleteTemplate: "",
  fetchActions: ["URL_UPDATED", "AUTH_LOGGED_IN"],
  forceFetchActions: ["INSTRUMENTTIMESERIES_SET_ACTIVE_ID"],
  urlParamSelectors: ["selectInstrumentTimeseriesActiveIdParam"],
  addons: {
    selectTimeseriesMeasurementsX: createSelector(
      "selectTimeseriesMeasurementsItems",
      item => {
        let time = []
        item.map(x => time.push(x.time))
        return time
      }),
    selectTimeseriesMeasurementsY: createSelector(
      "selectTimeseriesMeasurementsItems",
      item => {
        let value = []
        item.map(y => value.push(y.value))
        return value
      }),
  },
});
