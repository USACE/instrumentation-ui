import createRestBundle from './create-rest-bundle';

export default createRestBundle({
  name: 'instrumentFormulas',
  uid: 'id',
  staleAfter: 0,
  persist: false,
  getTemplate: '/calculations/:instrumentId',
  putTemplate: '/calculations/{:item.id}',
  postTemplate: '/calculations',
  deleteTemplate: '/calculations/{:item.id}',
  fetchActions: [],
  forceFetchActions: [
    'INSTRUMENTS_FETCH_FINISHED',
    'INSTRUMENTFORMULAS_SAVE_FINISHED',
    'INSTRUMENTFORMULAS_DELETE_FINISHED',
  ],
  urlParamSelectors: ['selectInstrumentsIdByRoute'],
});
