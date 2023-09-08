import createRestBundle from './create-rest-bundle';

export default createRestBundle({
  name: 'collectionGroupDetail',
  uid: 'slug',
  staleAfter: 10000,
  persist: false,
  sortBy: 'name',
  routeParam: 'collectionGroupSlug',
  getTemplate: '/projects/:projectId/collection_groups/:collectionGroupId',
  putTemplate: '/collection_groups/:collectionGroupId/timeseries',
  postTemplate: '/projects/:projectId/collection_groups',
  deleteTemplate: '/projects/:projectId/collection_groups/{:item.id}',
  fetchActions: [],
  forceFetchActions: [
    'COLLECTIONGROUP_FETCH_FINISHED',
    'COLLECTIONGROUP_SAVE_FINISHED',
    'COLLECTIONGROUP_DELETE_FINISHED',
    'COLLECTIONGROUP_ADD_TIMESERIES_FINISH',
    'COLLECTIONGROUP_REMOVE_TIMESERIES_FINISH',
    'TIMESERIESMEASUREMENTS_SAVE_FINISHED',
  ],
  urlParamSelectors: [
    'selectProjectsIdByRoute',
    'selectCollectionGroupIdByRoute',
  ],
  addons: {
    doCollectionGroupDetailsTimeseriesUpdate: ({ id, timeseries }) => ({ dispatch, apiPut }) => {
      dispatch({
        type: 'COLLECTIONGROUPDETAILS_UPDATE_TIMESERIES_START',
        payload: {},
      });
      const url = `/collection_groups/${id}/timeseries`;

      const formData = {
        id,
        timeseries,
      };

      apiPut(url, formData, () => {
        dispatch({
          type: 'COLLECTIONGROUPDETAILS_UPDATE_TIMESERIES_FINISH',
          payload: {},
        });
      });
    },
  },
});
