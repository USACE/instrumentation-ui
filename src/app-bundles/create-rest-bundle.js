import { createSelector } from "redux-bundler";

/**
 * Replace any :item.* values in the url with the actual value from the item
 */
const decorateUrlWithItem = (urlTemplate, item) => {
  const regex = /(:.*?)(\/|$)/gi;
  let url = urlTemplate;
  let m;
  while ((m = regex.exec(urlTemplate)) != null) {
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    const param = m[1];
    if (param.indexOf("item") !== -1) {
      const key = param.split(".")[1];
      url = url.replace(param, item[key]);
    }
  }
  return url;
};

/**
 * Check to see if a particular token part exists against a given value
 */
function checkTokenPart(tokenRoles, val, idx) {
  let match = false;
  tokenRoles.forEach((tokenRole) => {
    const tokenPart = tokenRole.split(".")[idx];
    if (tokenPart === val) match = true;
  });
  return match;
}

/**
 * Check one array of roles against another array of roles accounting
 * for wildcards and org substitution
 */
function checkRoles(roles, tokenRolesJoined, orgsActiveSlug) {
  let pass = false;
  for (let i = 0; i < roles.length; i++) {
    let role = roles[i];
    role = role.replace(
      `:ORG.`,
      `${orgsActiveSlug ? orgsActiveSlug.toUpperCase() : ""}.`
    );

    // let super users through no matter what
    if (tokenRolesJoined.indexOf("APP.SYSADMIN") !== -1) {
      pass = true;
      break;
    }

    // first let's test if this role is in tokenRoles, if so, pass and move on
    if (tokenRolesJoined.indexOf(role) !== -1) {
      pass = true;
      break;
    }

    // ok, let's check to see if we have a wildcard
    if (role.indexOf("*") !== -1) {
      // if both parts are * then pass is true
      if (role === "*.*") {
        pass = true;
        break;
      }

      // otherwise we've got to check both parts separately
      const parts = role.split(".");

      // looks like we do, is it in the org position?
      if (parts[0] === "*") {
        // if so, check tokenRoles for the role
        if (checkTokenPart(tokenRolesJoined, parts[1], 1)) pass = true;
        if (pass) break;
      }

      // how about the role position?
      if (parts[1] === "*") {
        if (checkTokenPart(tokenRolesJoined, parts[0], 0)) pass = true;
        if (pass) break;
      }
    }
  }
  return pass;
}

/**
 * Main Bundle Creator export
 */
export default (opts) => {
  const defaults = {
    name: null,
    uid: "id",
    lastFetch: new Date(),
    staleAfter: 0, // always stale
    persist: false,
    prefetch: false,
    routeParam: null,
    getTemplate: "/",
    putTemplate: "/",
    postTemplate: "/",
    deleteTemplate: "/",
    fetchActions: [],
    forceFetchActions: [],
    urlParamSelectors: [],
    allowRoles: ["*.*"],
    disallowRoles: [],
    addons: {},
    reduceFurther: null,
    pageSize: 25,
  };

  const config = Object.assign({}, defaults, opts);

  const uCaseName = config.name.charAt(0).toUpperCase() + config.name.slice(1);
  const baseType = config.name.toUpperCase();

  // actions
  const actions = {
    ADDON_ACTION: `${baseType}_ADDON_ACTION`,
    FETCH_STARTED: `${baseType}_FETCH_STARTED`,
    FETCH_FINISHED: `${baseType}_FETCH_FINISHED`,
    FETCH_ABORT: `${baseType}_FETCH_ABORT`,
    SAVE_STARTED: `${baseType}_SAVE_STARTED`,
    SAVE_FINISHED: `${baseType}_SAVE_FINISHED`,
    DELETE_STARTED: `${baseType}_DELETE_STARTED`,
    DELETE_FINISHED: `${baseType}_DELETE_FINISHED`,
    UPDATED_ITEM: `${baseType}_UPDATED_ITEM`,
    PAGE_SIZE_UPDATED: `${baseType}_PAGE_SIZE_UPDATED`,
    ERROR: `${baseType}_ERROR`,
  };

  // action creators
  const doFetch = `do${uCaseName}Fetch`;
  const doSave = `do${uCaseName}Save`;
  const doDelete = `do${uCaseName}Delete`;
  const doUpdatePageSize = `do${uCaseName}UpdatePageSize`;

  // selectors
  const selectState = `select${uCaseName}State`;
  const selectFlags = `select${uCaseName}Flags`;
  const selectGetTemplate = `select${uCaseName}GetTemplate`;
  const selectPutTemplate = `select${uCaseName}PutTemplate`;
  const selectPostTemplate = `select${uCaseName}PostTemplate`;
  const selectDeleteTemplate = `select${uCaseName}DeleteTemplate`;
  const selectGetUrl = `select${uCaseName}GetUrl`;
  const selectPutUrl = `select${uCaseName}PutUrl`;
  const selectPostUrl = `select${uCaseName}PostUrl`;
  const selectDeleteUrl = `select${uCaseName}DeleteUrl`;
  const selectItemsPaged = `select${uCaseName}ItemsPaged`;
  const selectItemsObject = `select${uCaseName}ItemsObject`;
  const selectItemsArray = `select${uCaseName}ItemsArray`;
  const selectItems = `select${uCaseName}Items`;
  const selectByRoute = `select${uCaseName}ByRoute`;
  const selectIsLoading = `select${uCaseName}IsLoading`;
  const selectIsSaving = `select${uCaseName}IsSaving`;
  const selectFetchCount = `select${uCaseName}FetchCount`;
  const selectLastFetch = `select${uCaseName}LastFetch`;
  const selectIsStale = `select${uCaseName}IsStale`;
  const selectLastResource = `select${uCaseName}LastResource`;
  const selectForceFetch = `select${uCaseName}ForceFetch`;
  const selectAbortReason = `select${uCaseName}AbortReason`;
  const selectAllowRoles = `select${uCaseName}AllowRoles`;
  const selectIsAllowedRole = `select${uCaseName}IsAllowedRole`;
  const selectDisallowRoles = `select${uCaseName}DisallowRoles`;
  const selectIsDisallowedRole = `select${uCaseName}IsDisallowedRole`;
  const selectPageSize = `select${uCaseName}PageSize`;

  // reactors
  const reactShouldFetch = `react${uCaseName}ShouldFetch`;

  // request Objects so that we can abort?
  let fetchReq = null;

  const result = Object.assign(
    {},
    {
      name: config.name,

      getReducer: () => {
        const initialData = {
          _err: null,
          _isSaving: false,
          _isLoading: false,
          _shouldFetch: config.prefetch,
          _forceFetch: false,
          _fetchCount: 0,
          _lastFetch: config.lastFetch,
          _lastResource: null,
          _abortReason: null,
          _allowRoles: config.allowRoles,
          _disallowRoles: config.disallowRoles,
          _pageSize: config.pageSize,
        };

        return (state = initialData, { type, payload }) => {
          if (config.fetchActions.indexOf(type) !== -1) {
            return Object.assign({}, state, {
              _shouldFetch: true,
              _forceFetch: false,
            });
          }

          if (config.forceFetchActions) {
            if (config.forceFetchActions.indexOf(type) !== -1) {
              return Object.assign({}, state, {
                _shouldFetch: true,
                _forceFetch: true,
              });
            }
          }

          switch (type) {
            case actions.ADDON_ACTION:
            case actions.SAVE_STARTED:
            case actions.SAVE_FINISHED:
            case actions.FETCH_STARTED:
            case actions.FETCH_ABORT:
            case actions.DELETE_STARTED:
            case actions.DELETE_FINISHED:
            case actions.PAGE_SIZE_UPDATED:
            case actions.ERROR:
              return Object.assign({}, state, payload);
            case actions.FETCH_FINISHED:
            case actions.UPDATED_ITEM:
              return Object.assign({}, payload);
            default:
              if (
                config.reduceFurther &&
                typeof config.reduceFurther === "function"
              ) {
                return config.reduceFurther(state, { type, payload });
              } else {
                return state;
              }
          }
        };
      },

      [doFetch]: () => ({ dispatch, store, apiGet }) => {
        dispatch({
          type: actions.FETCH_STARTED,
          payload: {
            _shouldFetch: false,
            _isLoading: true,
          },
        });

        const isAllowed = store[selectIsAllowedRole]();
        const isDisallowed = store[selectIsDisallowedRole]();
        if (!isAllowed || isDisallowed) {
          dispatch({
            type: actions.FETCH_ABORT,
            payload: {
              _isLoading: false,
              _abortReason: `User is not allowed to run this query`,
            },
          });
          return;
        }

        const url = store[selectGetUrl]();
        let fetchCount = store[selectFetchCount]();
        const isStale = store[selectIsStale]();
        const lastResource = store[selectLastResource]();
        const forceFetch = store[selectForceFetch]();
        const flags = store[selectFlags]();

        if (url.indexOf("/:") !== -1) {
          // if we haven't filled in all of our params then bail
          dispatch({
            type: actions.FETCH_ABORT,
            payload: {
              _isLoading: false,
              _lastResource: url,
              _abortReason: `don't have all the params we need`,
            },
          });

          // if this is a new request, but the url isnt up to date, clear the items,
          // this way they can be garbage collected and it prevents leakage
          // the way this dispatch works it's overriding the payload of the FETCH_ABORT above
          // so for now we're sending this data twice, once so that the abort can be seen
          // and once to set the state in the store
          dispatch({
            type: actions.UPDATED_ITEM,
            payload: {
              ...flags,
              ...{
                _isLoading: false,
                _lastResource: url,
                _abortReason: `don't have all the params we need`,
              },
            },
          });
          return;
        } else if (!isStale && url === lastResource && !forceFetch) {
          // if we're not stale and we're trying the same resource, then bail
          // but if force is true then keep going no matter what
          dispatch({
            type: actions.FETCH_ABORT,
            payload: {
              _isLoading: false,
              _abortReason: `we're not stale enough`,
            },
          });
          return;
        } else {
          if (fetchReq) fetchReq.abort();
          fetchReq = null;
          fetchReq = apiGet(url, (err, response, body) => {
            if (err || response.statusCode !== 200) {
              dispatch({
                type: actions.ERROR,
                payload: {
                  _err: { err: err, response: response },
                  notification: {
                    statusCode: response.statusCode,
                  },
                  _isLoading: false,
                  _isSaving: false,
                  _fetchCount: ++fetchCount,
                  _lastResource: url,
                  _abortReason: null,
                },
              });
            } else {
              const data = JSON.parse(body);
              const itemsById = {};
              data.forEach((item) => {
                itemsById[item[config.uid]] = item;
              });
              dispatch({
                type: actions.FETCH_FINISHED,
                payload: {
                  ...itemsById,
                  ...flags,
                  ...{
                    _isLoading: false,
                    _isSaving: false,
                    _fetchCount: ++fetchCount,
                    _lastFetch: new Date(),
                    _lastResource: url,
                    _abortReason: null,
                  },
                },
              });
            }
          });
        }
      },

      [doSave]: (item, callback, deferCallback) => ({
        dispatch,
        store,
        apiPut,
        apiPost,
      }) => {
        dispatch({
          type: actions.SAVE_STARTED,
          payload: {
            _isSaving: true,
          },
        });

        // grab the state object
        const tempState = store[selectState]();

        if (!item[config.uid]) {
          const url = decorateUrlWithItem(store[selectPostUrl](), item);

          // create a temporary id and store it in state using that as the key
          const tempId = Number(new Date()).toString();
          tempState[tempId] = Object.assign({}, item);
          dispatch({
            type: actions.UPDATED_ITEM,
            payload: tempState,
          });

          apiPost(url, item, (err, response, body) => {
            if (err || response.statusCode !== 200) {
              dispatch({
                type: actions.ERROR,
                payload: {
                  _err: { err: err, response: response },
                  notification: {
                    statusCode: response.statusCode,
                  },
                  _isSaving: false,
                },
              });
            } else {
              // remove our temporary record from the state
              const updatedState = store[selectState]();
              delete updatedState[tempId];

              // add our new id to our item and re-attach to our state
              const data =
                typeof body === "string" ? JSON.parse(body)[0] : body[0];
              const updatedItem = Object.assign({}, item, data);
              updatedState[updatedItem[config.uid]] = updatedItem;

              dispatch({
                type: actions.UPDATED_ITEM,
                payload: updatedState,
              });

              // Make sure we're sending save_finished when we're done
              dispatch({
                type: actions.SAVE_FINISHED,
                payload: {
                  _isSaving: false,
                },
              });

              if (deferCallback && callback) callback();
            }
          });
          // if we get a callback, go ahead and fire it
          if (!deferCallback && callback) callback();
        } else {
          const url = decorateUrlWithItem(store[selectPutUrl](), item);

          // add our updated item to the state based on it's key
          tempState[item[config.uid]] = Object.assign({}, item);
          dispatch({
            type: actions.UPDATED_ITEM,
            payload: tempState,
          });

          // save changes to the server
          apiPut(url, item, (err, response, body) => {
            if (err || response.statusCode !== 200) {
              dispatch({
                type: actions.ERROR,
                payload: {
                  _err: { err: err, response: response },
                  notification: {
                    statusCode: response.statusCode,
                  },
                  _isSaving: false,
                },
              });
            } else {
              // if successful we shouldn't have to do anything else
              dispatch({
                type: actions.SAVE_FINISHED,
                payload: {
                  _isSaving: false,
                },
              });
              if (deferCallback && callback) callback();
            }
          });
          // if we get a callback, go ahead and fire it
          if (!deferCallback && callback) callback();
        }
      },

      [doDelete]: (item, callback, deferCallback) => ({
        dispatch,
        store,
        apiDelete,
      }) => {
        dispatch({
          type: actions.DELETE_STARTED,
          payload: {
            _isSaving: true,
          },
        });

        const url = decorateUrlWithItem(store[selectDeleteUrl](), item);

        if (url.indexOf("/:") !== -1) {
          // if we haven't filled in all of our params then bail
          return;
        } else {
          // remove the item from our state and update it internally
          const updatedState = store[selectState]();
          delete updatedState[item[config.uid]];
          dispatch({
            type: actions.UPDATED_ITEM,
            payload: updatedState,
          });

          // update the state on the server now
          apiDelete(url, null, (err, response, body) => {
            if (err || response.statusCode !== 200) {
              dispatch({
                type: actions.ERROR,
                payload: {
                  _err: { err: err, response: response },
                  notification: {
                    statusCode: response.statusCode,
                  },
                  _isSaving: false,
                },
              });
            } else {
              dispatch({
                type: actions.DELETE_FINISHED,
                payload: {
                  _isSaving: false,
                },
              });
              if (deferCallback && callback) callback();
            }
          });

          // if we get a callback, go ahead and fire it
          if (!deferCallback && callback) callback();
        }
      },

      [doUpdatePageSize]: (ps) => ({ dispatch }) => {
        if (typeof ps === "number")
          dispatch({
            type: actions.PAGE_SIZE_UPDATED,
            payload: { _pageSize: ps },
          });
      },

      [selectAbortReason]: (state) => {
        return state[config.name]._abortReason;
      },

      [selectForceFetch]: (state) => {
        return state[config.name]._forceFetch;
      },

      [selectFetchCount]: (state) => {
        return state[config.name]._fetchCount;
      },

      [selectLastFetch]: (state) => {
        return state[config.name]._lastFetch;
      },

      [selectLastResource]: (state) => {
        return state[config.name]._lastResource;
      },

      [selectState]: (state) => {
        return state[config.name];
      },

      [selectIsLoading]: (state) => {
        return state[config.name]._isLoading;
      },

      [selectIsSaving]: (state) => {
        return state[config.name]._isSaving;
      },

      [selectPageSize]: (state) => {
        return state[config.name]._pageSize;
      },

      [selectIsStale]: createSelector(
        "selectAppTime",
        selectLastFetch,
        (now, lastFetch) => {
          return now - new Date(lastFetch) > config.staleAfter;
        }
      ),

      [selectFlags]: createSelector(selectState, (state) => {
        const flags = {};
        Object.keys(state).forEach((key) => {
          if (key[0] === "_") flags[key] = state[key];
        });
        return flags;
      }),

      [selectItemsPaged]: createSelector(
        selectItems,
        selectPageSize,
        (items, pageSize) => {
          const pages = [];
          for (let i = 0; i < Math.ceil(items.length / pageSize); i++) {
            pages.push(items.slice(pageSize * i, pageSize * i + pageSize));
          }
          return pages;
        }
      ),

      [selectItemsObject]: createSelector(selectState, (state) => {
        const items = {};
        Object.keys(state).forEach((key) => {
          if (key[0] !== "_") items[key] = state[key];
        });
        return items;
      }),

      [selectItemsArray]: createSelector(selectState, (state) => {
        const items = [];
        Object.keys(state).forEach((key) => {
          if (key[0] !== "_") items.push(state[key]);
        });
        return items;
      }),

      [selectItems]: createSelector(selectItemsArray, (items) => {
        return items;
      }),

      [selectByRoute]: createSelector(
        selectItemsObject,
        "selectRouteParams",
        (items, params) => {
          if (params.hasOwnProperty(config.routeParam)) {
            if (items.hasOwnProperty(params[config.routeParam])) {
              return items[params[config.routeParam]];
            } else {
              return null;
            }
          } else {
            return null;
          }
        }
      ),

      [selectGetTemplate]: () => {
        return config.getTemplate;
      },

      [selectPutTemplate]: () => {
        return config.putTemplate;
      },

      [selectPostTemplate]: () => {
        return config.postTemplate;
      },

      [selectDeleteTemplate]: () => {
        return config.deleteTemplate;
      },

      [selectGetUrl]: createSelector(
        selectGetTemplate,
        "selectRouteParams",
        ...config.urlParamSelectors,
        (template, params, ...args) => {
          const availableParams = Object.assign({}, params, ...args);
          let url = template;
          Object.keys(availableParams).forEach((key) => {
            url = url.replace(`:${key}`, availableParams[key]);
          });
          return url;
        }
      ),

      [selectPutUrl]: createSelector(
        selectPutTemplate,
        "selectRouteParams",
        ...config.urlParamSelectors,
        (template, params, ...args) => {
          const availableParams = Object.assign({}, params, ...args);
          let url = template;
          Object.keys(availableParams).forEach((key) => {
            url = url.replace(`:${key}`, availableParams[key]);
          });
          return url;
        }
      ),

      [selectPostUrl]: createSelector(
        selectPostTemplate,
        "selectRouteParams",
        ...config.urlParamSelectors,
        (template, params, ...args) => {
          const availableParams = Object.assign({}, params, ...args);
          let url = template;
          Object.keys(availableParams).forEach((key) => {
            url = url.replace(`:${key}`, availableParams[key]);
          });
          return url;
        }
      ),

      [selectDeleteUrl]: createSelector(
        selectDeleteTemplate,
        "selectRouteParams",
        ...config.urlParamSelectors,
        (template, params, ...args) => {
          const availableParams = Object.assign({}, params, ...args);
          let url = template;
          Object.keys(availableParams).forEach((key) => {
            url = url.replace(`:${key}`, availableParams[key]);
          });
          return url;
        }
      ),

      [selectAllowRoles]: (state) => {
        return state[config.name]._allowRoles;
      },

      [selectIsAllowedRole]: createSelector(
        selectAllowRoles,
        "selectAuthRoles",
        checkRoles
      ),

      [selectDisallowRoles]: (state) => {
        return state[config.name]._disallowRoles;
      },

      [selectIsDisallowedRole]: createSelector(
        selectDisallowRoles,
        "selectAuthRoles",
        checkRoles
      ),

      [reactShouldFetch]: (state) => {
        if (state[config.name]._shouldFetch) return { actionCreator: doFetch };
      },
    },
    config.addons
  );

  if (config.persist) {
    result.persistActions = [
      actions.FETCH_STARTED,
      actions.FETCH_FINISHED,
      actions.FETCH_ABORT,
      actions.SAVE_STARTED,
      actions.SAVE_FINISHED,
      actions.DELETE_STARTED,
      actions.DELETE_FINISHED,
      actions.UPDATED_ITEM,
      actions.ERROR,
    ];
  }

  return result;
};
