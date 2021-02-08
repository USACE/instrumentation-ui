import React, { useContext, useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';

import Chart from '../../app-components/chart/chart';
import PlottingContext from './plotting-context';

const BatchPlotChart = connect(
  'doTimeseriesMeasurementsFetchById',
  'doInstrumentTimeseriesSetActiveId',
  'selectTimeseriesMeasurementsItems',
  'selectBatchPlotConfigurationsItems',
  ({
    doTimeseriesMeasurementsFetchById,
    doInstrumentTimeseriesSetActiveId,
    timeseriesMeasurementsItems,
    batchPlotConfigurationsItems,
  }) => {
    const { selectedConfiguration } = useContext(PlottingContext);
    const [timeseriesIds, setTimeseriesId] = useState([]);
    const [measurements, setMeasurements] = useState([]);

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

    useEffect(() => {
      console.log('current measurements: ', measurements);
    }, [measurements]);

    return (
      <Chart />
    );
  }
);

export default BatchPlotChart;
