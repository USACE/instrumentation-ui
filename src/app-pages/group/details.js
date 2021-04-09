import React from 'react';
import { connect } from 'redux-bundler-react';

import Button from '../../app-components/button';
import Card from '../../app-components/card';
import Icon from '../../app-components/icon';
import InstrumentForm from '../manager/forms/instrument-form';
import InstrumentGroupForm from '../manager/forms/instrument-group-form';
import InstrumentPicker from './instrument-picker';
import InstrumentRemove from './instrument-remove';
import InstrumentTable from '../manager/tabs/instrument-table';
import LoginMessage from '../../app-components/login-message';
import Map from '../../app-components/classMap';
import RoleFilter from '../../app-components/role-filter';
import TimeseriesPanel from './group-time-series-panel';

export default connect(
  'doModalOpen',
  'doMapsInitialize',
  'doMapsShutdown',
  'selectMapsObject',
  'selectProjectsByRoute',
  'selectInstrumentGroupsByRoute',
  'selectInstrumentGroupInstrumentsItems',
  ({
    doModalOpen,
    doMapsInitialize,
    doMapsShutdown,
    mapsObject,
    projectsByRoute: project,
    instrumentGroupsByRoute: group,
    instrumentGroupInstrumentsItems: instruments,
  }) => {
    if (!group) return null;

    return (
      <>
        <section className='container' style={{ marginTop: '6rem' }}>
          <div className='row'>
            <div className='col'>
              <Card style={{ height: '300px' }}>
                <Card.Header
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <strong>{group.name}</strong>&nbsp;
                  <RoleFilter
                    allowRoles={[`${project.slug.toUpperCase()}.*`]}
                    alt={LoginMessage}
                  >
                    <Button
                      variant='info'
                      size='small'
                      isOutline
                      text='Edit'
                      handleClick={() => doModalOpen(InstrumentGroupForm, { item: group })}
                      icon={<Icon icon='pencil' className='pr-2' />}
                    />
                  </RoleFilter>
                </Card.Header>
                <Card.Body>
                  {group.description}
                </Card.Body>
              </Card>
            </div>
            <div className='col'>
              <Card className='h-100'>
                <Card.Body>
                  <Map
                    mapKey='groupMap'
                    mapsObject={mapsObject}
                    doMapsInitialize={doMapsInitialize}
                    doMapsShutdown={doMapsShutdown}
                  />
                </Card.Body>
              </Card>
            </div>
          </div>
        </section>

        <section className='container mt-3'>
          <Card>
            <Card.Header
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <strong>Instruments</strong>
              <RoleFilter allowRoles={[`${project.slug.toUpperCase()}.*`]}>
                <div className='btn-group'>
                  <Button
                    variant='info'
                    size='small'
                    isOutline
                    text='Add New Instrument'
                    handleClick={() => doModalOpen(InstrumentForm, { addToGroup: group, isEdit: false })}
                    icon={<Icon icon='map-marker-plus' className='pr-2' />}
                  />
                  <Button
                    variant='info'
                    size='small'
                    isOutline
                    text='Add Existing Instrument'
                    handleClick={() => doModalOpen(InstrumentPicker)}
                    icon={<Icon icon='map-marker' className='pr-2' />}
                  />
                </div>
              </RoleFilter>
            </Card.Header>
            <Card.Body>
              <InstrumentTable
                instruments={instruments}
                tools={[InstrumentRemove]}
              />
            </Card.Body>
          </Card>
          <TimeseriesPanel />
        </section>
      </>
    );
  }
);
