import React, { useState, useEffect } from 'react';
import { connect } from 'redux-bundler-react';

import Button from '../../app-components/button';
import Card from '../../app-components/card';
import Icon from '../../app-components/icon';
import InstrumentForm from '../manager/forms/instrument-form';
import InstrumentGroupForm from './instrument-group-form';
import InstrumentPicker from './instrument-picker';
import InstrumentRemove from './instrument-remove';
import LoginMessage from '../../app-components/login-message';
import Map from '../../app-components/classMap';
import RoleFilter from '../../app-components/role-filter';
import Table from '../../app-components/table';
import TimeseriesPanel from './time-series-panel';
import { titlize } from '../../utils';

const filterItems = (filter, items) => {
  const filtered = items.filter(item => (
    Object.values(item)
      .join(' ')
      .toUpperCase()
      .indexOf(filter.toUpperCase()) !== -1
  ));

  return filtered;
};

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

    const [filter, setFilter] = useState('');
    const [filteredInstruments, setFilteredInstruments] = useState(instruments);

    const statusOptions = [...new Set(instruments.map(instrument => titlize(instrument.status)))].map(status => ({ value: status, label: status }));
    const typeOptions = [...new Set(instruments.map(instrument => instrument.type))].map(type => ({ value: type, label: type }));

    useEffect(() => {
      if (filter) {
        setFilteredInstruments(filterItems(filter, instruments));
      } else {
        setFilteredInstruments(instruments);
      }
    }, [filter, instruments, filterItems, setFilteredInstruments]);

    return (
      <>
        <section className='container'>
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
          <TimeseriesPanel />
          <Card className='mt-3 mb-4'>
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
              <Table
                data={filteredInstruments}
                columns={[
                  {
                    key: 'status',
                    header: 'Status',
                    isSortable: true,
                    isFilterable: true,
                    filterOptions: statusOptions,
                    filterFn: 'multi',
                    render: (data) => (
                      data?.status ? (
                        <>
                          <Icon icon='circle' className={`status-icon ${data.status} pr-2`} />
                          {titlize(data.status)}
                        </>
                      ) : null
                    ),
                  }, {
                    key: 'name',
                    header: 'Name',
                    isSortable: true,
                    render: (data) => (
                      <a href={`/${project.slug}/instruments/${data?.slug}`}>
                        {data?.name}
                      </a>
                    ),
                  }, {
                    key: 'type',
                    header: 'Type',
                    isSortable: true,
                    isFilterable: true,
                    filterOptions: typeOptions,
                    filterFn: 'multi',
                  }, {
                    key: 'tools',
                    header: 'Tools',
                    render: (data) => (
                      <RoleFilter allowRoles={[`${project.slug.toUpperCase()}.*`]}>
                        <Button
                          variant='info'
                          size='small'
                          isOutline
                          title='Edit'
                          className='mr-1'
                          handleClick={() => doModalOpen(InstrumentForm, { item: data })}
                          icon={<Icon icon='pencil' />}
                        />
                        <InstrumentRemove item={data} />
                      </RoleFilter>
                    )
                  },
                ]}
              />
            </Card.Body>
          </Card>
        </section>
      </>
    );
  }
);
