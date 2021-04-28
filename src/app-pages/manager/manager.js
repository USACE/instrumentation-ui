import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';

import Card from '../../app-components/card';
import InstrumentForm from './forms/instrument-form';
import InstrumentTable from './tabs/instrument-table';
import LoginMessage from '../../app-components/login-message';
import RoleFilter from '../../app-components/role-filter';
import SearchBar from '../home/search-bar';

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
            <InstrumentTable instruments={filteredInstruments} />
          </Card.Body>
        </Card>
      </div>
    );
  }
);
