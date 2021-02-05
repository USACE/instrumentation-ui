import React, { useContext } from 'react';

import Chart from '../../app-components/chart/chart';
import PlottingContext from './plotting-context';

const BatchPlotChart = () => {
  const { selectedConfiguration, setSelectedConfiguration } = useContext(PlottingContext);

  return (
    <Chart />
  );
};

export default BatchPlotChart;
