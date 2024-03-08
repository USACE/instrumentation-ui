import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';
import { subDays } from 'date-fns';

import Chart from '../../../../app-components/chart/chart';
import ChartErrors from '../components/batch-plot-errors';
import ChartSettings from '../components/batch-plot-chart-settings';
import { generateNewChartData } from '../helper';

const BatchPlotChart = connect(
  'doPrintSetData',
  'doInstrumentTimeseriesSetActiveId',
  'doTimeseriesMeasurementsFetchById',
  'doBatchPlotConfigurationsSave',
  'selectBatchPlotConfigurationsActiveId',
  'selectBatchPlotConfigurationsItemsObject',
  'selectTimeseriesMeasurementsItems',
  'selectInstrumentTimeseriesItems',
  ({
    doPrintSetData,
    doInstrumentTimeseriesSetActiveId,
    doTimeseriesMeasurementsFetchById,
    doBatchPlotConfigurationsSave,
    batchPlotConfigurationsActiveId,
    batchPlotConfigurationsItemsObject,
    timeseriesMeasurementsItems,
    instrumentTimeseriesItems,
  }) => {
    const [timeseriesIds, setTimeseriesId] = useState([]);
    const [measurements, setMeasurements] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [dateRange, setDateRange] = useState([subDays(new Date(), 365), new Date()]);
    const [threshold, setThreshold] = useState(3000);
    const [withPrecipitation, setWithPrecipitation] = useState(false);
    const [chartSettings, setChartSettings] = useState({ auto_range: false });

    const layout = {
      xaxis: {
        autorange: chartSettings?.auto_range,
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

    const savePlotSettings = (params) => {
      timeseriesIds.forEach(id => doTimeseriesMeasurementsFetchById({ timeseriesId: id, dateRange, threshold }));
      doBatchPlotConfigurationsSave(...params);
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
      // @TODO: new endpoint: fetch -> batchPlotMeasurements(plotConfigId);
      timeseriesIds.forEach(id => doTimeseriesMeasurementsFetchById({ timeseriesId: id, dateRange, threshold }));
    }, [timeseriesIds, doInstrumentTimeseriesSetActiveId]);

    /** Extract specific measurements from the store that relate to our set timeseries */
    useEffect(() => {
      const measurementItems = timeseriesIds.map(id =>
        timeseriesMeasurementsItems.find(elem => elem.timeseries_id === id)
      );

      setMeasurements(measurementItems);
    }, [timeseriesIds, timeseriesMeasurementsItems, setMeasurements]);

    /** When we get new measurements, update chart data */
    useEffect(() => {
      const newData = generateNewChartData(measurements, instrumentTimeseriesItems, chartSettings);

      setChartData(newData);
    }, [measurements, instrumentTimeseriesItems, withPrecipitation, chartSettings]);

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
          timeseries={instrumentTimeseriesItems}
          plotConfig={batchPlotConfigurationsItemsObject[batchPlotConfigurationsActiveId]}
        />
        {chartSettings ? (
          <>
            <hr />
            <ChartSettings
              chartData={chartData}
              threshold={threshold}
              setThreshold={setThreshold}
              dateRange={dateRange}
              setDateRange={setDateRange}
              chartSettings={chartSettings}
              setChartSettings={setChartSettings}
              savePlotSettings={savePlotSettings}
            />
          </>
        ) : null}
      </>
    );
  }
);

export default BatchPlotChart;
