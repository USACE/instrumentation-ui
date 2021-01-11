const timeseriesParser = {
  name: 'Timeseries',
  url: '/timeseries',
  postProcess: (rows) => (
    /** Remove duplicate entries of timeseries name + instrument_id combinations */
    rows.reduce((accum, current) => {
      const found = accum.find(elem => {
        const { instrument_id, name } = elem;

        if (!instrument_id || !name) return false;

        return instrument_id === current.instrument_id && name === current.name;
      });

      if (!found) accum.push(current);
      return accum;
    }, [])
  ),
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
      helpText: `Acceptable data values include 'pressure', 'temperature', 'elevation', 'length', 'precipitation', or 'voltage' others will be ignored`,
    },
    unit_id: {
      label: 'Unit',
      type: 'domain',
      domainGroup: 'unit',
      required: true,
      useFilterComponent: true,
      helpText: `Acceptable data values include 'inches', 'feet', 'volts', 'millibar', or 'inches mercury (Hg)' others will be ignored`,
    },
  },
};

export default timeseriesParser;
