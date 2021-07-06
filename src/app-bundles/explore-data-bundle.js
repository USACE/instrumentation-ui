import { createSelector } from 'redux-bundler';

import { seriesStyles } from '../utils';

const exploreDataBundle = {
  name: 'exploreData',

  getReducer: () => {
    const initialData = {
      data: [],
      inclinometers: [],
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case 'EXPLORE_DATA_CLEAR':
          return Object.assign({}, initialData);
        case 'EXPLORE_DATA_LOAD':
          return Object.assign({}, state, { data: payload });
        case 'INCLINOMETER_DATA_LOAD':
          return Object.assign({}, state, { inclinometers: payload });
        case 'URL_UPDATED':
          return Object.assign({}, initialData);
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

  doExploreDataLoad: (instrumentIds, before, after) => ({ dispatch, store }) => {
    store.doExploreDataClear();

    const apiRoot = store.selectApiRoot();
    const token = store.selectAuthTokenRaw();

    fetch(`${apiRoot}/explorer?before=${before}&after=${after}`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify(instrumentIds),
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch({
          type: 'EXPLORE_DATA_LOAD',
          payload: data,
        });
      });
  },

  doInclinometerDataLoad: (instrumentIds, before, after) => ({ dispatch, store }) => {
    const apiRoot = store.selectApiRoot();
    const token = store.selectAuthTokenRaw();

    fetch(`${apiRoot}/inclinometers?before=${before}&after=${after}`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify(instrumentIds),
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch({
          type: 'INCLINOMETER_DATA_LOAD',
          payload: data,
        });
      });
  },

  selectExploreData: (state) => state.exploreData,

  selectExploreDataByInstrumentId: createSelector(
    'selectExploreData',
    'selectInstrumentsItemsObjectById',
    'selectInstrumentTimeseriesItemsObject',
    (exploreData, instrumentsById, timeseriesItems) => {
      const { data = [], inclinometers = [] } = exploreData;
      const out = {};

      console.log('test data: ', data);
      console.log('test inclinometers: ', inclinometers);
      Object.keys(data).forEach((instrumentId, index) => {
        out[instrumentId] = {
          ...instrumentsById[instrumentId],
          timeseries: data[instrumentId].map((ts) => ({
            ...timeseriesItems[ts.timeseries_id],
            items: ts.items,
            style: seriesStyles[index++ % 11],
          })),
        };
      });
      return out;
    }
  ),
};

export default exploreDataBundle;
