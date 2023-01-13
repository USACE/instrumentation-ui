import React, { useEffect, useRef, useState } from 'react';
import isEqual from 'lodash.isequal';
import { connect } from 'redux-bundler-react';

import Card from '../../app-components/card';
import TimeSeriesChart from './time-series-chart';
import { subYears } from 'date-fns';

const TimeseriesCheckbox = ({
  timeseries,
  checked,
  onChange,
}) => (
  <>
    <label className='checkbox pl-4'>
      <input
        type='checkbox'
        checked={checked}
        onChange={onChange}
      />
      <span> {timeseries.name} <i>({timeseries.parameter} in {timeseries.unit})</i></span>
    </label>
  </>
);

const InstrumentControl = ({ instrument, timeseries, activeTimeseries, onChange }) => {
  if (!timeseries || !instrument) return null;

  return (
    <div className='mb-2'>
      <b className='control'>{instrument.name}</b>
      <div>
        {timeseries.map(ts => {
          const { id } = ts;

          return (
            <TimeseriesCheckbox
              key={id}
              timeseries={ts}
              checked={activeTimeseries[id]}
              onChange={() => onChange(id)}
            />
          );
        })}
      </div>
    </div>
  );
};

const getChartData = (measurements = {}, timeseries = {}) => {
  const ret = [];

  const instrumentIds = Object.keys(measurements);

  instrumentIds.forEach(instrumentId => {
    measurements[instrumentId].forEach(el => {
      const { timeseries_id, items } = el;

      const ts = timeseries[instrumentId]?.find(el => el.id === timeseries_id);

      if (ts) {
        const { instrument, name } = ts;

        ret.push({
          name: `${instrument} - ${name}`,
          timeseriesId: timeseries_id,
          items: items.map(item => ({
            time: Object.keys(item)[0],
            value: Object.values(item)[0],
          })),
        });
      }
    });
  });

  return ret;
};

const setDefaultState = (measurements = {}) => {
  const instrumentIds = Object.keys(measurements);

  const ret = {};

  instrumentIds.forEach(instrumentId => {
    measurements[instrumentId].forEach(el => {
      const { timeseries_id } = el;

      ret[timeseries_id] = true;
    });
  });

  return ret;
};

export default connect(
  'doFetchInstrumentGroupTimeseriesMeasurements',
  'selectInstrumentGroupInstrumentsInstruments',
  'selectInstrumentGroupInstrumentsMeasurements',
  'selectNonComputedTimeseriesByInstrumentId',
  ({
    doFetchInstrumentGroupTimeseriesMeasurements,
    instrumentGroupInstrumentsInstruments: instruments,
    instrumentGroupInstrumentsMeasurements: measurements,
    nonComputedTimeseriesByInstrumentId: timeseries,
  }) => {
    const [activeTimeseries, setActiveTimeseries] = useState(setDefaultState(measurements));

    const instrumentsRef = useRef({});

    if (!isEqual(instrumentsRef.current, instruments)) {
      instrumentsRef.current = instruments;
    }

    useEffect(() => {
      if (Object.keys(instruments).length) {
        const beforeDate = new Date();
        const afterDate = subYears(beforeDate, 5);

        const before = beforeDate.toISOString();
        const after = afterDate.toISOString();

        doFetchInstrumentGroupTimeseriesMeasurements({ before, after });
      }
    }, [instrumentsRef.current]);

    return (
      <Card className='mt-3'>
        <Card.Header text='Timeseries' />
        <Card.Body>
          <div className='container'>
            <div className='row'>
              <div className='col-3'>
                {Object.keys(instruments)
                  .sort()
                  .map(instrumentId => (
                    <InstrumentControl
                      key={instrumentId}
                      instrument={instruments[instrumentId]}
                      timeseries={timeseries[instrumentId]}
                      activeTimeseries={activeTimeseries}
                      onChange={(id) => setActiveTimeseries(state => ({
                        ...state,
                        [id]: !state[id],
                      }))}
                    />
                  ))}
              </div>
              <div className='col-9'>
                <TimeSeriesChart
                  data={getChartData(measurements, timeseries)}
                  activeTimeseries={activeTimeseries}
                />
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  }
);
