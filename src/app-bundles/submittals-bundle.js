export default {
  name: 'submittals',
  getReducer: () => {
    const initialState = {
      missing: '',
      history: [], // @TODO
    };
    
    return (state = initialState, { type, payload }) => {
      switch (type) {
        case 'SUBMITTALS_UPDATED':
          return {
            ...state,
            missing: payload,
          };
        default:
          return state;
      }
    };
  },

  selectSubmittalsRaw: (state) => state.submittals,
  selectSubmittalsMissing: (state) => state.submittals.missing,

  doFetchMissingSubmittalsByProjectId: () => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'SUBMITTALS_FETCH_START' });
    const { projectId } = store.selectProjectsIdByRoute();

    const url = `/projects/${projectId}/submittals?missing=true`;

    apiGet(url, (err, body) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log('error: ', err);
      } else {
        dispatch({
          type: 'SUBMITTALS_UPDATED',
          payload: body,
        });
      }

      dispatch({ type: 'SUBMITTALS_FETCH_FINISHED' });
    });
  },
};
