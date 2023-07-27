export default {
  name: 'districtRollup',
  getReducer: () => {
    const initialState = {
      evaluation: [],
      measurement: [],
    };
    
    return (state = initialState, { type, payload }) => {
      switch (type) {
        case 'ROLLUP_UPDATED':
          return {
            ...state,
            [payload.type]: payload.data,
          };
        default:
          return state;
      }
    };
  },

  selectDistrictRollupRaw: (state) => state.districtRollup,
  selectDistrictRollupEvaluation: (state) => state.districtRollup.evaluation,
  selectDistrictRollupMeasurement: (state) => state.districtRollup.measurement,

  // one of [`evaluation`, `measurement`]
  doFetchDistrictRollup: (type, fromDate = '', toDate = '') => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'ROLLUP_FETCH_START' });
    const { projectId } = store.selectProjectsIdByRoute();

    let query = '';
    if (fromDate && toDate) {
      const formattedFrom = fromDate.toISOString();
      const formattedTo = toDate.toISOString();
      query = `?from_timestamp_month=${formattedFrom}&to_timestamp_month=${formattedTo}`;
    }

    const url = `/projects/${projectId}/district_rollup/${type}_submittals${query}`;

    apiGet(url, (err, body) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log('error: ', err);
      } else {
        dispatch({
          type: 'ROLLUP_UPDATED',
          payload: {
            type,
            data: body,
          },
        });
      }

      dispatch({ type: 'ROLLUP_FETCH_FINISHED' });
    });
  },
};
