export default {
  name: 'assignments',
  
  doAssignInstrumentToProject: (newValue, callback = (_didError) => {}) => ({ dispatch, store, apiPost }) => {
    dispatch({ type: 'ASSIGN_INSTRUMENT_START' });
    const { value: projectId } = newValue;
    const { instrumentId } = store.selectInstrumentsIdByRoute();

    const uri = `/projects/${projectId}/instruments/${instrumentId}/assignments`;

    apiPost(uri, {}, (err, _body) => {
      if (err) {
        callback(true);
      } else {
        callback(false);
      }
    });

    dispatch({ type: 'ASSIGN_INSTRUMENT_FINISHED' });
  },

  doRemoveInstrumentFromProject: (valueToRemove, callback = (_didError) => {}) => ({ dispatch, store, apiDelete }) => {
    dispatch({ type: 'HISTORICAL_SUBMITTALS_FETCH_START' });
    const { value: projectId } = valueToRemove;
    const { instrumentId } = store.selectInstrumentsIdByRoute();

    const uri = `/projects/${projectId}/instruments/${instrumentId}/assignments`;

    apiDelete(uri, (err, _body) => {
      if (err) {
        callback(true);
      } else {
        callback(false);
      }

      dispatch({ type: 'HISTORICAL_SUBMITTALS_FETCH_FINISHED' });
    });
  },
};
