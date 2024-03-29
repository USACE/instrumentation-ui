import createRestBundle from './create-rest-bundle';

export default createRestBundle({
  name: 'instrumentNotes',
  uid: 'id',
  staleAfter: 0,
  persist: false,
  routeParam: 'noteId',
  getTemplate: '/instruments/:instrumentId/notes',
  putTemplate: '/instruments/notes/{:item.id}',
  postTemplate: '/instruments/notes',
  deleteTemplate: '/instruments/notes/{:item.id}',
  fetchActions: [],
  forceFetchActions: [
    'INSTRUMENTS_FETCH_FINISHED',
    'INSTRUMENTNOTES_SAVE_FINISHED',
    'INSTRUMENTNOTES_DELETE_FINISHED',
  ],
  urlParamSelectors: ['selectInstrumentsIdByRoute'],
  addons: {},
});
