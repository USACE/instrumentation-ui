import React, { useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import { Add, Remove } from '@mui/icons-material';
import { Checkbox, FormControlLabel } from '@mui/material';
import { addDays, subDays } from 'date-fns';
import { connect } from 'redux-bundler-react';
import { DateTime } from 'luxon';
import { useDeepCompareEffect } from 'react-use';

import Button from '../../app-components/button';
import Card from '../../app-components/card';
import Chart from '../../app-components/chart/chart';
import SetInitialTimeModal from './setInitialTimeModal';

const colors = {
  init: '#800000',
  rest: '#000075',
};

const config = {
  repsonsive: true,
  displaylogo: false,
  displayModeBar: true,
  scrollZoom: true,
};

const layout = {
  showlegend: true,
  autosize: true,
  height: 800,
  yaxis: {
    autorange: 'reversed',
    title: `Depth in Feet`,
  }, 
  xaxis: {
    title: `Cumulative Displacement`,
  },
}

const build2dTrace = (dataArray, isInit = false) => {
  if (!dataArray.length) return {};

  const { time, measurements } = dataArray[dataArray.length - 1];

  const x = [], y = [];

  measurements?.forEach(element => {
    x.push(element?.cum_dev || 0);
    y.push(element?.elevation || 0);
  });

  return ({
    x,
    y,
    mode: 'markers+lines',
    marker: { size: 5, color: colors[isInit ? 'init' : 'rest'] },
    line: { width: 1 },
    type: 'scatter',
    name: isInit ? 'Initial Displacement' : `Displacement at ${DateTime.fromISO(time).toLocaleString(DateTime.DATETIME_SHORT)}`,
    hovertemplate: `
      <b>${DateTime.fromISO(time).toLocaleString(DateTime.DATETIME_SHORT)}</b><br>
      Elevation: %{y}<br>
      Displacement: %{x}<br>
      <extra></extra>
    `,
  });
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
    const [showInitial, setShowInitial] = useState(false);
    const [dateRange, setDateRange] = useState([subDays(new Date(), 7), new Date()]);

    const initialMeasurements = instrumentSensorsMeasurements.length ? instrumentSensorsMeasurements[0] : [];

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
                    <div className='col-6 float-right'>
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
                        layout={layout}
                        data={[
                          showInitial && build2dTrace([initialMeasurements], true),
                          build2dTrace(instrumentSensorsMeasurements),
                        ].filter(e => e)}
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
