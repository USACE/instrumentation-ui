import { setDate } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';
import { subDays, parseISO, format } from 'date-fns';

import Chart from '../../../app-components/chart/chart';
import ChartSettings from './batch-plot-chart-settings';
import { generateNewChartData } from './helper';

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
    const [measurements, setMeasurements] = useState([{}]);
    const [chartData, setChartData] = useState([{}]);
    const [lifetimeDate, setLifetimeDate] = useState([]);
    const [dateRange, setDateRange] = useState([subDays(new Date(), 365), new Date()]);
    const [withPrecipitation, setWithPrecipitation] = useState(false);
    const [chartSettings, setChartSettings] = useState({ autorange: false, });

    const layout = {
      xaxis: {
        autorange: chartSettings?.autorange,
        range: dateRange,
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

    /** Load specific timeseries ids into state when new configurations are loaded */
    useEffect(() => {
      const config = batchPlotConfigurationsItemsObject[batchPlotConfigurationsActiveId];
      setTimeseriesId((config || {}).timeseries_id || []);
      setChartSettings(config);
    }, [
      batchPlotConfigurationsActiveId,
      batchPlotConfigurationsItemsObject,
      setTimeseriesId,
      setChartSettings,
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
        timeseriesMeasurementsItems.find(elem => elem.timeseries_id === id)
      );
      if (measurementItems.every((elem) => !!elem))
        setMeasurements(measurementItems);
    }, [timeseriesIds, timeseriesMeasurementsItems, setMeasurements]);

    /** When we get new measurements, update chart data */
    useEffect(
      () => generateNewChartData(measurements, chartSettings),
      [measurements, withPrecipitation, chartSettings]
    );

    /** When chart data changes, see if there is precip data to adjust plot */
    useEffect(() => {
      if (
        chartData.length &&
        chartData.find(elem => elem?.yaxis === 'y2')
      ) {
        setWithPrecipitation(true);
      } else {
        setWithPrecipitation(false);
      }
      doPrintSetData(chartData, layout);
    }, [chartData, setWithPrecipitation]);

    useEffect(() => {
      if (dateRange[0] && dateRange[1]) {
        if (dateRange[0] < dateRange[1]) {
          generateNewChartData(measurements, chartSettings); 
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
              // setWithPrecipitation={setWithPrecipitation}
              chartSettings={chartSettings || {}}
              setChartSettings={setChartSettings}
            />
          </>
        ) : null}
      </>
    );
  }
);

export default BatchPlotChart;
