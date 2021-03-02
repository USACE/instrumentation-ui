import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';

import BatchPlotChart from './batch-plot-chart';
import ChartSettings from './chart-settings';
import Map from '../../../app-components/classMap';
import Navbar from '../../../app-components/navbar';
import PlottingContext from './plotting-context';

import '../reporting.scss';

const BatchPlotting = connect(
  'doMapsInitialize',
  'doMapsShutdown',
  'selectMapsObject',
  ({
    doMapsInitialize,
    doMapsShutdown,
    mapsObject,
  }) => {
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
            <div className='row mt-4'>
              <div className='col'>
                <div className='card' style={{ minHeight: '400px' }}>
                  <div className='card-body'>
                    <Map
                      mapKey='batchPlotMap'
                      doMapsInitialize={doMapsInitialize}
                      doMapsShutdown={doMapsShutdown}
                      mapsObject={mapsObject}
                    />
                  </div>
                </div>
              </div>
              <div className='col'>
                <div className='card h-100'>
                  <div className='card-header'>
                    <strong>Cross Section</strong>
                  </div>
                  <div className='card-body'>
                    <p>Cross section</p>

                  </div>
                </div>
              </div>
            </div>
            <div className='card w-100 my-4'>
              <div className='card-header'>
                <strong>Plot</strong>
              </div>
              <BatchPlotChart />
            </div>
          </PlottingContext.Provider>
        </section>
      </>
    );
  }
);

export default BatchPlotting;
