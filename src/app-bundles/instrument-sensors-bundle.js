export default {
  name: 'instrumentSensors',
  getReducer: () => {
    const initialState = {
      sensors: [],
      measurements: [],
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
        case 'SENSOR_MEASUREMENTS_UPDATED':
          return {
            ...state,
            measurements: payload,
          };
        default:
          return state;
      }
    };
  },

  selectInstrumentSensorsRaw: (state) => state.instrumentSensors,
  selectInstrumentSensors: (state) => state.instrumentSensors.sensors,
  selectInstrumentSensorsMeasurements: (state) => state.instrumentSensors.measurements,
  selectInstrumentSensorsLastFetched: (state) => state.instrumentSensors._lastFetched,

  doFetchInstrumentSensorsById: () => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'INSTRUMENT_SENSORS_BY_ID_FETCH_START' });
    const { instrumentId } = store.selectInstrumentsIdByRoute();

    const url = `/instruments/saa/${instrumentId}/segments`;

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

  doUpdateInstrumentSensor: (formData) => ({ dispatch, store, apiPut }) => {
    dispatch({ type: 'INSTRUMENT_SENSOR_UPDATE_START' });

    const { instrumentId } = store.selectInstrumentsIdByRoute();
    const url = `/instruments/saa/${instrumentId}/segments`;

    apiPut(url, formData, (err, _body) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log('todo', err);
      } else {
        store.doFetchInstrumentSensorsById();
      }
    });
  },

  doFetchInstrumentSensorMeasurements: (before, after) => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'SENSOR_MEASUREMENTS_FETCH_START' });
    const { instrumentId } = store.selectInstrumentsIdByRoute();
    const url = `/instruments/saa/${instrumentId}/measurements?before=${before}&after=${after}`;

    apiGet(url, (err, body) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log('todo', err);
      } else {
        dispatch({
          type: 'SENSOR_MEASUREMENTS_UPDATED',
          payload: body,
        });
      }
    });

    dispatch({ type: 'SENSOR_MEASUREMENTS_FETCH_FINISHED' });

  },
};
