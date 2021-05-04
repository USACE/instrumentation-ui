import createRestBundle from './create-rest-bundle';

export default createRestBundle({
  name: 'projectMembers',
  uid: 'id',
  staleAfter: 0,
  persist: false,
  getTemplate: '/projects/:projectId/members',
  postTemplate: '/projects/:project_id/members/:profile_id/roles/:role_id',
  deleteTemplate: '/projects/:project_id/members/:profile_id/roles/:role_id',
  urlParamSelectors: ['selectProjectsIdByRoute'],
  fetchActions: ['URL_UPDATED'],
  forceFetchActions: [
    'PROJECTMEMBERS_SAVE_FINISHED',
    'PROJECTMEMBERS_DELETE_FINISHED',
  ],
  prefetch: (store) => {
    const hash = store.selectHash();
    const whiteList = ['admin'];

    return whiteList.includes(hash);
  },
});
