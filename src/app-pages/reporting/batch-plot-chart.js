import React, { useContext, useEffect } from 'react';
import { connect } from 'redux-bundler-react';

import Chart from '../../app-components/chart/chart';
import PlottingContext from './plotting-context';

const BatchPlotChart = connect(
  'selectBatchPlotConfigurationsItems',
  ({
    batchPlotConfigurationsItems,
  }) => {
    const { selectedConfiguration } = useContext(PlottingContext);

    useEffect(() => {
      console.log('selectedConfiguration: ', selectedConfiguration);
      console.log('batchPlotConfigurationsItems: ', batchPlotConfigurationsItems);

      const test = batchPlotConfigurationsItems.find(elem => elem.name === selectedConfiguration);
      console.log('selected timeseries: ', (test || {}).timeseries_id);
    }, [selectedConfiguration, batchPlotConfigurationsItems]);

    return (
      <Chart />
    );
  }
);

export default BatchPlotChart;
