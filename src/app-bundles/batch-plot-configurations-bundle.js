import createRestBundle from './create-rest-bundle';
// import { createSelector } from 'redux-bundler';

export default createRestBundle({
  name: 'batchPlotConfigurations',
  uid: 'id',
  prefetch: false,
  staleAfter: 10000,
  persist: false,
  getTemplate: '/projects/:projectId/plot_configurations',
  putTemplate: '/projects/:projectId/plot_configurations/:item.id',
  postTemplate: '/projects/:projectId/plot_configurations',
  deleteTemplate: '/projects/:projectId/plot_configurations/:item.id',
  fetchActions: ['URL_UPDATED'],
  urlParamSelectors: ['selectProjectsIdByRoute'],
});
