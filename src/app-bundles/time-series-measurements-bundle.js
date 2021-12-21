import createRestBundle from './create-rest-bundle';

const afterDate = '1900-01-01T00:00:00.00Z';
const beforeDate = '2025-01-01T00:00:00.00Z';

export default createRestBundle({
  name: 'timeseriesMeasurements',
  uid: 'timeseries_id',
  staleAfter: 10000,
  persist: false,
  routeParam: '',
  getTemplate: `/timeseries/:timeseriesId/measurements?after=${afterDate}&before=${beforeDate}`,
  putTemplate: '',
  postTemplate: '/projects/:projectId/timeseries_measurements',
  deleteTemplate: '/timeseries/:timeseriesId/measurements',
  fetchActions: [],
  forceFetchActions: [
    'INSTRUMENTTIMESERIES_SET_ACTIVE_ID',
    'INSTRUMENTTIMESERIES_FETCH_FINISHED',
    'TIMESERIESMEASUREMENTS_SAVE_FINISHED',
  ],
  urlParamSelectors: [
    'selectInstrumentTimeseriesActiveIdParam',
    'selectProjectsIdByRoute',
  ],
  mergeItems: true,
  prefetch: (store) => {
    const hash = store.selectHash();
    const url = store.selectUrlObject();

    const whitelist = [];
    const pathnameWhitelist = ['/instruments/', '/groups/', '/collection-groups/'];

    return whitelist.includes(hash) || pathnameWhitelist.some(elem => url.pathname.includes(elem));
  },
  addons: {
    doTimeseriesMeasurementsFetchById: ({
      timeseriesId
    }) => ({ dispatch, store, apiGet }) => {
      dispatch({ type: 'TIMESERIES_FETCH_BY_ID_START', payload: {} });

      const url = `/timeseries/${timeseriesId}/measurements?after=${afterDate}&before=${beforeDate}`;
      const flags = store['selectTimeseriesMeasurementsFlags']();
      const itemsById = store['selectTimeseriesMeasurementsItemsObject']();
      let fetchCount = store['selectTimeseriesMeasurementsFetchCount']();

      apiGet(url, (_err, body) => {
        new Array(body).forEach(item => itemsById[item['timeseries_id']] = item);

        dispatch({
          type: 'TIMSERIES_MEASUREMENTS_UPDATED_ITEM',
          payload: {
            ...itemsById,
            ...flags,
            ...{
              _isLoading: false,
              _isSaving: false,
              _fetchCount: ++fetchCount,
              _lastFetch: new Date(),
              _lastResource: url,
              _abortReason: null,
            },
          },
        });
        dispatch({ type: 'TIMESERIES_FETCH_BY_ID_FINISHED', payload: {} });
      });
    },
    
    doDeleteTimeseriesMeasurement: ({
      timeseriesId,
      date,
    }) => ({ dispatch, store, apiDelete }) => {
      dispatch({ type: 'DELETE_TIMESERIES_MEASUREMENT_START', payload: {} });
      
      const url = `/timeseries/${timeseriesId}/measurements?time=${date}`;
      const flags = store['selectTimeseriesMeasurementsFlags']();
      const delItem = [{'timeseries_id' : timeseriesId, 'time' : date}];
      let fetchCount = store['selectTimeseriesMeasurementsFetchCount']();

      apiDelete(url, (_err, body) => {
        dispatch({
          type: 'TIMESERIES_MEASUREMENT_ITEM_TO_DELETE',
          payload: {
            ...delItem,
            ...flags,
            ...{
              _isLoading: false,
              _isSaving: false,
              _fetchCount: ++fetchCount,
              _lastFetch: new Date(),
              _lastResource: url,
              _abortReason: null,
            }
          },
        });
        dispatch({ type: 'DELETE_TIMESERIES_MEASUREMENT_FINISHED', payload: {} });
      });
    },
  },

  reduceFurther: (state, { type, payload }) => {
    switch (type) {
      case 'TIMSERIES_MEASUREMENTS_UPDATED_ITEM':
        return Object.assign({}, state, payload);
      default:
        return state;
    }
  },
});
