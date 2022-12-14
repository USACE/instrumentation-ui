import createRestBundle from './create-rest-bundle';

const afterDate = '1900-01-01T00:00:00.00Z';
const beforeDate = '2025-12-31T00:00:00.00Z';

export default createRestBundle({
  name: 'timeseriesMeasurements',
  uid: 'timeseries_id',
  staleAfter: 10000,
  persist: false,
  routeParam: '',
  getTemplate: `/timeseries/:timeseriesId/measurements?after=${afterDate}&before=${beforeDate}`,
  putTemplate: '',
  postTemplate: '/projects/:projectId/timeseries_measurements',
  deleteTemplate: '/timeseries/:timeseriesId/measurements?time={:item.date}',
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
      timeseriesId,
      dateRange,
    }) => ({ dispatch, store, apiGet }) => {
      dispatch({ type: 'TIMESERIES_FETCH_BY_ID_START', payload: {} });
      const [after, before] = dateRange;

      const isoAfter = after.toISOString();
      const isoBefore = before.toISOString();

      const url = `/timeseries/${timeseriesId}/measurements?after=${isoAfter}&before=${isoBefore}`;
      const flags = store['selectTimeseriesMeasurementsFlags']();
      const itemsById = store['selectTimeseriesMeasurementsItemsObject']();
      let fetchCount = store['selectTimeseriesMeasurementsFetchCount']();

      apiGet(url, (_err, body) => {
        new Array(body).forEach(item => itemsById[item['timeseries_id']] = item);

        dispatch({
          type: 'TIMESERIES_MEASUREMENTS_UPDATED_ITEM',
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

    doUpdateTimeseriesMeasurements: ({ timeseries_id, items, before = beforeDate, after = afterDate }) => ({ dispatch, store, apiPut }) => {
      dispatch({ type: 'TIMESERIES_MEASUREMENT_PUT_START', payload: {} });

      const project = store['selectProjectsIdByRoute']();
      const { projectId } = project;

      const url = `/projects/${projectId}/timeseries_measurements?after=${after}&before=${before}`;
      const flags = store['selectTimeseriesMeasurementsFlags']();
      const itemsById = store['selectTimeseriesMeasurementsItemsObject']();
      let fetchCount = store['selectTimeseriesMeasurementsFetchCount']();

      const formData = {
        timeseries_id,
        items,
      };

      apiPut(url, formData, (_err, body) => {
        new Array(body[0].items).forEach(item => itemsById[item['timeseries_id']] = item);

        dispatch({
          type: 'TIMESERIES_MEASUREMENTS_UPDATED_ITEM',
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
        dispatch({ type: 'TIMESERIES_MEASUREMENT_PUT_FINISHED', payload: {} });
      });
    },
  },

  reduceFurther: (state, { type, payload }) => {
    switch (type) {
      case 'TIMESERIES_MEASUREMENTS_UPDATED_ITEM':
        return Object.assign({}, state, payload);
      default:
        return state;
    }
  },
});
