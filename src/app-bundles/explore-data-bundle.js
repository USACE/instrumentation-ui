import { createSelector } from 'redux-bundler';

import { seriesStyles } from '../common/helpers/utils';

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
          return {
            ...state,
            data: payload,
          };
        case 'INCLINOMETER_DATA_LOAD':
          return {
            ...state,
            inclinometers: payload,
          };
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

    fetch(`${apiRoot}/inclinometer_explorer?before=${before}&after=${after}`, {
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
      let count = 0;

      Object.keys(data).forEach(id => {
        out[id] = {
          ...instrumentsById[id],
          timeseries: data[id].map(ts => {
            if (!ts.items.length) return null;

            return {
              ...timeseriesItems[ts.timeseries_id],
              items: ts.items,
              style: seriesStyles[count++ % 11],
              isInclinometer: false,
            };
          }).filter(e => e),
        };
      });

      Object.keys(inclinometers).forEach(id => {
        out[id] = {
          ...instrumentsById[id],
          timeseries: inclinometers[id].map(ts => {
            if (!ts.items.length) return null;

            return ({
              ...timeseriesItems[ts.timeseries_id],
              items: ts.items,
              style: seriesStyles[count++ % 11],
              isInclinometer: true,
            });
          }).filter(e => e).concat(out[id] ? out[id].timeseries : []),
        };
      });

      return out;
    }
  ),
};

export default exploreDataBundle;
