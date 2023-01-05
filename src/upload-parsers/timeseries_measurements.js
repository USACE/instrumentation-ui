import { DateTime } from 'luxon';
import { isNumeric } from '../utils';

const timeseriesMeasurementParser = {
  name: 'Timeseries Measurement',
  url: '/projects/:projectId/timeseries_measurements',
  prePostFilter: (data) => (
    /** this will work for single timeseries_id, needs to be updated to allow for multiple */
    data.reduce((accum, current) => {
      const { timeseries_id, time, value, masked, validated, annotation, project_id } = current;

      return ({
        ...accum,
        timeseries_id,
        project_id,
        items: (accum['items'] || []).concat([{
          time: DateTime.fromISO(time, { zone: 'utc' }),
          value,
          masked,
          validated,
          annotation,
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
      helpText: 'Should map to a timeseries name that exists in the system for the selected instrument.',
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
      validate: val => val !== null,
      helpText: 'Numeric value of the measurement at the specified time',
    },
    masked: {
      label: 'Masked',
      type: 'boolean',
      required: false,
      parse: val => val === 'true' || val === 'T' || val ==='Y',
      validate: val => !!val,
      helpText: 'Boolean value of whether the measurement should be masked (Optional, default to false)',
    },
    validated: {
      label: 'Validated',
      type: 'boolean',
      required: false,
      parse: val => val === 'true' || val === 'T' || val ==='Y',
      validate: val => !!val,
      helpText: 'Boolean value of whether the measurement is already validated (Optional, default to false)',
    },
    annotation: {
      label: 'Annotation',
      type: 'string',
      required: false,
      parse: val => val,
      validate: val => !!val,
      helpText: 'String note to be associated with the measurement (Optional, can be empty)',
    },
  },
};

export default timeseriesMeasurementParser;
