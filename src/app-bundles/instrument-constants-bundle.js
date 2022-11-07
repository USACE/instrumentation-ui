import createRestBundle from './create-rest-bundle';

export default createRestBundle({
  name: 'instrumentConstants',
  uid: 'id',
  staleAfter: 10000,
  persist: false,
  routeParam: 'id',
  getTemplate: '/:', // "/:" disables any accidental trigger of a fetch
  putTemplate: '/projects/:projectId/instruments/:instrumentId/constants/{:item.id}',
  postTemplate: '/projects/:projectId/instruments/:instrumentId/constants',
  deleteTemplate: '/projects/:projectId/instruments/:instrumentId/constants/{:item.id}',
  fetchActions: [],
  urlParamSelectors: ['selectProjectsIdByRoute', 'selectInstrumentsIdByRoute'],
});
