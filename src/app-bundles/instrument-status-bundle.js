import createRestBundle from './create-rest-bundle';

export default createRestBundle({
  name: 'instrumentStatus',
  uid: 'id',
  staleAfter: 0,
  persist: false,
  routeParam: 'statusSlug',
  getTemplate: '/instruments/:instrumentId/status',
  putTemplate: '',
  postTemplate: '/instruments/:item.instrument_id/status',
  deleteTemplate: '',
  fetchActions: [],
  urlParamSelectors: ['selectInstrumentsIdByRoute'],
  forceFetchActions: [
    'INSTRUMENTS_FETCH_FINISHED',
    'INSTRUMENTS_SAVE_FINISHED',
    'INSTRUMENTSTATUS_SAVE_FINISHED',
  ],
});
