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
    console.log('test data: ', data);

    return {};
  },
};

export default toa5MeasurementsParser;
