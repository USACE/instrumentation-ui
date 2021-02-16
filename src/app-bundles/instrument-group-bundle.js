import createRestBundle from './create-rest-bundle';
import { createSelector } from 'redux-bundler';

export default createRestBundle({
  name: 'instrumentGroups',
  uid: 'slug',
  sortBy: 'slug',
  prefetch: true,
  staleAfter: 10000,
  persist: false,
  routeParam: 'groupSlug',
  getTemplate: '/projects/:projectId/instrument_groups',
  putTemplate: '/instrument_groups/:item.id',
  postTemplate: '/instrument_groups',
  deleteTemplate: '/instrument_groups/:item.id',
  fetchActions: ['URL_UPDATED', 'AUTH_LOGGED_IN', 'PROJECTS_FETCH_FINISHED'],
  forceFetchActions: [
    'INSTRUMENTGROUPS_SAVE_FINISHED',
    'INSTRUMENTGROUPS_DELETE_FINISHED',
  ],
  urlParamSelectors: ['selectProjectsIdByRoute'],
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
