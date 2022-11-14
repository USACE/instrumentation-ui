import createRestBundle from './create-rest-bundle';

export default createRestBundle({
  name: 'instrumentFormulas',
  uid: 'id',
  staleAfter: 0,
  persist: false,
  routeParam: 'formulaId',
  getTemplate: '/formulas?instrument_id={:instrumentId}',
  putTemplate: '/formulas/{:item.id}',
  postTemplate: '/formulas',
  deleteTemplate: '/formulas/{:item.id}',
  fetchActions: [],
  forceFetchActions: [
    'INSTRUMENTS_FETCH_FINISHED',
    'INSTRUMENTFORMULAS_SAVE_FINISHED',
    'INSTRUMENTFORMULAS_DELETE_FINISHED',
  ],
  urlParamSelectors: ['selectInstrumentsIdByRoute'],
});
