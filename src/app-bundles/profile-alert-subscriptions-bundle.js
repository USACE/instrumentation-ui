import createRestBundle from "./create-rest-bundle";
import { createSelector } from "redux-bundler";

export default createRestBundle({
  name: "profileAlertSubscriptions",
  uid: null,
  prefetch: false,
  staleAfter: 0,
  persist: false,
  getTemplate: "/my_alert_subscriptions",
  putTemplate: "/alert_subscriptions/:item.id",
  fetchActions: ["AUTH_LOGGED_IN", "PROFILE_FETCH_FINISHED"],
  forceFetchActions: [],
  addons: {
    selectProfileAlertSubscriptions: createSelector(
      "selectProfileAlertSubscriptionsItems",
      (subscriptions) => {
        return subscriptions || [];
      }
    ),
  },
});
