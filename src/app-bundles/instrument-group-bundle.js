import createRestBundle from './create-rest-bundle';
import { createSelector } from 'redux-bundler';

export default createRestBundle({
  name: 'instrumentGroups',
  uid: 'slug',
  sortBy: 'slug',
  staleAfter: 0,
  persist: false,
  routeParam: 'groupSlug',
  getTemplate: '/projects/:projectId/instrument_groups',
  putTemplate: '/instrument_groups/:item.id',
  postTemplate: '/instrument_groups',
  deleteTemplate: '/instrument_groups/:item.id',
  fetchActions: [
    'URL_UPDATED',
    'PROJECTS_FETCH_FINISHED',
  ],
  forceFetchActions: [
    'INSTRUMENTGROUPS_SAVE_FINISHED',
    'INSTRUMENTGROUPS_DELETE_FINISHED',
  ],
  urlParamSelectors: ['selectProjectsIdByRoute'],
  prefetch: (store) => {
    const hash = store.selectHash();
    const url = store.selectUrlObject();
    const whiteList = ['dashboard'];

    return whiteList.includes(hash) || url.pathname.includes('/groups/');
  },
  addons: {
    selectInstrumentGroupsIdByRoute: createSelector(
      'selectInstrumentGroupsByRoute',
      (group) => {
        if (group && group.id) return { groupId: group.id };
        return null;
      }
    ),
    selectInstrumentGroupsItemsObjectById: createSelector(
      'selectInstrumentGroupsState',
      (state) => {
        const items = {};
        Object.keys(state).forEach((key) => {
          if (key[0] !== '_') items[state[key].id] = state[key];
        });
        return items;
      }
    ),
  },
});
