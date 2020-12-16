import formatISO from 'date-fns/formatISO';

const formatTime = t => formatISO(new Date(t));

export default {
  name: 'Timeseries Measurement',
  url: '/timeseries/measurements',
  prePostFilter: (data) => (
    /** this will work for single timeseries_id, needs to be updated to allow for multiple */
    data.reduce((accum, current) => {
      const { timeseries_id, time, value, project_id } = current;

      return ({
        ...accum,
        timeseries_id,
        project_id,
        items: (accum['items'] || []).concat([{
          time: formatTime(time),
          value,
        }])
      });
    }, {})
  ),
  model: {
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
      parse: (val) => formatTime(val),
      helpText: 'Value should be able to be parsed into a Javascript Date String (see MDN docs for this)',
    },
    value: {
      label: 'Value',
      type: 'number',
      required: true,
      parse: (val) => Number(val),
      helpText: 'Numeric value of the measurement at the specified time',
    },
  },
};
