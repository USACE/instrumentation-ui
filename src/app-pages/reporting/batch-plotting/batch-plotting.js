import React from 'react';
import { connect } from 'redux-bundler-react';

import BatchPlotChart from './batch-plot-chart';
import DataConfiguration from './data-configuration';
import Icon from '../../../app-components/icon';
import Map from '../../../app-components/classMap';
import Navbar from '../../../app-components/navbar';

import '../reporting.scss';

const BatchPlotting = connect(
  'doMapsInitialize',
  'doMapsShutdown',
  'selectMapsObject',
  ({
    doMapsInitialize,
    doMapsShutdown,
    mapsObject,
  }) => (
    <>
      <Navbar theme='primary' fixed />
      <section className='container-fluid page-body'>
        <div className='card w-100'>
          <div className='card-header'>
            <strong>Plot Data Configuration</strong>
          </div>
          <DataConfiguration />
        </div>
        <div className='row mt-4'>
          <div className='col col-sm-5'>
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
          <div className='col col-sm-7'>
            <div className='card h-100'>
              <div className='card-header'>
                <strong>Cross Section</strong>
              </div>
              <div className='card-body'>
                <div className='text-center text-muted pt-4'>
                  <Icon icon='account-hard-hat' style={{ fontSize: '64px' }} />
                  <h5>Currently Under Construction</h5>
                </div>
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
      </section>
    </>
  )
);

export default BatchPlotting;
