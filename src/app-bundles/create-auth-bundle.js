import { createSelector } from 'redux-bundler';
import xhr from 'xhr';

const getTokenPart = function (token, part) {
  const splitToken = token.split('.');
  return splitToken[part];
};

const createAuthBundle = (opts) => {
  const defaults = {
    url: 'https://corpsmap-dev.sec.usace.army.mil/cwbi/auth/basic',
    name: 'auth',
    token: null,
    redirectOnLogout: null,
    verifyInterval: 1000 * 60,
  };

  const config = Object.assign({}, defaults, opts);

  if (opts.appId)
    config.url = `https://corpsmap-dev.sec.usace.army.mil/cwbi/goauth/token/${opts.appId}`;

  return {
    name: config.name,

    getReducer: () => {
      const initialState = {
        url: config.url,
        mockToken: config.token,
        token: config.token,
        error: null,
        mock: config.mock,
        shouldVerifyToken: true,
        redirectOnLogout: config.redirectOnLogout,
      };

      return (state = initialState, { type, payload }) => {
        switch (type) {
          case 'AUTH_LOGGED_IN':
          case 'AUTH_LOGGED_OUT':
          case 'AUTH_ERROR':
          case 'AUTH_VERIFY_TOKEN':
            return Object.assign({}, state, payload);
          default:
            return state;
        }
      };
    },

    doAuthLogin: () => ({ dispatch, store }) => {
      const isMock = store.selectAuthIsMocked();
      if (isMock) {
        const token = store.selectAuthTokenMockRaw();
        dispatch({
          type: 'AUTH_LOGGED_IN',
          payload: { token: token, error: null, shouldVerifyToken: true },
        });
      } else {
        const url = store.selectAuthUrl();
        //@todo move to fetch api at some point
        try {
          xhr(url, (err, response, body) => {
            if (err) {
              throw new Error('Login Response not ok');
            } else {
              const token = typeof body === 'string' ? body : JSON.parse(body);
              dispatch({
                type: 'AUTH_LOGGED_IN',
                payload: { token: token, error: null, shouldVerifyToken: true },
              });
            }
          });
        } catch (err) {
          if (process.env.NODE_ENV === 'development') console.error(err);
          dispatch({
            type: 'AUTH_ERROR',
            payload: { msg: 'Error Logging In', err: err },
          });
        }
      }
    },

    doAuthLogout: () => ({ dispatch, store }) => {
      dispatch({
        type: 'AUTH_LOGGED_OUT',
        payload: { token: null, error: null },
      });
      const redirect = store.selectAuthRedirectOnLogout();
      if (redirect) store.doUpdateUrl(redirect);
    },

    doAuthVerifyToken: () => ({ dispatch, store }) => {
      dispatch({
        type: 'AUTH_VERIFY_TOKEN',
        payload: { shouldVerifyToken: false },
      });
      const isExpired = store.selectAuthTokenIsExpired();
      if (isExpired) {
        store.doAuthLogout();
      } else {
        window.setTimeout(store.doAuthVerifyToken, config.verifyInterval);
      }
    },

    selectAuthRedirectOnLogout: (state) => {
      return state.auth.redirectOnLogout;
    },

    selectAuthIsMocked: (state) => state.auth.mock,

    selectAuthUrl: (state) => {
      return state.auth.url;
    },

    // select parts of the token itself

    selectAuthTokenRaw: (state) => {
      return state.auth.token;
    },

    selectAuthTokenMockRaw: (state) => {
      return state.auth.mockToken;
    },

    selectAuthTokenHeader: createSelector('selectAuthTokenRaw', (token) => {
      if (!token) return {};
      return JSON.parse(window.atob(getTokenPart(token, 0)));
    }),

    selectAuthTokenPayload: createSelector('selectAuthTokenRaw', (token) => {
      if (!token) return {};
      return JSON.parse(window.atob(getTokenPart(token, 1)));
    }),

    // select info about token expiration

    selectAuthTokenExp: createSelector('selectAuthTokenPayload', (payload) => {
      if (!payload.hasOwnProperty('exp')) return null;
      return payload.exp;
    }),

    selectAuthTokenIsExpired: createSelector('selectAuthTokenExp', (exp) => {
      if (!exp) return true;
      return exp < Math.floor(Date.now() / 1000);
    }),

    // select parts of the payload

    selectAuthUsername: createSelector('selectAuthTokenPayload', (payload) => {
      if (!payload.hasOwnProperty('name')) return null;
      return payload.name;
    }),

    selectAuthEdipi: createSelector('selectAuthTokenPayload', (payload) => {
      if (!payload.hasOwnProperty('sub')) return null;
      return payload.sub;
    }),

    selectAuthRoles: createSelector('selectAuthTokenPayload', (payload) => {
      if (!payload.hasOwnProperty('roles')) return [];
      return payload.roles;
    }),

    selectAuthGroups: createSelector('selectAuthRoles', (roles) => {
      return roles.map((role) => {
        const roleArr = role.split('.');
        return roleArr[0];
      });
    }),

    selectAuthGroupRoles: createSelector('selectAuthRoles', (roles) => {
      const groupRoles = {};
      roles
        .map((role) => role.split('.'))
        .forEach((role) => {
          if (!groupRoles.hasOwnProperty(role[0])) groupRoles[role[0]] = [];
          groupRoles[role[0]].push(role[1]);
        });
      return groupRoles;
    }),

    selectAuthIsLoggedIn: (state) => {
      return !!state.auth.token;
    },

    reactAuthShouldVerifyToken: (state) => {
      if (state.auth.shouldVerifyToken)
        return { actionCreator: 'doAuthVerifyToken' };
    },

    persistActions: ['AUTH_LOGGED_IN', 'AUTH_LOGGED_OUT'],
  };
};

export default createAuthBundle;
