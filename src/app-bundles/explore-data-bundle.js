import { createSelector } from 'redux-bundler';

import { seriesStyles } from '../common/helpers/utils';

const exploreDataBundle = {
  name: 'exploreData',

  getReducer: () => {
    const initialData = {
      data: [],
      inclinometers: [],
      filters: {
        status: [],
        type: [],
      },
      _isLoading: false,
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case 'EXPLORE_DATA_CLEAR':
        case 'URL_UPDATED':
          return { ...initialData };
        case 'EXPLORE_DATA_LOADING':
          return {
            ...state,
            _isLoading: payload,
          };
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
        case 'EXPLORE_DATA_UPDATE_FILTERS_START':
          return {
            ...state,
            filters: payload,
          };
        default:
          return state;
      }
    };
  },

  doExploreDataClear: () => ({ dispatch }) => {
    dispatch({ type: 'EXPLORE_DATA_CLEAR' });
  },

  doSetExploreDataFilters: (filters) => ({ dispatch }) => {
    dispatch({ type: 'EXPLORE_DATA_UPDATE_FILTERS_START', payload: filters });
    dispatch({ type: 'EXPLORE_DATA_UPDATE_FILTERS_END' });
  },

  doExploreDataLoad: (instrumentIds, before, after) => async ({ dispatch, store }) => {
    store.doExploreDataClear();
    dispatch({ type: 'EXPLORE_DATA_LOADING', payload: true });

    const apiRoot = store.selectApiRoot();
    const token = store.selectAuthTokenRaw();

    await fetch(`${apiRoot}/explorer?before=${before}&after=${after}`, {
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

    await fetch(`${apiRoot}/inclinometer_explorer?before=${before}&after=${after}`, {
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
    
    dispatch({ type: 'EXPLORE_DATA_LOADING', payload: false });
  },

  selectExploreData: (state) => state.exploreData,
  selectExploreDataLoading: state => state.exploreData._isLoading,
  selectExploreDataFilters: state => state.exploreData.filters,

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
