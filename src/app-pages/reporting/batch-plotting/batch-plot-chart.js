import { setDate } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';
import { subDays, parseISO, format } from 'date-fns';

import Chart from '../../../app-components/chart/chart';
import ChartSettings from './batch-plot-chart-settings';

const getStyle = (_index) => ({
  type: 'scatter',
  mode: 'lines+markers',
  marker: {
    size: 8,
  },
  line: {
    width: 2,
  },
});

const BatchPlotChart = connect(
  'doPrintSetData',
  'doInstrumentTimeseriesSetActiveId',
  'doTimeseriesMeasurementsFetchById',
  'selectBatchPlotConfigurationsActiveId',
  'selectBatchPlotConfigurationsItemsObject',
  'selectTimeseriesMeasurementsItems',
  'selectTimeseriesMeasurementsItemsObject',
  'selectInstrumentTimeseriesItemsByRoute',
  'doNotificationFire',
  ({
    doPrintSetData,
    doInstrumentTimeseriesSetActiveId,
    doTimeseriesMeasurementsFetchById,
    batchPlotConfigurationsActiveId,
    batchPlotConfigurationsItemsObject,
    timeseriesMeasurementsItems,
    timeseriesMeasurementsItemsObject,
    instrumentTimeseriesItemsByRoute,
    doNotificationFire,
  }) => {
    const [timeseriesIds, setTimeseriesId] = useState([]);
    const [measurements, setMeasurements] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [lifetimeDate, setLifetimeDate] = useState([]);
    const [dateRange, setDateRange] = useState([subDays(new Date(), 30), new Date()]);
    const [withPrecipitation, setWithPrecipitation] = useState(false);
    const layout = {
      xaxis: {
        title: 'Date',
        showline: true,
        mirror: true,
      },
      yaxis: {
        title: 'Measurement',
        showline: true,
        mirror: true,
        domain: [0, withPrecipitation ? 0.66 : 1],
      },
      ...(withPrecipitation && {
        yaxis2: {
          title: 'Rainfall',
          autorange: 'reversed',
          showline: true,
          mirror: true,
          domain: [0.66, 1],
        },
      }),
      autosize: true,
      dragmode: 'pan',
      height: 600,
    };

    const generateNewChartData = () => {
      const data = measurements
        .map((elem, i) => {
          if (elem && instrumentTimeseriesItemsByRoute.length) {
            const style = getStyle(i);
            const { items, timeseries_id } = elem;
            const {
              instrument,
              name,
              unit,
              parameter,
            } = instrumentTimeseriesItemsByRoute.find(
              (i) => i.id === timeseries_id
            );

            const sortedItems = (items || [])
              .slice()
              .sort((a, b) => new Date(a.time) - new Date(b.time));
            const { x, y } = sortedItems.reduce(
              (accum, item) => ({
                x: [...accum.x, item.time],
                y: [...accum.y, item.value],
              }),
              { x: [], y: [] }
            );

            return parameter === 'precipitation'
              ? {
                x,
                y,
                type: 'bar',
                yaxis: 'y2',
                name: `${instrument} - ${name} (${unit})` || '',
                showlegend: true,
              }
              : {
                ...style,
                x,
                y,
                name: `${instrument} - ${name} (${unit})` || '',
                showlegend: true,
              };
          }
        })
        .filter((e) => e);
      
      const datedData = data;
      // optimize
      if(datedData[0] && datedData[0].x && datedData[0].y) {
        setLifetimeDate(datedData[0].x[0]);
        for(let i = 0; i < datedData[0].x.length; i++) {
          const tempDate = new Date(datedData[0].x[i]);
          if(tempDate > dateRange[1] || tempDate < dateRange[0]) {
            datedData[0].x.splice(i, 1);
            datedData[0].y.splice(i, 1);
            i--;
          }
        }
      }
      setChartData(datedData);
    };

    /** Load specific timeseries ids into state when new configurations are loaded */
    useEffect(() => {
      const config =
        batchPlotConfigurationsItemsObject[batchPlotConfigurationsActiveId];
      setTimeseriesId((config || {}).timeseries_id || []);
    }, [
      batchPlotConfigurationsActiveId,
      batchPlotConfigurationsItemsObject,
      setTimeseriesId,
    ]);

    /** Fetch any timeseries measurements not currently in the store for plotting */
    useEffect(() => {
      timeseriesIds.forEach((id) => {
        if (!timeseriesMeasurementsItemsObject[id]) {
          doTimeseriesMeasurementsFetchById({ timeseriesId: id });
        }
      });
    }, [timeseriesIds, doInstrumentTimeseriesSetActiveId]);

    /** Extract specific measurements from the store that relate to our set timeseries */
    useEffect(() => {
      const measurementItems = timeseriesIds.map((id) =>
        timeseriesMeasurementsItems.find((elem) => elem.timeseries_id === id)
      );
      if (measurementItems.every((elem) => !!elem))
        setMeasurements(measurementItems);
    }, [timeseriesIds, timeseriesMeasurementsItems, setMeasurements]);

    /** When we get new measurements, update chart data */
    useEffect(() => generateNewChartData(), [measurements, withPrecipitation]);

    /** When chart data changes, see if there is precip data to adjust plot */
    useEffect(() => {
      if (
        chartData.length &&
        chartData.find((elem) => elem && elem.yaxis === 'y2')
      ) {
        setWithPrecipitation(true);
      } else {
        setWithPrecipitation(false);
      }
      doPrintSetData(chartData, layout);
    }, [chartData, setWithPrecipitation]);

    useEffect(() => {
      if(dateRange[0] && dateRange[1]) {
        if(dateRange[0] < dateRange[1]) {
          generateNewChartData(); 
        } else {
          const fail = {
            level: 'error',
            title: 'Incorrect Date Range',
            message: 'Begin date must be earlier or the same as the end date',
          };
          doNotificationFire(fail);
        }
      }
    }, [dateRange]);

    return (
      <>
        <Chart
          data={chartData}
          layout={layout}
          config={{
            responsive: true,
            displaylogo: false,
            displayModeBar: true,
            scrollZoom: true,
          }}
        />
        {/* @TODO Updates - When API can handle further settings */}
        {chartData.length ? (
          <>
            <hr />
            <ChartSettings
              lifetimeDate={lifetimeDate}
              dateRange={dateRange}
              setDateRange={setDateRange}
              setWithPrecipitation={setWithPrecipitation}
            />
          </>
        ) : null}
      </>
    );
  }
);

export default BatchPlotChart;
