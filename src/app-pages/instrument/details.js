import React, { useEffect } from 'react';
import { connect } from 'redux-bundler-react';

import AlertEntry from './alert/alert-entry';
import Button from '../../app-components/button';
import Card from '../../app-components/card';
import Dropdown from '../../app-components/dropdown';
import Icon from '../../app-components/icon';
import InstrumentDisplay from './instrument-display';
import InstrumentForm from '../manager/forms/instrument-form';
import LoginMessage from '../../app-components/login-message';
import Map from '../../app-components/classMap';
import NoAlerts from './alert/no-alerts';
import Notes from './notes';
import RoleFilter from '../../app-components/role-filter';
import Settings from './settings';

const sortAlertsByDate = alerts => alerts.sort((a, b) => {
  if (a.create_date > b.create_date) return -1;
  if (b.create_date > a.create_date) return 1;
  return 0;
});

export default connect(
  'doModalOpen',
  'doAlertsFetch',
  'doInstrumentTimeseriesSetActiveId',
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
    doMapsInitialize,
    doMapsShutdown,
    mapsObject,
    projectsByRoute: project,
    instrumentsByRoute: instrument,
    nonComputedTimeseriesByInstrumentId: timeseriesByInstrumentId,
    alertsByRouteByInstrumentId: alerts,
  }) => {
    if (!project || !instrument || !timeseriesByInstrumentId) return null;

    const timeseries = timeseriesByInstrumentId[instrument.id] || [];
    const len = timeseries.length;
    let firstTimeseries = null;
    if (len && len > 0) firstTimeseries = timeseries[0];
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
                      icon={<Icon icon='pencil' className='pr-2' />}
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
                      buttonContent={<Icon icon='cog-outline' />}
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
                      icon={<Icon icon='refresh' />}
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
        <section className='container-fluid my-4'>
          <Notes />
        </section>
      </div>
    );
  }
);
