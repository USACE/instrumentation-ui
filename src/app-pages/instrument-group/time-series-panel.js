import React, { useState, useEffect, useReducer, useRef } from 'react';
import isEqual from 'lodash.isequal';
import { connect } from 'redux-bundler-react';

import Card from '../../app-components/card';
import TimeSeriesChart from './time-series-chart';
import { seriesStyles } from '../../utils';
import { subDays } from 'date-fns';


let styleIterator = 0;

const TimeseriesCheckbox = ({
  timeseries,
  instrument,
  checked = true,
  onChange,
}) => {
  // give each instance of the checkbox a unique ordered index value so
  // we can consistently get the style settings
  const [styleIdx] = useState(styleIterator++);
  const style = seriesStyles[styleIdx % 11];

  return (
    <>
      <label className='checkbox pl-4'>
        <input
          type='checkbox'
          checked={checked}
          onChange={(e) => {
            onChange({
              [timeseries.id]: {
                name: `${instrument.name} - ${timeseries.name}`,
                active: e.target.checked,
                style: style,
              },
            });
          }}
        />
        <span> {timeseries.name} <i>({timeseries.parameter} in {timeseries.unit})</i></span>
      </label>
    </>
  );
};

const InstrumentControl = ({ instrument, timeseries, series, onChange }) => {
  if (!series || !timeseries || !instrument) return null;

  return (
    <div className='mb-2'>
      <b className='control'>{instrument.name}</b>
      <div>
        {timeseries.map((ts, i) => (
          <TimeseriesCheckbox
            key={i}
            instrument={instrument}
            checked={series[ts.id]?.active}
            timeseries={ts}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  );
};

const reducer = (series, { type, payload }) => {
  switch (type) {
    case 'UPDATE_SERIES':
      return Object.assign({}, series, payload);
    default:
      return series;
  }
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
    nonComputedTimeseriesByInstrumentId: timeseriesByInstrumentId,
  }) => {
    const instrumentsRef = useRef({});
    const [series, dispatch] = useReducer(reducer, {});
    const chartSeries = {};

    if (!isEqual(instrumentsRef.current, instruments)) {
      instrumentsRef.current = instruments;
    }

    useEffect(() => {
      // Load group's instruments and associated timeseries:
      if (Object.keys(instruments).length) {
        const beforeDate = new Date();
        const afterDate = subDays(beforeDate, 365);

        const before = beforeDate.toISOString();
        const after = afterDate.toISOString();

        doFetchInstrumentGroupTimeseriesMeasurements({ before, after });
      }

      // Save timeseries into local state for checkbox changes
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
                      timeseries={timeseriesByInstrumentId[instrumentId]}
                      series={series}
                      onChange={e => {
                        dispatch({
                          type: 'UPDATE_SERIES',
                          payload: e,
                        });
                      }}
                    />
                  ))}
              </div>
              <div className='col-9'>
                <TimeSeriesChart data={chartSeries} />
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  }
);
