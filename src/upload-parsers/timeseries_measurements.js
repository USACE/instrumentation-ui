export default {
  name: "Timeseries Measurement",
  url: "/timeseries/measurements",
  postProcess: null,
  model: {
    instrument_id: {
      label: "Instrument",
      type: "string",
      required: true,
      parse: (val, state) => {
        const instrument = state.instruments[val.toLowerCase()];
        if (instrument) return instrument.id;
        return null;
      },
      validate: (val) => {
        return !!val;
      },
      helpText: "Should map to an instrument name that exists in the system.",
    },
    timeseries_id: {
      label: "Timeseries",
      type: "string",
      required: true,
      parse: (val, state, row) => {
        const timeseries = Object.values(state.instrumentTimeseries);
        const found = timeseries.filter((t) => {
          if (!t || !row || !val) return null;
          return t.name === val && t.instrument_id === row.instrument_id;
        });
        if (found && found.length) {
          return found[0].id;
        } else {
          return null;
        }
      },
      validate: (val) => {
        return !!val;
      },
      helpText:
        "Should map to an timeseries name that exists in the system for the selected instrument.",
    },
    time: {
      label: "Time",
      type: "string",
      required: true,
      helpText:
        "Value should be able to be parsed into a Javascript Date String (see MDN docs for this)",
    },
    value: {
      label: "Value",
      type: "number",
      required: true,
      helpText: "Numeric value of the measurement at the specified time",
    },
  },
};
