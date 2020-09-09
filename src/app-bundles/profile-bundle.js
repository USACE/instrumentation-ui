import createRestBundle from "./create-rest-bundle";
import { createSelector } from "redux-bundler";

export default createRestBundle({
  name: "profile",
  uid: "id",
  prefetch: true,
  staleAfter: 900000,
  persist: false,
  routeParam: "profileSlug",
  getTemplate: "/profile",
  putTemplate: "/profile/:item.slug",
  postTemplate: "/profile",
  deleteTemplate: "",
  fetchActions: ["AUTH_LOGGED_IN"],
  forceFetchActions: ["PROFILE_SAVE_FINISHED"],
  addons: {
    selectProfileActive: createSelector(
      "selectProfileItems",
      (profileItems) => {
        if (profileItems.length < 1) return null;
        return profileItems[0];
      }
    ),
    selectProfileId: createSelector("selectProfileActive", (profileActive) => {
      if (!profileActive) return null;
      return profileActive.id;
    }),
    reactProfileExists: createSelector(
      "selectAuthIsLoggedIn",
      "selectPathnameMinusHomepage",
      "selectProfileActive",
      (isLoggedIn, path, profile) => {
        if (isLoggedIn) {
          if (!profile) {
            if (path !== "/signup")
              return {
                actionCreator: "doUpdateUrlWithHomepage",
                args: ["/signup"],
              };
          }
        }
      }
    ),
  },
});
