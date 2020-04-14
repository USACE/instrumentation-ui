import createRestBundle from "./create-rest-bundle";
import { createSelector } from "redux-bundler";

export default createRestBundle({
  name: "instrumentGroups",
  uid: "slug",
  prefetch: true,
  staleAfter: 10000,
  persist: false,
  routeParam: "groupSlug",
  getTemplate: "/instrument_groups",
  putTemplate: "/instrument_groups/:item.id",
  postTemplate: "/instrument_groups",
  deleteTemplate: "/instrument_groups/:item.id",
  fetchActions: ["URL_UPDATED", "AUTH_LOGGED_IN"],
  forceFetchActions: [],
  addons: {
    selectInstrumentGroupsIdByRoute: createSelector(
      "selectInstrumentGroupsByRoute",
      (group) => {
        if (group && group.id) return { groupId: group.id };
        return null;
      }
    ),
  },
});
