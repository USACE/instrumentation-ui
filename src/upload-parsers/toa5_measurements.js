import { DateTime } from 'luxon';

const toa5MeasurementsParser = {
  name: 'TOA5 Measurements',
  url: '/projects/:projectId/timeseries_measurements',
  prePostFilter: (data) => (
    /** this will work for single timeseries_id, needs to be updated to allow for multiple */
    data.reduce((accum, current) => {
      const { timeseries_id, time, value } = current;

      return ({
        ...accum,
        timeseries_id,
        items: (accum['items'] || []).concat([{
          time: DateTime.fromISO(time, { zone: 'utc' }),
          value,
        }]),
      });
    }, {})
  ),
  model: null,
  dynamic: (data) => {
    if (!data.length) return {};

    const timeseriesHeaders = data[0];
    if (!timeseriesHeaders) return {};

    timeseriesHeaders.splice(0, 2);

    const timeseriesPickers = timeseriesHeaders.reduce((accum, current) => ({
      ...accum,
      [current]: {
        label: current,
        type: 'internal',
        required: false,
        useFilterComponent: true,
        hideCsvMappings: true,
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
      }
    }), {});

    return timeseriesPickers;
  },
};

export default toa5MeasurementsParser;
