import formatISO from 'date-fns/formatISO';
import { DateTime } from 'luxon';

import { isNumeric } from '../utils';


const formatTime = t => {
  try {
    const formatted = formatISO(new Date(t));

    const formattedTime = formatInTimeZone(formatted, 'yyyy-MM-dd kk:mm:ss xxx', 'UTC');
    return formattedTime;
  }
  catch (_e) {
    return undefined;
  }
};

const timeseriesMeasurementParser = {
  name: 'Timeseries Measurement',
  url: '/projects/:projectId/timeseries_measurements',
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
      useFilterComponent: true,
      provider: state => {
        const regex = new RegExp('/projects/(.*)/instruments');
        const match = state.instruments._lastResource.match(regex);
        const projectId = match && match.length >= 2 ? match[1] : '';

        return Object.keys(state.instrumentTimeseries)
          .filter(key => (key.charAt(0) !== '_' && state.instrumentTimeseries[key].project_id === projectId))
          .map(key => ({
            value: key,
            text: `${state.instrumentTimeseries[key].instrument} - ${state.instrumentTimeseries[key].name}`,
          }));
      },
      parse: val => val,
      validate: val => !!val,
      helpText: 'Should map to an timeseries name that exists in the system for the selected instrument.',
    },
    time: {
      label: 'Time',
      type: 'string',
      required: true,
      parse: val => DateTime.fromISO(val, { zone: 'utc' }),
      validate: val => DateTime.fromISO(val).isValid,
      helpText: 'A valid ISO-8601 string. See Luxon docs (https://moment.github.io/luxon/docs/manual/parsing.html#iso-8601) for more information.',
    },
    value: {
      label: 'Value',
      type: 'number',
      required: true,
      parse: val => isNumeric(val) ? Number(val) : null,
      validate: val => !!val,
      helpText: 'Numeric value of the measurement at the specified time',
    },
  },
};

export default timeseriesMeasurementParser;
