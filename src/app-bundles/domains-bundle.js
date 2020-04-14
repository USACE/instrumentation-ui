import createRestBundle from "./create-rest-bundle";
import { createSelector } from "redux-bundler";

export default createRestBundle({
  name: "domains",
  uid: "id",
  prefetch: true,
  staleAfter: 10000,
  persist: false,
  routeParam: "groupId",
  getTemplate: "/domains",
  putTemplate: "/domains/:item.id",
  postTemplate: "/domains",
  deleteTemplate: "/domains/:item.id",
  fetchActions: ["URL_UPDATED", "AUTH_LOGGED_IN"],
  forceFetchActions: [],
  addons: {
    selectDomainsItemsByGroup: createSelector("selectDomainsItems", (items) => {
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
