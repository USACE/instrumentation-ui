import React, { useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import { Add, Remove } from '@mui/icons-material';
import { addDays, subDays } from 'date-fns';
import { connect } from 'redux-bundler-react';
import { DateTime } from 'luxon';
import { Stack, Switch } from '@mui/material';
import { useDeepCompareEffect } from 'react-use';

import Button from '../../app-components/button';
import Card from '../../app-components/card';
import Chart from '../../app-components/chart/chart';
import SetInitialTimeModal from './setInitialTimeModal';

const colors = {
  x: '#800000',
  y: '#000075',
  temp: '#e6194B',
};

const config = {
  repsonsive: true,
  displaylogo: false,
  displayModeBar: true,
  scrollZoom: true,
};

const layoutTall = (key, isIncrement) => ({
  showlegend: false,
  autosize: true,
  height: 800,
  yaxis: {
    autorange: 'reversed',
    title: `Elevation (ft)`,
  }, 
  xaxis: {
    title: key ? `${key}-${isIncrement ? 'Increment' : 'Cumulative Displacement'}` : 'Temperature',
  },
});

const build2dTrace = (dataArray, key) => {
  if (!dataArray.length) return {};

  const { time, measurements } = dataArray[dataArray.length - 1];

  const keyMeasurements = measurements.map(m => m[key]);
  const zMeasurements = measurements.map((m) => m.elevation);

  return [
    {
      x: keyMeasurements,
      y: zMeasurements,
      mode: 'markers+lines',
      marker: { size: 5, color: colors[key] },
      line: { width: 1 },
      type: 'scatter',
      name: `${key}-Displacement`,
      hovertemplate: `
        <b>${DateTime.fromISO(time).toLocaleString(DateTime.DATETIME_SHORT)}</b><br>
        Depth: %{y}<br>
        Displacement: %{x}<br>
        <extra></extra>
      `,
    }
  ];
};

const DepthBasedPlots = connect(
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
    const [isIncrement, setIsIncrement] = useState(true);
    const [dateRange, setDateRange] = useState([subDays(new Date(), 7), new Date()]);

    useEffect(() => {
      doFetchInstrumentSensorsById();
    }, [doFetchInstrumentSensorsById]);

    useDeepCompareEffect(() => {
      if (isOpen) {
        doFetchInstrumentSensorMeasurements(dateRange[1].toISOString(), dateRange[0].toISOString());
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
                    <div className='col-2 pt-3 mt-1'>
                      <Stack direction='row' spacing={1} alignItems='center'>
                        Cumulative
                        <Switch defaultChecked onChange={_e => setIsIncrement(prev => !prev)} />
                        Increment
                      </Stack>
                    </div>
                    <div className='col-6 float-right'>
                      <Button
                        isOutline
                        className='float-right'
                        variant='info'
                        size='small'
                        text='Set Initial Time'
                        handleClick={() => doModalOpen(SetInitialTimeModal, {}, 'lg')}
                      />
                    </div>
                  </div>
                  <div className='row mt-3'>
                    <div className='col-4'>
                      <Chart
                        data={build2dTrace(instrumentSensorsMeasurements, isIncrement ? 'x_increment' : 'x_cum_dev')}
                        layout={layoutTall('X', isIncrement)}
                        config={config}
                      />
                    </div>
                    <div className='col-4'>
                      <Chart
                        data={build2dTrace(instrumentSensorsMeasurements, isIncrement ? 'y_increment' : 'y_cum_dev')}
                        layout={layoutTall('Y', isIncrement)}
                        config={config}
                      />
                    </div>
                    <div className='col-4'>
                      <Chart
                        data={build2dTrace(instrumentSensorsMeasurements, 'temp')}
                        layout={layoutTall()}
                        config={config}
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

export default DepthBasedPlots;
