import createRestBundle from "./create-rest-bundle";
import { createSelector } from "redux-bundler";

export default createRestBundle({
  name: "profile",
  uid: "id",
  prefetch: true,
  staleAfter: 900000,
  persist: false,
  routeParam: "id",
  getTemplate: "/my_profile",
  putTemplate: "/profiles/:item.slug",
  postTemplate: "/profiles",
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
      "selectProfileIsLoading",
      (isLoggedIn, path, profileIsLoading, profile) => {
        if (isLoggedIn && !profileIsLoading) {
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
    reactProfileCreatedRedirect: createSelector(
      "selectProfileActive",
      "selectAuthIsLoggedIn",
      "selectPathnameMinusHomepage",
      (profile, isLoggedIn, path) => {
        if (path === "/signup" && (profile || !isLoggedIn))
          return {
            actionCreator: "doUpdateUrlWithHomepage",
            args: ["/"],
          };
      }
    ),
  },
});
