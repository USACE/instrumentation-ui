import { DateTime } from 'luxon';
import { isNumeric } from '../utils';

const timeseriesMeasurementParser = {
  name: 'Inclinometer Measurements',
  url: '/projects/:projectId/inclinometer_measurements',
  prePostFilter: (data) => {
    const { timeseries_id, time } = data ? data[0] : {};

    if (timeseries_id && time) {
      return {
        timeseries_id,
        inclinometers: [{
          time: DateTime.fromISO(time, { zone: 'utc' }),
          values: data.map(current => {
            const { depth, a0, b0, a180, b180 } = current;

            return {
              depth,
              a0,
              b0,
              a180,
              b180,
            };
          }),
        }],
      };
    }
  },
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
    depth: {
      label: 'Depth',
      type: 'number',
      required: true,
      parse: val => isNumeric(val) ? Number(val) : null,
      validate: val => val !== null,
      helpText: 'Numeric value of the depth at the specified time',
    },
    a0: {
      label: 'A0',
      type: 'number',
      required: true,
      parse: val => isNumeric(val) ? Number(val) : null,
      validate: val => val !== null,
      helpText: 'Numeric value of the a0 measurement at the specified time',
    },
    a180: {
      label: 'A180',
      type: 'number',
      required: true,
      parse: val => isNumeric(val) ? Number(val) : null,
      validate: val => val !== null,
      helpText: 'Numeric value of the a180 measurement at the specified time',
    },
    b0: {
      label: 'B0',
      type: 'number',
      required: true,
      parse: val => isNumeric(val) ? Number(val) : null,
      validate: val => val !== null,
      helpText: 'Numeric value of the a0 measurement at the specified time',
    },
    b180: {
      label: 'B180',
      type: 'number',
      required: true,
      parse: val => isNumeric(val) ? Number(val) : null,
      validate: val => val !== null,
      helpText: 'Numeric value of the b180 measurement at the specified time',
    },
  },
};

export default timeseriesMeasurementParser;
