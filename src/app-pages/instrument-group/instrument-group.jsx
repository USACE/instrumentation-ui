import React, { useState, useEffect } from 'react';
import { connect } from 'redux-bundler-react';
import { useDeepCompareEffect } from 'react-use';
import { AddLocationAltOutlined, Circle, Edit, LocationOn } from '@mui/icons-material';

import Button from '../../app-components/button';
import Card from '../../app-components/card';
import InstrumentForm from '../../common/forms/instrument-form';
import InstrumentGroupForm from './instrument-group-form';
import InstrumentPicker from './instrument-picker';
import InstrumentRemove from './instrument-remove';
import LoginMessage from '../../app-components/login-message';
import Map from '../../app-components/classMap';
import RoleFilter from '../../app-components/role-filter';
import Table from '../../app-components/table';
import TimeseriesPanel from './time-series-panel';
import { titlize } from '../../common/helpers/utils';

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
  'selectInstrumentGroupInstrumentsInstruments',
  ({
    doModalOpen,
    doMapsInitialize,
    doMapsShutdown,
    mapsObject,
    projectsByRoute: project,
    instrumentGroupsByRoute: group,
    instrumentGroupInstrumentsInstruments: instruments,
  }) => {
    if (!group) return null;
    const instrumentIds = Object.keys(instruments);

    const [instrumentArray, setInstrumentArray] = useState(instrumentIds.map(id => instruments[id]));
    const [filter, setFilter] = useState('');
    const [filteredInstruments, setFilteredInstruments] = useState(instrumentArray);

    const statusOptions = [...new Set(instrumentArray.map(instrument => titlize(instrument.status)))].map(status => ({ value: status, label: status }));
    const typeOptions = [...new Set(instrumentArray.map(instrument => instrument.type))].map(type => ({ value: type, label: type }));

    useEffect(() => {
      if (filter) {
        setFilteredInstruments(filterItems(filter, instrumentArray));
      } else {
        setFilteredInstruments(instrumentArray);
      }
    }, [filter, instrumentArray, filterItems, setFilteredInstruments]);

    useDeepCompareEffect(() => {
      setInstrumentArray(instrumentIds.map(id => instruments[id]));
    }, [instruments, setInstrumentArray]);

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
                      icon={<Edit fontSize='inherit' sx={{ marginBottom: '2px', marginRight: '2px' }} />}
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
                    icon={<AddLocationAltOutlined fontSize='inherit' sx={{ marginBottom: '2px' }} />}
                  />
                  <Button
                    variant='info'
                    size='small'
                    isOutline
                    text='Add Existing Instrument'
                    handleClick={() => doModalOpen(InstrumentPicker)}
                    icon={<LocationOn fontSize='inherit' sx={{ marginBottom: '2px' }} />}
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
                          <Circle className={`status-icon ${data.status}`} sx={{ fontSize: '14px', margin: '0 8px 2px 0' }} />
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
                          icon={<Edit fontSize='inherit' />}
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
