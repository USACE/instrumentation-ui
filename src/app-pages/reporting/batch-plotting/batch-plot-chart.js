import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';
import { subDays } from 'date-fns';

import Chart from '../../../app-components/chart/chart';
import ChartErrors from './batch-plot-errors';
import ChartSettings from './batch-plot-chart-settings';
import { generateNewChartData } from './helper';

const BatchPlotChart = connect(
  'doPrintSetData',
  'doInstrumentTimeseriesSetActiveId',
  'doTimeseriesMeasurementsFetchById',
  'doBatchPlotConfigurationsSave',
  'selectBatchPlotConfigurationsActiveId',
  'selectBatchPlotConfigurationsItemsObject',
  'selectTimeseriesMeasurementsItems',
  'selectInstrumentTimeseriesItemsByRoute',
  ({
    doPrintSetData,
    doInstrumentTimeseriesSetActiveId,
    doTimeseriesMeasurementsFetchById,
    doBatchPlotConfigurationsSave,
    batchPlotConfigurationsActiveId,
    batchPlotConfigurationsItemsObject,
    timeseriesMeasurementsItems,
    instrumentTimeseriesItemsByRoute,
  }) => {
    const [timeseriesIds, setTimeseriesId] = useState([]);
    const [measurements, setMeasurements] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [dateRange, setDateRange] = useState([subDays(new Date(), 365), new Date()]);
    const [withPrecipitation, setWithPrecipitation] = useState(false);
    const [chartSettings, setChartSettings] = useState({ autorange: false });

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

    /** Fetch the timeseries measurements in regards to date range */
    useEffect(() => {
      timeseriesIds.forEach(id => doTimeseriesMeasurementsFetchById({ timeseriesId: id, dateRange }));
    }, [timeseriesIds, dateRange, doInstrumentTimeseriesSetActiveId]);

    /** Extract specific measurements from the store that relate to our set timeseries */
    useEffect(() => {
      const measurementItems = timeseriesIds.map(id =>
        timeseriesMeasurementsItems.find(elem => elem.timeseries_id === id)
      );

      setMeasurements(measurementItems);
    }, [timeseriesIds, timeseriesMeasurementsItems, setMeasurements]);

    /** When we get new measurements, update chart data */
    useEffect(
      () => {
        const newData = generateNewChartData(measurements, instrumentTimeseriesItemsByRoute, chartSettings);

        setChartData(newData);
      },
      [measurements, instrumentTimeseriesItemsByRoute, withPrecipitation, chartSettings]
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

    return (
      <>
        <Chart
          withOverlay
          data={chartData}
          layout={layout}
          config={{
            responsive: true,
            displaylogo: false,
            displayModeBar: true,
            scrollZoom: true,
          }}
        />
        <ChartErrors
          chartData={chartData}
          timeseries={instrumentTimeseriesItemsByRoute}
          plotConfig={batchPlotConfigurationsItemsObject[batchPlotConfigurationsActiveId]}
        />
        {chartSettings ? (
          <>
            <hr />
            <ChartSettings
              dateRange={dateRange}
              setDateRange={setDateRange}
              chartSettings={chartSettings}
              setChartSettings={setChartSettings}
              savePlotSettings={doBatchPlotConfigurationsSave}
            />
          </>
        ) : null}
      </>
    );
  }
);

export default BatchPlotChart;
