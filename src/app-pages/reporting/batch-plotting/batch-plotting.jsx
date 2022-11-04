import React from 'react';
import { connect } from 'redux-bundler-react';

import BatchPlotChart from './batch-plot-chart';
import Card from '../../../app-components/card';
import DataConfiguration from './data-configuration';
import Icon from '../../../app-components/icon';
import Map from '../../../app-components/classMap';

import '../reporting.scss';

const BatchPlotting = connect(
  'doMapsInitialize',
  'doMapsShutdown',
  'selectMapsObject',
  'selectHashQuery',
  ({ doMapsInitialize, doMapsShutdown, mapsObject, hashQuery }) => {
    const crossSectionReady = import.meta.env.VITE_CROSS_SECTION;
    const userConfigId = hashQuery ? hashQuery['c'] : '';

    return (
      <>
        <section className='container-fluid page-body'>
          <Card className='w-100'>
            <Card.Header text='Plot Data Configuration' />
            <DataConfiguration initialConfigurationId={userConfigId} />
          </Card>
          <div className='row mt-4'>
            <div
              className={`${crossSectionReady ? 'col col-sm-5' : 'col-sm-12'}`}
            >
              <Card style={{ minHeight: '400px' }}>
                <Card.Body>
                  <Map
                    mapKey='batchPlotMap'
                    doMapsInitialize={doMapsInitialize}
                    doMapsShutdown={doMapsShutdown}
                    mapsObject={mapsObject}
                  />
                </Card.Body>
              </Card>
            </div>
            {crossSectionReady && (
              <div className='col col-sm-7'>
                <Card className='h-100'>
                  <Card.Header text='Cross Section' />
                  <Card.Body isContentCentered>
                    <div className='text-muted pt-4'>
                      <Icon
                        icon='account-hard-hat'
                        style={{ fontSize: '64px' }}
                      />
                      <h5>Currently Under Construction</h5>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            )}
          </div>
          <Card className='w-100 my-4'>
            <Card.Header text='Plot' />
            <BatchPlotChart />
          </Card>
        </section>
      </>
    );
  }
);

export default BatchPlotting;
