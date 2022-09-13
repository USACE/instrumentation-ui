import createRestBundle from './create-rest-bundle';

export default createRestBundle({
  name: 'inclinometerMeasurements',
  uid: 'timeseries_id',
  staleAfter: 10000,
  persist: false,
  routeParam: '',
  getTemplate: '/timeseries/:timeseriesId/inclinometer_measurements?before={:item.before}&after={:item.after}',
  putTemplate: '',
  postTemplate: '',
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
    const url = store.selectUrlObject();

    const whitelist = [];
    const pathnameWhitelist = ['/instruments/', '/groups/', '/collection-groups/'];

    return whitelist.includes(hash) || pathnameWhitelist.some(elem => url.pathname.includes(elem));
  },
});
