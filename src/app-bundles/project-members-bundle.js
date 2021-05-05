import createRestBundle from './create-rest-bundle';

export default createRestBundle({
  name: 'projectMembers',
  uid: 'profile_id',
  sortBy: 'username',
  staleAfter: 0,
  persist: false,
  getTemplate: '/projects/:projectId/members',
  urlParamSelectors: ['selectProjectsIdByRoute', 'selectProfileId'],
  fetchActions: ['URL_UPDATED', 'PROJECTS_FETCH_FINISHED'],
  forceFetchActions: [
    'PROJECTMEMBERS_ADD_USER_FINISHED',
    'PROJECTMEMBERS_DELETE_USER_FINISHED',
  ],
  prefetch: (store) => {
    const hash = store.selectHash();
    const whiteList = ['admin'];

    return whiteList.includes(hash);
  },
});
