import createRestBundle from './create-rest-bundle';

const afterDate = '1900-01-01T00:00:00.00Z';
const beforeDate = '2025-01-01T00:00:00.00Z';

export default createRestBundle({
  name: 'inclinometerMeasurements',
  uid: 'timeseries_id',
  staleAfter: 10000,
  persist: false,
  routeParam: '',
  getTemplate: `/timeseries/:timeseriesId/inclinometer_measurements?before=${beforeDate}&after=${afterDate}`,
  putTemplate: '',
  postTemplate: '',
  deleteTemplate: '',
  fetchActions: [],
  forceFetchActions: [
    'INSTRUMENTTIMESERIES_SET_ACTIVE_ID',
    'INSTRUMENTTIMESERIES_FETCH_FINISHED',
    'TIMESERIESMEASUREMENTS_SAVE_FINISHED',
  ],
  urlParamSelectors: [
    'selectInstrumentTimeseriesActiveIdParam',
  ],
  mergeItems: true,
  prefetch: (store) => {
    const hash = store.selectHash();
    const url = store.selectUrlObject();

    const whitelist = [];
    const pathnameWhitelist = ['/instruments/', '/groups/', '/collection-groups/'];

    return whitelist.includes(hash) || pathnameWhitelist.some(elem => url.pathname.includes(elem));
  },

  addons : {
    doInclinometerMeasurementDelete: ({
      timeseriesId,
      date,
    }) => ({ dispatch, store, apiDelete }) => {
      dispatch({ type: 'DELETE_INCLINOMETER_MEASUREMENT_START', payload: {} });
      
      const url = `/timeseries/${timeseriesId}/inclinometer_measurements?time=${date}`;
      const delItem = [{'timeseries_id' : timeseriesId, 'time' : date}];

      apiDelete(url, (_err, body) => {
        dispatch({
          type: 'INCLINOMETER_MEASUREMENT_ITEM_TO_DELETE',
          payload: {
            ...delItem,
            ...{
              _isLoading: false,
              _isSaving: false,
              _lastResource: url,
              _abortReason: null,
            }
          },
        });
        dispatch({ type: 'DELETE_INCLINOMETER_MEASUREMENT_FINISHED', payload: {} });
      });
    },
  }
});
