import React, { useContext, useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';

import Chart from '../../../app-components/chart/chart';
import PlottingContext from './plotting-context';

const getStyle = _index => ({
  mode: 'lines+markers',
  marker: {
    size: 8,
  },
  line: {
    // color: colors[index],
    width: 2,
  }
});

const BatchPlotChart = connect(
  'doTimeseriesMeasurementsFetchById',
  'doInstrumentTimeseriesSetActiveId',
  'selectTimeseriesMeasurementsItems',
  'selectBatchPlotConfigurationsItems',
  'selectInstrumentTimeseriesItemsObject',
  ({
    doTimeseriesMeasurementsFetchById,
    doInstrumentTimeseriesSetActiveId,
    timeseriesMeasurementsItems,
    batchPlotConfigurationsItems,
    instrumentTimeseriesItemsObject,
  }) => {
    const { selectedConfiguration } = useContext(PlottingContext);
    const [timeseriesIds, setTimeseriesId] = useState([]);
    const [measurements, setMeasurements] = useState([]);
    const [chartData, setChartData] = useState([]);

    const generateNewChartData = () => {
      const data = measurements.map((elem, i) => {
        if (elem) {
          const style = getStyle(i);
          const { items = [] } = elem;
          const { name, unit } = instrumentTimeseriesItemsObject[elem.timeseries_id];

          const sortedItems = (items || []).slice().sort((a, b) => b.time - a.time);

          return {
            ...style,
            name: `${name} (${unit})` || '',
            x: sortedItems.map(item => item.time),
            y: sortedItems.map(item => item.value)
          };
        }

        return null;
      });

      setChartData(data);
    };

    useEffect(() => {
      const config = batchPlotConfigurationsItems.find(elem => elem.name === selectedConfiguration);
      setTimeseriesId((config || {}).timeseries_id || []);
    }, [selectedConfiguration, batchPlotConfigurationsItems, setTimeseriesId]);

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
          xaxis: { title: 'Date' },
          yaxis: { title: 'Measurement' }
        }}
      />
    );
  }
);

export default BatchPlotChart;
