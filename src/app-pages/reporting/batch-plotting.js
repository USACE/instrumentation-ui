import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';

import Chart from '../../app-components/chart/chart';
import ChartSettings from './chart-settings';
import Navbar from '../../app-components/navbar';

import './reporting.scss';

const BatchPlotting = connect(
  // Add selectors here
  ({
    // reference selectors here
  }) => {
    const [currentValue, setCurrentValue] = useState(null);

    return (
      <>
        <Navbar theme='primary' fixed />
        <section className='container-fluid page-body'>
          <ChartSettings />
          <Chart />
        </section>
      </>
    );
  }
);

export default BatchPlotting;
