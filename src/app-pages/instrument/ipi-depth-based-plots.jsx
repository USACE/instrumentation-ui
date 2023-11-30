import React, { useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import { Add, Remove } from '@mui/icons-material';
import { Checkbox, FormControlLabel, Slider, Stack, Switch } from '@mui/material';
import { addDays, subDays } from 'date-fns';
import { connect } from 'redux-bundler-react';
import { DateTime } from 'luxon';
import { useDeepCompareEffect } from 'react-use';

import Button from '../../app-components/button';
import Card from '../../app-components/card';
import Chart from '../../app-components/chart/chart';
import SetInitialTimeModal from './setInitialTimeModal';

const colors = {
  init: '#000',
};

const config = {
  repsonsive: true,
  displaylogo: false,
  displayModeBar: true,
  scrollZoom: true,
};

const layout = (showTemperature, showIncremental) => ({
  showlegend: true,
  autosize: true,
  height: 800,
  rows: 1,
  columns: showTemperature ? 2 : 1,
  yaxis: {
    domain: [0, 1],
    anchor: 'x1',
    autorange: 'reversed',
    title: `Depth in Feet`,
  }, 
  xaxis: {
    domain: [0, showTemperature ? 0.4 : 1],
    anchor: 'y1',
    title: `${showIncremental ? 'Incremental' : 'Cumulative'} Displacement`,
  },
  ...showTemperature && {
    xaxis2: {
      title: 'Temperature',
      domain: [0.6, 1],
      anchor: 'y2',
    },
    yaxis2: {
      domain: [0, 1],
      anchor: 'x2',
      autorange: 'reversed',
    }
  },
});

const formatData = (measurements, indexes, showInitial, showTemperature, showIncremental) => {
  if (!measurements.length) return {};

  const timeIncrements = measurements.sort((a, b) => DateTime.fromISO(a.time).toMillis() - DateTime.fromISO(b.time).toMillis())
  const relevantData = timeIncrements.slice(indexes[0], indexes[1] + 1);

  const dataArray = [
    ...(showInitial ? build2dTrace(timeIncrements[0], true, showTemperature, showIncremental).flat() : []),
    ...relevantData.map(m => build2dTrace(m, false, showTemperature, showIncremental)).flat(),
  ].filter(e => e);

  return { dataArray, timeIncrements, relevantData };
};

const build2dTrace = (data, isInit, showTemperature, showIncremental) => {
  if (!Object.keys(data).length) return {};

  const { time, measurements } = data;

  const x = [], xTemp = [], y = [];

  measurements?.forEach(element => {
    x.push(showIncremental ? (element?.inc_dev || 0) : (element?.cum_dev || 0));
    xTemp.push(element?.temp);
    y.push(element?.elevation || 0);
  });

  const localDateString = DateTime.fromISO(time).toLocaleString(DateTime.DATETIME_SHORT);
  const common = {
    y,
    mode: 'markers+lines',
    marker: { size: 5, color: isInit ? colors[isInit] : undefined },
    line: { width: 1 },
    type: 'scatter',
  };

  return [{
    ...common,
    x,
    name: isInit ? `Initial Displacement (${localDateString})`  : `Displacement at ${localDateString}`,
    hovertemplate: `
      <b>${localDateString}</b><br>
      Elevation: %{y}<br>
      ${showIncremental ? 'Incremental' : 'Cumulative'} Displacement: %{x}<br>
      <extra></extra>
    `,
  }, showTemperature ? {
    ...common,
    xTemp,
    xaxis: 'x2',
    yaxis: 'y2',
    name: isInit ? `Initial Temperature (${localDateString})`  : `Temperature at ${localDateString}`,
    hovertemplate: `
      <b>${localDateString}</b><br>
      Elevation: %{y}<br>
      Temperature: %{x}<br>
      <extra></extra>
    `,
  } : {}];
};

const IpiDepthBasedPlots = connect(
  'doModalOpen',
  'doFetchInstrumentSensorsById',
  'doFetchInstrumentSensorMeasurements',
  'selectInstrumentSensors',
  'selectInstrumentSensorsMeasurements',
  ({
    doModalOpen,
    doFetchInstrumentSensorsById,
    doFetchInstrumentSensorMeasurements,
    instrumentSensors,
    instrumentSensorsMeasurements,
  }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [showTemperature, setShowTemperature] = useState(true);
    const [showInitial, setShowInitial] = useState(false);
    const [showIncremental, setShowIncremental] = useState(false);
    const [sliderVal, setSliderVal] = useState([0, 0]);
    const [dateRange, setDateRange] = useState([subDays(new Date(), 7), new Date()]);

    const { dataArray = [], timeIncrements = [] } = formatData(instrumentSensorsMeasurements, sliderVal, showInitial, showTemperature, showIncremental);

    useEffect(() => {
      doFetchInstrumentSensorsById('ipi');
    }, [doFetchInstrumentSensorsById]);

    useDeepCompareEffect(() => {
      if (isOpen) {
        doFetchInstrumentSensorMeasurements('ipi', dateRange[1].toISOString(), dateRange[0].toISOString());
      }
    }, [isOpen, dateRange]);

    return (
      <Card>
        <Card.Header>
          <Button
            className='text-primary p-0 mr-2'
            variant='link'
            icon={isOpen ? <Remove fontSize='medium' /> : <Add fontSize='medium' /> }
            handleClick={() => setIsOpen(!isOpen)}
            title={isOpen ? 'Collapse Section' : 'Expand Section'}
          />
          <strong>Depth Based Plots</strong>
        </Card.Header>
        <Card.Body>
          {isOpen ? (
            <>
              {instrumentSensors.length ? (
                <>
                  Select a timeframe to view plots for the associated timeseries:
                  <div className='row mt-2'>
                    <div className='col-2'>
                      <i>Start Date</i>
                      <ReactDatePicker
                        placeholderText='mm/dd/yyyy'
                        className='form-control'
                        maxDate={Date.now()}
                        selected={dateRange[0]}
                        onChange={(date) => setDateRange([date, addDays(date, 7)])}
                      />
                    </div>
                    <div className='col-2'>
                      <i>End Date</i>
                      <ReactDatePicker
                        placeholderText='mm/dd/yyyy'
                        className='form-control'
                        maxDate={Date.now()}
                        selected={dateRange[1]}
                        onChange={(date) => setDateRange([subDays(date, 7), date])}
                      />
                    </div>
                    <div className='col-2 pt-3'>
                      <FormControlLabel
                        control={<Checkbox size='small' onChange={() => setShowInitial(prev => !prev)} />}
                        label='Show Initial Displacement'
                      />
                    </div>
                    <div className='col-2 pt-3'>
                      <FormControlLabel
                        control={<Checkbox size='small' defaultChecked onChange={() => setShowTemperature(prev => !prev)} />}
                        label='Show Temperature'
                      />
                    </div>
                    <div className='col-2 pt-3'>
                      <Stack direction='row' spacing={1} alignItems='center'>
                          Cumulative
                          <Switch onChange={_e => setShowIncremental(prev => !prev)} />
                          Incremental
                        </Stack>
                    </div>
                    <div className='col-2 float-right'>
                      <Button
                        isOutline
                        className='float-right'
                        variant='info'
                        size='small'
                        text='Set Initial Time'
                        handleClick={() => doModalOpen(SetInitialTimeModal, { type: 'ipi' }, 'lg')}
                      />
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-12'>
                      <Chart
                        config={config}
                        layout={layout(showTemperature, showIncremental)}
                        data={dataArray}
                      />
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-10 offset-1'>
                      <Slider
                        aria-label='depth plot time slider'
                        valueLabelDisplay='auto'
                        min={1}
                        max={timeIncrements.length - 1}
                        step={1}
                        value={sliderVal}
                        valueLabelFormat={(val) => <span>{DateTime.fromISO(instrumentSensorsMeasurements[val]?.time).toFormat('MMM dd, yyyy hh:mm:ss')}</span>}
                        onChange={(_e, newVal) => setSliderVal(newVal)}
                      />
                    </div>
                  </div>
                </>
              ) : <i>No Sensors for this instrument.</i>}
            </>
          ) : <i>Expand to view depth plots...</i>}
        </Card.Body>
      </Card>
    );
  },
);

export default IpiDepthBasedPlots;
