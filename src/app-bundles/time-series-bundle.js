import createRestBundle from "./create-rest-bundle";
import { createSelector } from "redux-bundler";

export default createRestBundle({
  name: "instrumentTimeseries",
  uid: "id",
  prefetch: true,
  staleAfter: 10000,
  persist: false,
  routeParam: "",
  getTemplate: "/timeseries",
  putTemplate: "",
  postTemplate: "",
  deleteTemplate: "",
  fetchActions: ["URL_UPDATED", "AUTH_LOGGED_IN"],
  forceFetchActions: [],
  urlParamSelectors: ["selectInstrumentsIdByRoute"],
  reduceFurther: (state, { type, payload }) => {
    if (type === "INSTRUMENTTIMESERIES_SET_ACTIVE_ID") {
      return Object.assign({}, state, payload);
    } else {
      return state;
    }
  },
  addons: {
    doInstrumentTimeseriesSetActiveId: (id) => ({ dispatch }) => {
      dispatch({
        type: "INSTRUMENTTIMESERIES_SET_ACTIVE_ID",
        payload: {
          _activeId: id,
        },
      });
    },

    selectInstrumentTimeseriesActiveId: (state) => {
      return state.instrumentTimeseries._activeId;
    },

    selectInstrumentTimeseriesActiveIdParam: createSelector(
      "selectInstrumentTimeseriesActiveId",
      (id) => {
        if (!id) return null;
        return { timeseriesId: id };
      }
    ),

    selectInstrumentTimeseriesByInstrumentId: createSelector(
      "selectInstrumentTimeseriesItems",
      (timeseries) => {
        if (!timeseries || !timeseries.length) return {};
        const out = {};
        timeseries.forEach((ts) => {
          if (!out.hasOwnProperty(ts.instrument_id)) out[ts.instrument_id] = [];
          out[ts.instrument_id].push(ts);
        });
        return out;
      }
    ),
  },
});

// let apiRoot = "http://localhost:3030";
// export default {
//   name: "timeseries",

//   getReducer: () => {
//     const initialData = {
//       data: [],
//       x: [],
//       y: [],
//       shouldFetch: true,
//     };

//     return (state = initialData, { type, payload }) => {
//       switch (type) {
//         case "TIME_SERIES_FETCH_STARTED":
//         case "TIME_SERIES_FETCH_FINISHED":
//           return Object.assign({}, state, payload);
//         default:
//           return state;
//       }
//     };
//   },
//   doTimeseriesFetch: (x) => ({ dispatch, store }) => {
//     dispatch({
//       type: "TIME_SERIES_FETCH_STARTED",
//       payload: {
//         shouldFetch: false,
//       },
//     });
//     fetch(apiRoot + "/timeseries_measurements/")
//       .then((response) => response.json())
//       .then((j) =>
//         dispatch({ type: "TIME_SERIES_FETCH_FINISHED", payload: { data: j } })
//       );
//   },

//   selectTimeseriesX: (state) => {
//     return state.timeseries.data.map((item) => {
//       return new Date(item.time);
//     });
//   },

//   selectTimeseriesY: (state) => {
//     return state.timeseries.data.map((item) => {
//       return item.value;
//     });
//   },

//   reactTimeseriesShouldFetch: (state) => {
//     if (state.timeseries.shouldFetch)
//       return {
//         actionCreator: "doTimeseriesFetch",
//       };
//   },
// };
