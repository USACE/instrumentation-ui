import createRestBundle from "./create-rest-bundle";

export default createRestBundle({
  name: "collectionGroupDetail",
  uid: "slug",
  prefetch: true,
  staleAfter: 10000,
  persist: false,
  sortBy: "name",
  routeParam: "collectionGroupSlug",
  getTemplate: "/projects/:projectId/collection_groups/:collectionGroupId",
  putTemplate: "/:",
  postTemplate: "/projects/:projectId/collection_groups",
  deleteTemplate: "/projects/:projectId/collection_groups/:item.id",
  fetchActions: ["URL_UPDATED", "PROJECTS_FETCH_FINISHED"],
  forceFetchActions: [
    "COLLECTIONGROUP_FETCH_FINISHED",
    "COLLECTIONGROUP_SAVE_FINISHED",
    "COLLECTIONGROUP_DELETE_FINISHED",
    "COLLECTIONGROUP_ADD_TIMESERIES_FINISH",
    "COLLECTIONGROUP_REMOVE_TIMESERIES_FINISH",
    "TIMESERIESMEASUREMENTS_SAVE_FINISHED",
  ],
  urlParamSelectors: [
    "selectProjectsIdByRoute",
    "selectCollectionGroupIdByRoute",
  ],
  addons: {},
});
