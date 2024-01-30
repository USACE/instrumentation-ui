import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';
import { Edit, Refresh, SettingsOutlined } from '@mui/icons-material';

import AlertEntry from './alert/alert-entry';
import Button from '../../app-components/button';
import Card from '../../app-components/card';
import SaaDepthBasedPlots from './saa-depth-based-plots';
import Dropdown from '../../app-components/dropdown';
import InstrumentDisplay from './instrument-display';
import InstrumentForm from '../../common/forms/instrument-form';
import IpiDepthBasedPlots from './ipi-depth-based-plots';
import LoginMessage from '../../app-components/login-message';
import Map from '../../app-components/classMap';
import NoAlerts from './alert/no-alerts';
import Notes from './notes';
import RoleFilter from '../../app-components/role-filter';
import Settings from './settings';
import SetInitialTimeModal from './setInitialTimeModal';

const sortAlertsByDate = alerts => alerts.sort((a, b) => {
  if (a.create_date > b.create_date) return -1;
  if (b.create_date > a.create_date) return 1;
  return 0;
});

export default connect(
  'doModalOpen',
  'doAlertsFetch',
  'doInstrumentTimeseriesSetActiveId',
  'doNotificationFire',
  'doMapsInitialize',
  'doMapsShutdown',
  'selectMapsObject',
  'selectProjectsByRoute',
  'selectAlertsByRouteByInstrumentId',
  'selectInstrumentsByRoute',
  'selectNonComputedTimeseriesByInstrumentId',
  ({
    doModalOpen,
    doAlertsFetch,
    doInstrumentTimeseriesSetActiveId,
    doNotificationFire,
    doMapsInitialize,
    doMapsShutdown,
    mapsObject,
    projectsByRoute: project,
    instrumentsByRoute: instrument,
    nonComputedTimeseriesByInstrumentId: timeseriesByInstrumentId,
    alertsByRouteByInstrumentId: alerts,
  }) => {
    if (!project || !instrument || !timeseriesByInstrumentId) return (
      <span className='pl-2'>
        The instrument you are trying to access does not exist in this context.
      </span>
    );

    const [notifcationFired, setNotificationFired] = useState(false);

    const timeseries = timeseriesByInstrumentId[instrument.id] || [];
    const isShapeArray = instrument?.type === 'SAA';
    const isIPI = instrument?.type === 'IPI';
    const len = timeseries.length;

    let firstTimeseries = null;
    if (len && len > 0) firstTimeseries = timeseries[0];

    if ((isShapeArray || isIPI) && !notifcationFired && !instrument?.opts?.initial_time) {
      setNotificationFired(true);
      doNotificationFire({
        title: 'Missing Initial Time',
        message: (
          <span>
            No <b>Initial Time</b> set in instrument properties. Depth based plotting will be unusable until set.<br />
            <Button
              isOutline
              size='small'
              variant='info'
              text='Set Initial Time'
              handleClick={() => doModalOpen(SetInitialTimeModal, { type: isShapeArray ? 'saa' : 'ipi'}, 'lg')}
            />
          </span>
        ),
        type: 'warning',
        autoClose: false,
      });
    }

    useEffect(() => {
      if (!len || !firstTimeseries) {
        doInstrumentTimeseriesSetActiveId(null);
      }
      if (firstTimeseries && firstTimeseries.id) {
        doInstrumentTimeseriesSetActiveId(firstTimeseries.id);
      }
    }, [len, firstTimeseries, doInstrumentTimeseriesSetActiveId]);

    return (
      <div className='mb-5'>
        <section className='container-fluid'>
          <div className='row'>
            <div className='col'>
              <Card className='h-100'>
                <Card.Header
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <strong>{instrument.name}</strong>{' '}
                  <RoleFilter
                    allowRoles={[`${project.slug.toUpperCase()}.*`]}
                    alt={LoginMessage}
                  >
                    <Button
                      handleClick={() => doModalOpen(InstrumentForm, { item: instrument })}
                      variant='info'
                      size='small'
                      isOutline
                      text='Edit'
                      icon={<Edit fontSize='inherit' sx={{ marginRight: '3px', marginBottom: '3px' }} />}
                    />
                  </RoleFilter>
                </Card.Header>
                <InstrumentDisplay item={instrument} />
              </Card>
            </div>
            <div className='col'>
              <Card className='h-100'>
                <Card.Header 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <strong>Alerts</strong>
                  <span>
                    <Dropdown.Menu
                      dropdownClasses={['float-right', 'inline']}
                      buttonClasses={['btn-sm', 'btn-outline-info']}
                      buttonContent={<SettingsOutlined fontSize='small' />}
                    >
                      <Dropdown.Item>Filter Instrument Alerts</Dropdown.Item>
                      <Dropdown.Item>Mark All as Read</Dropdown.Item>
                    </Dropdown.Menu>
                    <Button
                      className='float-right mr-2'
                      handleClick={doAlertsFetch}
                      variant='info'
                      size='small'
                      isOutline
                      title='Refresh'
                      icon={<Refresh fontSize='small' />}
                    />
                  </span>
                </Card.Header>
                <Card.Body style={{ maxHeight: 400, overflow: 'auto' }}>
                  <div className='list-group pb-2'>
                    {alerts.length ? sortAlertsByDate(alerts).map((a) => (
                      <AlertEntry key={a.id} item={a} />
                    )) : <NoAlerts />}
                  </div>
                </Card.Body>
              </Card>
            </div>
            <div className='col'>
              <Card className='h-100'>
                <Card.Body>
                  <Map
                    mapKey='instrumentMap'
                    mapsObject={mapsObject}
                    doMapsInitialize={doMapsInitialize}
                    doMapsShutdown={doMapsShutdown}
                  />
                </Card.Body>
              </Card>
            </div>
          </div>
        </section>
        <section className='container-fluid mt-4'>
          <Settings />
        </section>
        {isShapeArray && (
          <section className='container-fluid my-4'>
            <SaaDepthBasedPlots />
          </section>
        )}
        {isIPI && (
          <section className='container-fluid my-4'>
            <IpiDepthBasedPlots />
          </section>
        )}
        <section className='container-fluid my-4'>
          <Notes />
        </section>
      </div>
    );
  }
);
