import { createSelector } from 'redux-bundler';

const usersBundle = {
  name: 'users',

  getReducer: () => {
    const initialState = {
      _searchQuery: '',
      _isLoading: false,
      _shouldFetch: false,
    };
    
    return (state = initialState, { type, payload }) => {
      switch (type) {
        case 'TYPEAHEAD_FETCH_START':
          return {
            ...state,
            _isLoading: true,
            _shouldFetch: false,
          };
        case 'TYPEAHEAD_FETCH_FINISHED':
          return {
            ...payload,
          };
        case 'TYPEAHEAD_QUERY_UPDATED':
          return {
            ...state,
            _searchQuery: payload,
            _shouldFetch: true,
          };
        case 'TYPEAHEAD_FETCH_FAILED':
        case 'TYPEAHEAD_FETCH_ABORT':
          return {
            ...state,
            _isLoading: false,
          };
        default:
          return state;
      }
    };
  },

  selectUsersRaw: state => state.users,
  selectUsersSearchQuery: state => state.users._searchQuery,
  selectUsersShouldFetch: state => state.users._shouldFetch,
  selectUsersIsLoading: state => state.users._isLoading,
  selectUsersFlags: createSelector('selectUsersRaw', users => {
    const usersClone = Object.assign({}, users);
    Object.keys(usersClone).forEach((key) => {
      if (key[0] !== '_') delete usersClone[key];
    });
    return usersClone;
  }),
  selectUsersItems: createSelector('selectUsersRaw', users => {
    const items = [];
    Object.keys(users).forEach((key) => {
      if (key[0] !== '_') items.push(users[key]);
    });
    return items;
  }),

  doTypeaheadQueryUpdated: (q) => ({ dispatch }) => {
    console.log('test payload: ', q);
    dispatch({
      type: 'TYPEAHEAD_QUERY_UPDATED',
      payload: q,
    });
  },

  doUsersFetch: () => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'TYPEAHEAD_FETCH_START' });
    const queryStr = store.selectUsersSearchQuery();
    const usersFlags = store.selectUsersFlags();

    if (!queryStr) {
      dispatch({
        type: 'TYPEAHEAD_FETCH_ABORT',
        payload: {
          reason: 'No query string',
        },
      });
      return;
    };

    const uri = `/email_autocomplete?q=${queryStr}`;

    apiGet(uri, (err, body) => {
      if (err) {
        dispatch({
          type: 'TYPEAHEAD_FETCH_FAILED',
          payload: {
            reason: err,
          },
        });
      } else {
        dispatch({
          type: 'TYPEAHEAD_FETCH_FINISHED',
          payload: {
            ...usersFlags,
            ...body.reduce((accum, elem) => ({
              ...accum,
              [elem.id]: elem,
            }), {}),
            _isLoading: false,
          },
        });
      }
    });
  },

  doUsersSaveUser: (profileId, roleId) => ({ dispatch, store, apiPost }) => {
    dispatch({ type: 'PROJECTMEMBERS_ADD_USER_START' });
    const project = store.selectProjectsIdByRoute();
    const { projectId } = project || {};

    if (!profileId || !roleId || !projectId) {
      dispatch({
        type: 'PROJECTMEMBERS_ADD_USER_ABORT',
        payload: {
          reason: 'Missing params',
        },
      });
      return;
    }

    const uri = `/projects/${projectId}/members/${profileId}/roles/${roleId}`;
    apiPost(uri, null, (err, body) => {
      if (err) {
        dispatch({
          type: 'PROJECTMEMBERS_ADD_USER_FAILED',
          payload: {
            return: err,
          },
        });
      } else {
        dispatch({
          type: 'PROJECTMEMBERS_ADD_USER_FINISHED',
          payload: body,
        });
      }
    });
  },

  doUsersDeleteUser: (profileId, roleId) => ({ dispatch, store, apiDelete }) => {
    dispatch({ type: 'PROJECTMEMBERS_DELETE_USER_START' });
    const project = store.selectProjectsIdByRoute();
    const { projectId } = project || {};

    if (!profileId || !roleId || !projectId) {
      dispatch({
        type: 'PROJECTMEMBERS_DELETE_USER_ABORT',
        payload: {
          reason: 'Missing params',
        },
      });
      return;
    }

    const uri = `/projects/${projectId}/members/${profileId}/roles/${roleId}`;
    apiDelete(uri, (err, body) => {
      if (err) {
        dispatch({
          type: 'PROJECTMEMBERS_DELETE_USER_FAILED',
          payload: {
            return: err,
          },
        });
      } else {
        dispatch({
          type: 'PROJECTMEMBERS_DELETE_USER_FINISHED',
          payload: body,
        });
      }
    });
  },

  reactUsersShouldFetch: createSelector(
    'selectUsersShouldFetch',
    'selectUsersIsLoading',
    'selectUsersSearchQuery',
    (shouldFetch, isLoading, queryStr) => {
      if (shouldFetch && !isLoading && queryStr)
        return { actionCreator: 'doUsersFetch' };

      return null;
    }
  ),
};

export default usersBundle;
