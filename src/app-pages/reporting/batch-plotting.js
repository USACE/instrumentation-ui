import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';

import BatchPlotChart from './batch-plot-chart';
import ChartSettings from './chart-settings';
import Navbar from '../../app-components/navbar';
import PlottingContext from './plotting-context';

import './reporting.scss';

const BatchPlotting = connect(
  // Add selectors here
  ({
    // reference selectors here
  }) => {
    const [selectedConfiguration, setSelectedConfiguration] = useState(null);

    return (
      <>
        <Navbar theme='primary' fixed />
        <section className='container-fluid page-body'>
          <PlottingContext.Provider value={{ selectedConfiguration, setSelectedConfiguration }}>
            <ChartSettings />
            <BatchPlotChart />
          </PlottingContext.Provider>
        </section>
      </>
    );
  }
);

export default BatchPlotting;
