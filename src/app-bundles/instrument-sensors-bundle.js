export default {
  name: 'instrumentSensors',
  getReducer: () => {
    const initialState = {
      sensors: [],
      _lastFetched: null,
    };
    
    return (state = initialState, { type, payload }) => {
      switch (type) {
        case 'INSTRUMENT_SENSORS_UPDATED':
          return {
            ...state,
            sensors: payload,
            _lastFetched: new Date(),
          };
        default:
          return state;
      }
    };
  },

  selectInstrumentSensorsRaw: (state) => state.instrumentSensors,
  selectInstrumentSensors: (state) => state.instrumentSensors.sensors,
  selectInstrumentSensorsLastFetched: (state) => state.instrumentSensors._lastFetched,

  doFetchInstrumentSensorsById: () => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'INSTRUMENT_SENSORS_BY_ID_FETCH_START' });
    const { id } = store.selectInstrumentsIdByRoute();

    const url = `/instruments/${id}/sensors`;

    apiGet(url, (err, body) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log('error: ', err);
      } else {
        dispatch({
          type: 'INSTRUMENT_SENSORS_UPDATED',
          payload: body,
        });
      }

      dispatch({ type: 'INSTRUMENT_SENSORS_BY_ID_FETCH_FINISHED' });
    });
  },
};
