import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';

import Chart from '../../../app-components/chart/chart';
import ChartSettings from './batch-plot-chart-settings';

const getStyle = _index => ({
  type: 'scatter',
  mode: 'lines+markers',
  marker: {
    size: 8,
  },
  line: {
    width: 2,
  }
});

const BatchPlotChart = connect(
  'doInstrumentTimeseriesSetActiveId',
  'doTimeseriesMeasurementsFetchById',
  'selectBatchPlotConfigurationsActiveId',
  'selectBatchPlotConfigurationsItemsObject',
  'selectInstrumentTimeseriesItemsObject',
  'selectTimeseriesMeasurementsItems',
  'selectTimeseriesMeasurementsItemsObject',
  ({
    doInstrumentTimeseriesSetActiveId,
    doTimeseriesMeasurementsFetchById,
    batchPlotConfigurationsActiveId,
    batchPlotConfigurationsItemsObject,
    instrumentTimeseriesItemsObject,
    timeseriesMeasurementsItems,
    timeseriesMeasurementsItemsObject,
  }) => {
    const [timeseriesIds, setTimeseriesId] = useState([]);
    const [measurements, setMeasurements] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [withPrecipitation, setWithPrecipitation] = useState(false);
    const [dateRange, setDateRange] = useState([]);

    const generateNewChartData = () => {
      const data = measurements.map((elem, i) => {
        if (elem) {
          const style = getStyle(i);
          const { items } = elem;
          const { instrument, name, unit } = instrumentTimeseriesItemsObject[elem.timeseries_id];

          const sortedItems = (items || []).slice().sort((a, b) => new Date(a.time) - new Date(b.time));

          return {
            ...style,
            name: `${instrument} - ${name} (${unit})` || '',
            x: sortedItems.map(item => item.time),
            y: sortedItems.map(item => item.value),
            showlegend: true,
          };
        }

        return null;
      });

      /** Map through each instrument's timeseries labelled as 'Precipitation' */
      // if (withPrecipitation) {
      //   data.push({
      //     type: 'bar',
      //     yaxis: 'y2',
      //     // name: `${instrument} - ${name} (${unit})` || '',
      //     name: 'Precipitation',
      //     x: [new Date('05-21-2020'), new Date('06-22-2020'), new Date('07-21-2020')],
      //     y: [1.2, 1, 1.1],
      //     showlegend: true,
      //   });
      // }

      setChartData(data);
    };

    /** Load specific timeseries ids into state when new configurations are loaded */
    useEffect(() => {
      const config = batchPlotConfigurationsItemsObject[batchPlotConfigurationsActiveId];
      setTimeseriesId((config || {}).timeseries_id || []);
    }, [batchPlotConfigurationsActiveId, batchPlotConfigurationsItemsObject, setTimeseriesId]);

    /** Fetch any timeseries measurements not currently in the store for plotting */
    useEffect(() => {
      timeseriesIds.forEach(id => {
        if (!timeseriesMeasurementsItemsObject[id]) {
          doTimeseriesMeasurementsFetchById({ timeseriesId: id });
        }
      });
    }, [timeseriesIds, doInstrumentTimeseriesSetActiveId]);

    /** Extract specific measurements from the store that relate to our set timeseries */
    useEffect(() => {
      const measurementItems = timeseriesIds.map(id => timeseriesMeasurementsItems.find(elem => elem.timeseries_id === id));
      setMeasurements(measurementItems);
    }, [timeseriesIds, timeseriesMeasurementsItems, setMeasurements]);

    /** When we get new measurements, update chart data */
    useEffect(() => generateNewChartData(), [measurements, withPrecipitation]);

    return (
      <>
        <Chart
          data={chartData}
          layout={{
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
            ...withPrecipitation && {
              yaxis2: {
                autorange: 'reversed',
                showline: true,
                mirror: true,
                domain: [0.66, 1],
              },
            },
            autosize: true,
            dragmode: 'pan',
            height: 600,
          }}
          config={{
            responsive: true,
            displaylogo: false,
            displayModeBar: true,
            scrollZoom: true,
          }}
        />
        <hr />
        <ChartSettings
          dateRange={dateRange}
          setDateRange={setDateRange}
          setWithPrecipitation={setWithPrecipitation}
        />
      </>
    );
  }
);

export default BatchPlotChart;
