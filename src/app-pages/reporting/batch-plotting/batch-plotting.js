import React, { useState } from 'react';

import BatchPlotChart from './batch-plot-chart';
import ChartSettings from './chart-settings';
import Navbar from '../../../app-components/navbar';
import PlottingContext from './plotting-context';

import '../reporting.scss';

const BatchPlotting = () => {
  const [selectedConfiguration, setSelectedConfiguration] = useState(null);

  return (
    <>
      <Navbar theme='primary' fixed />
      <section className='container-fluid page-body'>
        <PlottingContext.Provider value={{ selectedConfiguration, setSelectedConfiguration }}>
          <div className='card w-100'>
            <div className='card-header'>
              <strong>Plot Configuration</strong>
            </div>
            <ChartSettings />
          </div>
          <div className='card w-100 mt-4'>
            <div className='card-header'>
              <strong>Plot</strong>
            </div>
            <BatchPlotChart />
          </div>
        </PlottingContext.Provider>
      </section>
    </>
  );
};

export default BatchPlotting;
