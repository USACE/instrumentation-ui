export default {
  name: 'Timeseries Measurement',
  url: '/timeseries/measurements',
  postProcess: null,
  model: {
    instrument_id: {
      label: 'Instrument',
      type: 'internal',
      required: true,
      provider: state => (
        Object.keys(state.instruments)
          .filter(key => key.charAt(0) !== '_')
          .map(key => ({ value: state.instruments[key].id, text: key }))
      ),
      parse: (val) => val,
      validate: (val, state) => {
        const existingInstruments = Object.keys(state.instruments);
        return !!val ? existingInstruments.indexOf(val.toLowerCase()) === -1 : false;
      },
      helpText: 'Should map to an instrument name that exists in the system.',
    },
    timeseries_id: {
      label: 'Timeseries',
      type: 'internal',
      required: true,
      provider: state => (
        Object.keys(state.instrumentTimeseries)
          .filter(key => key.charAt(0) !== '_')
          .map(key => ({
            value: key,
            text: `${state.instrumentTimeseries[key].instrument} - ${state.instrumentTimeseries[key].name}`,
          }))
      ),
      parse: (val) => val,
      validate: (val) => !!val,
      helpText: 'Should map to an timeseries name that exists in the system for the selected instrument.',
    },
    time: {
      label: 'Time',
      type: 'string',
      required: true,
      helpText: 'Value should be able to be parsed into a Javascript Date String (see MDN docs for this)',
    },
    value: {
      label: 'Value',
      type: 'number',
      required: true,
      helpText: 'Numeric value of the measurement at the specified time',
    },
  },
};
