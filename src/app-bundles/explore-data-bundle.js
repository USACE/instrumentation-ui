import { createSelector } from "redux-bundler";
import { seriesStyles } from "../utils";

export default {
  name: "exploreData",

  getReducer: () => {
    const initialData = {};

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case "EXPLORE_DATA_LOAD":
          return Object.assign({}, state, payload);
        default:
          return state;
      }
    };
  },

  doExploreDataLoad: (instrumentIds) => ({ dispatch, store }) => {
    const apiRoot = store.selectApiRoot();
    fetch(`${apiRoot}/explorer`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(instrumentIds),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        dispatch({
          type: "EXPLORE_DATA_LOAD",
          payload: data,
        });
      });
  },

  selectExploreData: (state) => {
    return state.exploreData;
  },

  selectExploreDataByInstrumentId: createSelector(
    "selectExploreData",
    "selectInstrumentsItemsObjectById",
    "selectInstrumentTimeseriesItemsObject",
    (data, instrumentsById, timeseriesItems) => {
      const out = {};
      let styleIter = 0;
      Object.keys(data).forEach((instrumentId) => {
        out[instrumentId] = {
          ...instrumentsById[instrumentId],
          timeseries: data[instrumentId].map((ts) => {
            return {
              ...timeseriesItems[ts.timeseries_id],
              items: ts.items,
              style: seriesStyles[styleIter++ % 11],
            };
          }),
        };
      });
      return out;
    }
  ),
};
