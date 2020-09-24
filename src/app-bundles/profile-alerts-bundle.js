import createRestBundle from "./create-rest-bundle";
import { createSelector } from "redux-bundler";

export default createRestBundle({
  name: "profileAlerts",
  uid: "id",
  prefetch: true,
  staleAfter: 1,
  persist: false,
  getTemplate: "/instrumentation/my_alert_subscriptions",
  deleteTemplate: "",
  fetchActions: ["AUTH_LOGGED_IN"],
  forceFetchActions: [],
  addons: {
    selectProfileAlerts: createSelector(
      "selectProfileAlertsItems",
      (alerts) => {
        console.log("alerts from bundle:", alerts);
        return alerts || [];
      }
    ),
  },
});
