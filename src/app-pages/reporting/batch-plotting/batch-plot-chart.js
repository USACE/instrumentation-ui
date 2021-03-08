import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';

import Chart from '../../../app-components/chart/chart';

const getStyle = _index => ({
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

    console.log('test timeseriesMeasurementsItemsObject: ', timeseriesMeasurementsItemsObject);

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

      setChartData(data);
    };

    useEffect(() => {
      const config = batchPlotConfigurationsItemsObject[batchPlotConfigurationsActiveId];
      setTimeseriesId((config || {}).timeseries_id || []);
    }, [batchPlotConfigurationsActiveId, batchPlotConfigurationsItemsObject, setTimeseriesId]);

    useEffect(() => {
      timeseriesIds.forEach(id => doTimeseriesMeasurementsFetchById({ timeseriesId: id }));
    }, [timeseriesIds, doInstrumentTimeseriesSetActiveId]);

    useEffect(() => {
      const measurementItems = timeseriesIds.map(id => timeseriesMeasurementsItems.find(elem => elem.timeseries_id === id));
      setMeasurements(measurementItems);
    }, [timeseriesIds, timeseriesMeasurementsItems, setMeasurements]);

    useEffect(() => generateNewChartData(), [measurements]);

    return (
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
    );
  }
);

export default BatchPlotChart;
