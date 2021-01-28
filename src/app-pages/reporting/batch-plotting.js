import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';

import Chart from '../../app-components/chart/chart';
import MultiSelect from '../../app-components/multi-select';
import Navbar from '../../app-components/navbar';

const formatOptions = timeseries => (
  timeseries.map(ts => ({
    text: `${ts.instrument} - ${ts.name}`,
    value: ts.id,
  })).sort((a, b) => (
    a.text < b.text
      ? -1
      : a.text > b.text
        ? 1
        : 0
  ))
);

const ChartSettings = connect(
  'selectInstrumentTimeseriesItemsByRoute',
  ({
    instrumentTimeseriesItemsByRoute: timeseries,
  }) => {
    const options = formatOptions(timeseries);

    return (
      <>
        <MultiSelect options={options} onChange={val => console.log(val)} />
      </>
    );
  }
);

const BatchPlotting = connect(
  // Add selectors here
  ({
    // reference selectors here
  }) => {
    const [currentValue, setCurrentValue] = useState(null);

    return (
      <>
        <Navbar theme='primary' fixed />
        <section className='container-fluid' style={{ marginTop: '6rem', position: 'relative' }}>
          <ChartSettings />
          <Chart />
        </section>
      </>
    );
  }
);

export default BatchPlotting;
