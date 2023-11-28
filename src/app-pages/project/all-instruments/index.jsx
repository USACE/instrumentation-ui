import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';
import { Circle, Edit } from '@mui/icons-material';

import Button from '../../../app-components/button';
import Card from '../../../app-components/card';
import InstrumentForm from '../../../common/forms/instrument-form';
import LoginMessage from '../../../app-components/login-message';
import RoleFilter from '../../../app-components/role-filter';
import SearchBar from '../../home/search-bar';
import Table from '../../../app-components/table';
import { titlize } from '../../../common/helpers/utils';

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
  'selectProjectsByRoute',
  'selectInstrumentsItems',
  'doModalOpen',
  ({
    projectsByRoute: project,
    instrumentsItems: instruments,
    doModalOpen,
  }) => {
    const [filter, setFilter] = useState('');
    const [filteredInstruments, setFilteredInstruments] = useState(instruments);

    const statusOptions = [...new Set(instruments.map(instrument => titlize(instrument.status)))].map(status => ({ value: status, label: status }));
    const typeOptions = [...new Set(instruments.map(instrument => instrument.type))].map(type => ({ value: type, label: type }));

    const commonContent = () => (
      <div className='row'>
        <div className='col-10'>
          <SearchBar value={filter} onChange={e => setFilter(e)} placeholder='Filter List...' />
        </div>
        <div className='col-2'>
          <div className='float-right'>
            <RoleFilter
              allowRoles={[`${project.slug.toUpperCase()}.*`]}
              alt={LoginMessage}
            >
              <button onClick={() => doModalOpen(InstrumentForm, { isEdit: false })} className='btn btn-primary'>
                Add New
              </button>
            </RoleFilter>
          </div>
        </div>
      </div>
    );

    useEffect(() => {
      if (filter) {
        setFilteredInstruments(filterItems(filter, instruments));
      } else {
        setFilteredInstruments(instruments);
      }
    }, [filter, instruments, filterItems, setFilteredInstruments]);

    return (
      <div className='container'>
        <Card>
          <Card.Body>
            {commonContent()}
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
                        className='mr-3'
                        handleClick={() => doModalOpen(InstrumentForm, { item: data })}
                        icon={<Edit fontSize='inherit' />}
                      />
                    </RoleFilter>
                  )
                },
              ]}
            />
          </Card.Body>
        </Card>
      </div>
    );
  }
);
