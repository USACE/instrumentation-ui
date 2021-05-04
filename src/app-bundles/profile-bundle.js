import createRestBundle from './create-rest-bundle';
import { createSelector } from 'redux-bundler';

export default createRestBundle({
  name: 'profile',
  uid: 'id',
  initialFetch: true,
  staleAfter: 0,
  persist: false,
  routeParam: 'id',
  getTemplate: '/my_profile',
  putTemplate: '/profiles/:item.slug',
  postTemplate: '/profiles',
  deleteTemplate: '',
  fetchActions: ['AUTH_LOGGED_IN'],
  forceFetchActions: ['PROFILE_SAVE_FINISHED'],
  addons: {
    selectProfileActive: createSelector(
      'selectProfileItems',
      (profileItems) => {
        if (profileItems.length < 1) return null;
        return profileItems[0];
      }
    ),
    selectProfileId: createSelector('selectProfileActive', (profileActive) => {
      if (!profileActive) return null;
      return {
        profileId: profileActive.id
      };
    }),
    selectProfileIsAdmin: createSelector('selectProfileActive', (profileActive) => {
      if (!profileActive) return null;
      return profileActive.is_admin;
    }),
    selectProfileRoles: createSelector('selectProfileActive', (profileActive) => {
      if (!profileActive) return null;
      return profileActive.roles;
    }),
    reactProfileExists: createSelector(
      'selectAuthIsLoggedIn',
      'selectPathname',
      'selectProfileIsLoading',
      'selectProfileActive',
      (isLoggedIn, path, profileIsLoading, profile) => {
        if (isLoggedIn && !profileIsLoading) {
          if (!profile) {
            if (path !== '/signup')
              return {
                actionCreator: 'doUpdateUrl',
                args: ['/signup'],
              };
          }
        }
      }
    ),
    reactProfileCreatedRedirect: createSelector(
      'selectProfileActive',
      'selectAuthIsLoggedIn',
      'selectPathname',
      (profile, isLoggedIn, path) => {
        if (path === '/signup' && (profile || !isLoggedIn))
          return {
            actionCreator: 'doUpdateUrl',
            args: ['/'],
          };
      }
    ),
  },
});
