import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';
import { seriesStyles } from '../../common/helpers/utils';
import LineStyle from './line-style';

let styleIterator = 0;

const TimeseriesCheckbox = ({
  timeseries,
  instrument,
  chartSeries,
  onChange,
}) => {
  // give each instance of the checkbox a unique ordered index value so
  // we can consistently get the style settings
  const [styleIdx] = useState(styleIterator++);
  const [style, setStyle] = useState(
    chartSeries && chartSeries.style
      ? chartSeries.style
      : seriesStyles[styleIdx % 11]
  );

  return (
    <>
      <label
        className='checkbox label is-small'
        style={{ paddingLeft: '3.5rem' }}
      >
        <input
          type='checkbox'
          style={{ marginRight: '.8em' }}
          checked={
            chartSeries && chartSeries.active ? chartSeries.active : false
          }
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
      <LineStyle style={style} onChange={setStyle} />
    </>
  );
};

const InstrumentControl = ({ instrument, timeseries, series, onChange }) => {
  if (!series) return null;
  return (
    <div className='mb-2'>
      <label className='label is-small'>{instrument.name}</label>
      <div style={{ position: 'relative' }}>
        {!timeseries
          ? 'No timeseries data...'
          : timeseries.map((ts, i) => (
            <TimeseriesCheckbox
              key={i}
              instrument={instrument}
              timeseries={ts}
              chartSeries={series[ts.id]}
              onChange={onChange}
            />
          ))}
      </div>
    </div>
  );
};

export default connect(
  'selectExploreMapSelectedInstruments',
  // 'selectExploreMapInteractionsVersion',
  'selectInstrumentTimeseriesByInstrumentId',
  ({
    exploreMapSelectedInstruments: instruments,
    // exploreMapInteractionsVersion: version,
    instrumentTimeseriesByInstrumentId: timeseriesByInstrumentId,
    state,
    dispatch,
  }) => (
    <div>
      {instruments.length
        ? instruments
          .sort((a, b) => {
            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1;
            return 0;
          })
          .map((instrument, i) => (
            <InstrumentControl
              key={i}
              instrument={instrument}
              timeseries={timeseriesByInstrumentId[instrument.id]}
              series={state.series}
              onChange={(e) => {
                dispatch({
                  type: 'SET_SERIES',
                  payload: e,
                });
              }}
            />
          ))
        : 'Select Instruments on the Map'}
    </div>
  )
);
