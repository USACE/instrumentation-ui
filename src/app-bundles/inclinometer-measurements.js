import createRestBundle from './create-rest-bundle';

export default createRestBundle({
  name: 'inclinometerMeasurements',
  uid: 'timeseries_id',
  staleAfter: 10000,
  persist: false,
  routeParam: '',

  // TODO: default before and after time periods should be implemented on the backend.
  getTemplate: '/timeseries/:timeseriesId/inclinometer_measurements?before=2025-01-01T00:00:00.00Z&after=1900-01-01T00:00:00.00Z',
  putTemplate: '',
  postTemplate: '/timeseries/:timeseriesId/inclinometer_measurements',
  deleteTemplate: '/timeseries/:timeseriesId/inclinometer_measurements?time={:item.date}',
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
    const pathname = store.selectRelativePathname();

    const whitelist = [];
    const pathnameWhitelist = ['/instruments/', '/groups/', '/collection-groups/'];

    return whitelist.includes(hash) || pathnameWhitelist.some(elem => pathname.includes(elem));
  },
  addons: {
    doFetchInclinometerMeasurementsByTimeseriesId: (timeseriesId) => ({ dispatch, apiGet }) => {
      const uri = `/timeseries/${timeseriesId}/inclinometer_measurements?before=2025-01-01T00:00:00.00Z&after=1900-01-01T00:00:00.00Z`;

      apiGet(uri, (err, body) => {
        if (err) {
          // eslint-disable-next-line no-console
          console.log('error: ', err);
        } else {
          dispatch({
            type: 'SET_CURRENT_INCLINOMETER_MEASUREMENTS',
            payload: {
              timeseriesId,
              measurements: body,
            },
          });
        }
      });
    },

    selectCurrentInclinometerMeasurements: state => state.inclinometerMeasurements.currentMeasurements,
  },
  reduceFurther: (state, { type, payload }) => {
    if (type === 'SET_CURRENT_INCLINOMETER_MEASUREMENTS') {
      return {
        ...state,
        'currentMeasurements': {
          ...state['currentMeasurements'],
          [payload.timeseriesId]: payload.measurements,
        },
      };
    } else {
      return state;
    }
  },
});
