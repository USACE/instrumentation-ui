import createRestBundle from './create-rest-bundle';
import { createSelector } from 'redux-bundler';

export default createRestBundle({
  name: 'projectDataLoggers',
  uid: 'id',
  staleAfter: 0,
  persist: false,
  routeParam: 'id',
  getTemplate: '',
  putTemplate: '',
  postTemplate: '',
  deleteTemplate: '',
  fetchActions: [],
  forceFetchActions: [],
  urlParamSelectors: ['selectProjectsIdByRoute'],
});
