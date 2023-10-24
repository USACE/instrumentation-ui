import React, { useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import { connect } from 'redux-bundler-react';
import { Add, Remove } from '@mui/icons-material';
import { addDays, subDays } from 'date-fns';
import { useDeepCompareEffect } from 'react-use';

import Button from '../../app-components/button';
import Card from '../../app-components/card';
import Chart from '../../app-components/chart/chart';
import { DateTime } from 'luxon';

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

const layoutTall = (key) => ({
  showlegend: false,
  autosize: true,
  height: 800,
  yaxis: {
    autorange: 'reversed',
    title: `Elevation (ft)`,
  }, 
  xaxis: {
    title: key ? `${key}-Displacement` : 'Temperature',
  },
});

const build2dTrace = (dataArray, key) => {
  if (!dataArray.length) return {};

  const { time, measurements } = dataArray[dataArray.length - 1];

  const keyMeasurements = measurements.map(m => m[key]);
  const zMeasurements = measurements.map((_m, i) => i * 10); // @TODO - Change to elevation?

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
  'doFetchInstrumentSensorsById',
  'doFetchInstrumentSensorMeasurements',
  'selectInstrumentSensors',
  'selectInstrumentSensorsMeasurements',
  ({
    doFetchInstrumentSensorsById,
    doFetchInstrumentSensorMeasurements,
    instrumentSensors,
    instrumentSensorsMeasurements,
  }) => {
    useEffect(() => {
      doFetchInstrumentSensorsById();
    }, [doFetchInstrumentSensorsById]);

    const [isOpen, setIsOpen] = useState(true);
    const [dateRange, setDateRange] = useState([subDays(new Date(), 7), new Date()]);

    useDeepCompareEffect(() => {
      if (isOpen) {
        doFetchInstrumentSensorMeasurements(dateRange[1].toISOString(), dateRange[0].toISOString());
      }
    }, [isOpen, dateRange]);

    console.log('test build2dTrace x: ', build2dTrace(instrumentSensorsMeasurements, 'x'));

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
                  </div>
                  <div className='row mt-3'>
                    <div className='col-4'>
                      <Chart
                        data={build2dTrace(instrumentSensorsMeasurements, 'x')}
                        layout={layoutTall('X')}
                        config={config}
                      />
                    </div>
                    <div className='col-4'>
                      <Chart
                        data={build2dTrace(instrumentSensorsMeasurements, 'y')}
                        layout={layoutTall('Y')}
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
