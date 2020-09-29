import createRestBundle from "./create-rest-bundle";
import { createSelector } from "redux-bundler";

export default createRestBundle({
  name: "profileAlerts",
  uid: null,
  prefetch: false,
  staleAfter: 0,
  persist: false,
  getTemplate: "/my_alerts",
  fetchActions: ["URL_UPDATED", "AUTH_LOGGED_IN", "PROFILE_FETCH_FINISHED"],
  forceFetchActions: ["ALERTREAD_SAVE_FINISHED", "ALERTUNREAD_SAVE_FINISHED"],
  addons: {
    selectProfileAlerts: createSelector(
      "selectProfileAlertsItems",
      (alerts) => {
        return alerts || [];
      }
    ),

    selectProfileAlertsByInstrumentId: createSelector(
      "selectProfileAlertsItems",
      "selectInstrumentsByRoute",
      (alerts, instruments) => {
        if (!alerts || !instruments) return [];

        return alerts.filter(item => item.instrument_id === instruments.id);
      }
    )
  },
});
