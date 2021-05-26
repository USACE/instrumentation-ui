import React, { useState, useEffect, useReducer } from 'react';
import { connect } from 'redux-bundler-react';

import Card from '../../app-components/card';
import TimeSeries from './group-time-series-chart';
import { seriesStyles } from '../../utils';

let styleIterator = 0;

const TimeseriesCheckbox = ({
  timeseries,
  instrument,
  checked = false,
  onChange,
}) => {
  // give each instance of the checkbox a unique ordered index value so
  // we can consistently get the style settings
  const [styleIdx] = useState(styleIterator++);
  const style = seriesStyles[styleIdx % 11];

  return (
    <>
      <label className='checkbox' style={{ paddingLeft: '3.5rem' }}>
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
        {`${timeseries.name} (${timeseries.parameter} in ${timeseries.unit})`}
        {''}
      </label>
      <div
        style={{
          position: 'relative',
          right: 0,
          top: '-12px',
          width: '40px',
          borderBottom: `solid ${style.line.width} ${style.line.color}`,
        }}
      />
    </>
  );
};

const InstrumentControl = ({ instrument, timeseries, series, onChange }) => {
  if (!series || !timeseries || !instrument) return null;
  return (
    <div className='mb-2 ml-2'>
      <div className='control'>{instrument.name}</div>
      <div>
        {timeseries.map((ts, i) => (
          <TimeseriesCheckbox
            key={i}
            instrument={instrument}
            checked={series[ts.id] && series[ts.id].active}
            timeseries={ts}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  );
};

// using the useReducer hook instead of useState for more complex
// data handling, it's internal to our component, the rest of the
// app doesn't care, so we keep it here instead of moving it to
// a bundle.
const reducer = (series, { type, payload }) => {
  switch (type) {
    case 'UPDATE_SERIES':
      return Object.assign({}, series, payload);
    default:
      return series;
  }
};

export default connect(
  'doInstrumentTimeseriesSetActiveId',
  'selectInstrumentGroupInstrumentsItemsObject',
  'selectTimeseriesMeasurementsItemsObject',
  'selectNonComputedTimeseriesByInstrumentId',
  ({
    doInstrumentTimeseriesSetActiveId,
    instrumentGroupInstrumentsItemsObject: instruments,
    timeseriesMeasurementsItemsObject: measurements,
    nonComputedTimeseriesByInstrumentId: timeseriesByInstrumentId,
  }) => {
    const [series, dispatch] = useReducer(reducer, {});

    useEffect(() => {
      if (series) {
        Object.keys(series).forEach((key) => {
          if (!measurements.hasOwnProperty(key))
            doInstrumentTimeseriesSetActiveId(key);
        });
      }
    }, [series, doInstrumentTimeseriesSetActiveId]);

    const chartSeries = {};
    Object.keys(measurements).forEach((id) => {
      if (series.hasOwnProperty(id)) {
        if (series[id].active)
          chartSeries[id] = Object.assign(measurements[id], series[id]);
      }
    });

    return (
      <Card className='mt-3 mb-5'>
        <Card.Header text='Timeseries' />
        <Card.Body>
          <div className='container'>
            <div className='row'>
              <div className='col-3'>
                {Object.keys(instruments)
                  .sort()
                  .map((instrumentId, i) => (
                    <InstrumentControl
                      key={i}
                      instrument={instruments[instrumentId]}
                      timeseries={timeseriesByInstrumentId[instrumentId]}
                      series={series}
                      onChange={(e) => {
                        dispatch({
                          type: 'UPDATE_SERIES',
                          payload: e,
                        });
                      }}
                    />
                  ))}
              </div>
              <div className='col-9'>
                <TimeSeries data={chartSeries} />
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  }
);
