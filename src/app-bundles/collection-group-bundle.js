import createRestBundle from './create-rest-bundle';
import { createSelector } from 'redux-bundler';

export default createRestBundle({
  name: 'collectionGroup',
  uid: 'slug',
  staleAfter: 0,
  persist: false,
  sortBy: 'name',
  routeParam: 'collectionGroupSlug',
  getTemplate: '/projects/:projectId/collection_groups',
  putTemplate: '/projects/:projectId/collection_groups/:item.id',
  postTemplate: '/projects/:projectId/collection_groups',
  deleteTemplate: '/projects/:projectId/collection_groups/:item.id',
  fetchActions: ['URL_UPDATED', 'PROJECTS_FETCH_FINISHED'],
  forceFetchActions: [
    'COLLECTIONGROUP_SAVE_FINISHED',
    'COLLECTIONGROUP_DELETE_FINISHED',
  ],
  urlParamSelectors: ['selectProjectsIdByRoute'],
  prefetch: (store) => {
    const hash = store.selectHash();
    const url = store.selectUrlObject();
    const whiteList = ['dashboard'];

    return (
      whiteList.includes(hash) || url.pathname.includes('/collection-groups/')
    );
  },
  addons: {
    selectCollectionGroupIdByRoute: createSelector(
      'selectCollectionGroupByRoute',
      (cg) => {
        if (cg && cg.id) return { collectionGroupId: cg.id };
      }
    ),
    doCollectionGroupRemoveTimeseries:
      ({ projectId, collectionGroupId, timeseriesId }) =>
      ({ dispatch, apiDelete }) => {
        dispatch({
          type: 'COLLECTIONGROUP_REMOVE_TIMESERIES_START',
          payload: {},
        });
        const url = `/projects/${projectId}/collection_groups/${collectionGroupId}/timeseries/${timeseriesId}`;
        apiDelete(url, (_err, _body) => {
          dispatch({
            type: 'COLLECTIONGROUP_REMOVE_TIMESERIES_FINISH',
            payload: {},
          });
        });
      },
    doCollectionGroupAddTimeseries:
      ({ projectId, collectionGroupId, timeseriesId }) =>
      ({ dispatch, apiPost }) => {
        dispatch({
          type: 'COLLECTIONGROUP_ADD_TIMESERIES_START',
          payload: {},
        });
        const url = `/projects/${projectId}/collection_groups/${collectionGroupId}/timeseries/${timeseriesId}`;
        apiPost(url, {}, (_err, _body) => {
          dispatch({
            type: 'COLLECTIONGROUP_ADD_TIMESERIES_FINISH',
            payload: {},
          });
        });
      },
  },

  reduceFurther: (state, { type, payload }) => {
    switch (type) {
      case 'COLLECTIONGROUP_REMOVE_TIMESERIES_START':
      case 'COLLECTIONGROUP_REMOVE_TIMESERIES_FINISH':
        return Object.assign({}, state, payload);
      default:
        return state;
    }
  },
});
