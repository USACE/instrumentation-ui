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
  putTemplate: '/profiles/{:item.slug}',
  postTemplate: '/profiles',
  deleteTemplate: '',
  fetchActions: ['AUTH_LOGGED_IN'],
  forceFetchActions: ['PROFILE_SAVE_FINISHED'],
  reduceFurther: (state, { type, payload }) => {
    switch (type) {
      case 'PROFILE_REMOVE_PROFILE':
        return Object.assign({}, payload);
      default:
        return state;
    }
  },
  addons: {
    doRemoveProfile: () => ({ dispatch, store }) => {
      dispatch({
        type: 'PROFILE_REMOVE_PROFILE',
        payload: store.selectProfileFlags(),
      });
    },
    selectProfileRaw: state => state.profile,
    selectProfileFlags: createSelector('selectProfileRaw', profile => {
      const profileClone = Object.assign({}, profile);
      Object.keys(profileClone).forEach((key) => {
        if (key[0] !== '_') delete profileClone[key];
      });
      return profileClone;
    }),
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
    selectProfileRolesObject: createSelector('selectProfileRoles', (profileRoles) => {
      if (!profileRoles) return null;
      return profileRoles.reduce((accum, elem) => {
        const groupRole = elem.split('.');
        const group = groupRole[0];
        const role = groupRole[1];
    
        return {
          ...accum,
          [group]: (accum[group] || []).concat([role]),
        };
      }, {});
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
