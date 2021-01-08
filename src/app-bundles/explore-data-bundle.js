import { createSelector } from 'redux-bundler';
import { seriesStyles } from '../utils';

const exploreDataBundle = {
  name: 'exploreData',

  getReducer: () => {
    const initialData = {};

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case 'EXPLORE_DATA_CLEAR':
          return Object.assign({}, initialData);
        case 'EXPLORE_DATA_LOAD':
          return Object.assign({}, state, payload);
        default:
          return state;
      }
    };
  },

  doExploreDataClear: () => ({ dispatch }) => {
    dispatch({
      type: 'EXPLORE_DATA_CLEAR',
    });
  },

  doExploreDataLoad: (instrumentIds) => ({ dispatch, store }) => {
    store.doExploreDataClear();
    const apiRoot = store.selectApiRoot();
    const token = store.selectAuthTokenRaw();
    fetch(`${apiRoot}/explorer`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(instrumentIds),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        dispatch({
          type: 'EXPLORE_DATA_LOAD',
          payload: data,
        });
      });
  },

  selectExploreData: (state) => {
    return state.exploreData;
  },

  selectExploreDataByInstrumentId: createSelector(
    'selectExploreData',
    'selectInstrumentsItemsObjectById',
    'selectInstrumentTimeseriesItemsObject',
    (data, instrumentsById, timeseriesItems) => {
      if (!data) return {};
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

export default exploreDataBundle;