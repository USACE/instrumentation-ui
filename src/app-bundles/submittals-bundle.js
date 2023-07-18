export default {
  name: 'submittals',
  getReducer: () => {
    const initialState = {
      missing: '',
      history: [], // @TODO
    };
    
    return (state = initialState, { type, payload }) => {
      switch (type) {
        case 'MISSING_SUBMITTALS_UPDATED':
          return {
            ...state,
            missing: payload,
          };
        case 'HISTORICAL_SUBMITTALS_UPDATED':
          return {
            ...state,
            history: payload,
          };
        default:
          return state;
      }
    };
  },

  selectSubmittalsRaw: (state) => state.submittals,
  selectSubmittalsMissing: (state) => state.submittals.missing,
  selectSubmittalsHistory: (state) => state.submittals.history,

  doFetchMissingSubmittalsByProjectId: () => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'MISSING_SUBMITTALS_FETCH_START' });
    const { projectId } = store.selectProjectsIdByRoute();

    const url = `/projects/${projectId}/submittals?missing=true`;

    apiGet(url, (err, body) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log('error: ', err);
      } else {
        dispatch({
          type: 'MISSING_SUBMITTALS_UPDATED',
          payload: body,
        });
      }

      dispatch({ type: 'MISSING_SUBMITTALS_FETCH_FINISHED' });
    });
  },

  doFetchHistoricalSubmittalsByProjectId: () => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'HISTORICAL_SUBMITTALS_FETCH_START' });
    const { projectId } = store.selectProjectsIdByRoute();

    const url = `/projects/${projectId}/submittals`;

    apiGet(url, (err, body) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log('error: ', err);
      } else {
        dispatch({
          type: 'HISTORICAL_SUBMITTALS_UPDATED',
          payload: body,
        });
      }

      dispatch({ type: 'HISTORICAL_SUBMITTALS_FETCH_FINISHED' });
    });
  },
};
