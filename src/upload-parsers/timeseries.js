export default {
  name: 'Timeseries',
  url: '/timeseries',
  postProcess: null,
  model: {
    instrument_id: {
      label: 'Instrument',
      type: 'internal',
      provider: state => (
        Object.keys(state.instruments).filter(key => key.charAt(0) !== '_')
      ),
      required: true,
      parse: (val, state) => {
        const instrument = state.instruments[val.toLowerCase()];
        return instrument ? instrument.id : null;
      },
      validate: (val, state) => {
        const existingInstruments = Object.keys(state.instruments);
        return !!val ? existingInstruments.indexOf(val.toLowerCase()) === -1 : false;
      },
      helpText: 'Should map to an instrument name that exists in the system.',
    },
    name: {
      label: 'Name',
      type: 'string',
      required: true,
      helpText: 'Name will be used everywhere the timeseries is displayed, along with the instrument name.',
    },
    parameter_id: {
      label: 'Parameter',
      type: 'domain',
      domainGroup: 'parameter',
      required: true,
      helpText: 'Acceptable data values include "pressure", "temperature", "elevation", "length", "precipitation", or "voltage" others will be ignored',
    },
    unit_id: {
      label: 'Unit',
      type: 'domain',
      domainGroup: 'unit',
      required: true,
      helpText: 'Acceptable data values include "inches", "feet", "volts", "millibar", or "inches mercury (Hg)" others will be ignored',
    },
  },
};
