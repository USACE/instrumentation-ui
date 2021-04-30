import createRestBundle from './create-rest-bundle';
import { createSelector } from 'redux-bundler';

export default createRestBundle({
  name: 'domains',
  uid: 'id',
  prefetch: false,
  staleAfter: 10000,
  persist: false,
  routeParam: 'groupId',
  getTemplate: '/domains',
  putTemplate: '/domains/:item.id',
  postTemplate: '/domains',
  deleteTemplate: '/domains/:item.id',
  fetchActions: [
    'HOME_FETCH_FINISHED',
  ],
  forceFetchActions: [],
  addons: {
    selectDomainsItemsByGroup: createSelector('selectDomainsItems', (items) => {
      if (!items) return null;
      const byGroup = {};
      items.forEach((item) => {
        if (!byGroup.hasOwnProperty(item.group)) byGroup[item.group] = [];
        byGroup[item.group].push(item);
      });
      return byGroup;
    }),
  },
});
