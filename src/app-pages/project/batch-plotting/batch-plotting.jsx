import React from 'react';
import { connect } from 'redux-bundler-react';
import { Engineering } from '@mui/icons-material';

import BatchPlotChart from './tab-content/batch-plot-chart';
import Card from '../../../app-components/card';
import DataConfiguration from './components/data-configuration';
import DepthChart from './tab-content/depth-chart';
import Map from '../../../app-components/classMap';
import TabContainer from '../../../app-components/tab/tabContainer';

import './batch-plotting.scss';

const BatchPlotting = connect(
  'doMapsInitialize',
  'doMapsShutdown',
  'selectMapsObject',
  'selectHashQuery',
  ({ doMapsInitialize, doMapsShutdown, mapsObject, hashQuery }) => {
    const crossSectionReady = import.meta.env.VITE_CROSS_SECTION === 'true';
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
                      <Engineering sx={{ fontSize: '64px', marginTop: '64px' }} />
                      <h5>Currently Under Construction</h5>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            )}
          </div>
          <Card className='w-100 my-4 p-3'>
            <TabContainer
              tabs={[
                {
                  title: 'Batch Plot Chart',
                  content: <BatchPlotChart />,
                }, {
                  title: 'Depth Based Plot',
                  content: <DepthChart />
                },
              ]}
            />
          </Card>
        </section>
      </>
    );
  }
);

export default BatchPlotting;
