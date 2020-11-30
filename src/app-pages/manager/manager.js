/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';

import CollectionGroupTable from './collection-group-table';
import CollectionGroupForm from './collection-group-form';
import InstrumentForm from './instrument-form';
import InstrumentGroupForm from './instrument-group-form';
import InstrumentGroupTable from './instrument-group-table';
import InstrumentTable from './instrument-table';
import LoginMessage from '../../app-components/login-message';
import Navbar from '../../app-components/navbar';
import Pager from '../../app-components/pager';
import RoleFilter from '../../app-components/role-filter';
import SearchBar from '../home/search-bar';
import Tab from '../../app-components/tab';

const filterItems = (filter, items) => {
  const filtered = items.filter((item) => {
    return Object.values(item)
      .join(' ')
      .toUpperCase()
      .indexOf(filter.toUpperCase()) !== -1
  });

  return filtered;
};

export default connect(
  'selectProjectsByRoute',
  'selectInstrumentGroupsItems',
  'selectInstrumentsItems',
  'selectCollectionGroupItems',
  'doModalOpen',
  ({
    projectsByRoute: project,
    instrumentGroupsItems: groups,
    instrumentsItems: instruments,
    collectionGroupItems: collectionGroups,
    doModalOpen,
  }) => {
    if (!project) return null;

    const [filter, setFilter] = useState('');
    const [form, setForm] = useState('Instrument Groups');
    const forms = {
      'Instrument Groups': InstrumentGroupForm,
      'All Instruments': InstrumentForm,
      'Collection Groups': CollectionGroupForm,
    };
    const data = {
      'Instrument Groups': filterItems(filter, groups),
      'All Instruments': filterItems(filter, instruments),
      'Collection Groups': filterItems(filter, collectionGroups),
    }

    const handleAdd = () => {
      doModalOpen(forms[form]);
    };

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
              <button onClick={() => handleAdd()} className='btn btn-primary'>
                Add New
              </button>
            </RoleFilter>
          </div>
        </div>
      </div>
    );

    const tabs = [{
      title: 'Instrument Groups',
      content: (
        <>
          {commonContent()}
          <Pager
            itemsKey='groups'
            items={data[form]}
          >
            <InstrumentGroupTable />
          </Pager>
        </>
      ),
    }, {
      title: 'All Instruments',
      content: (
        <>
          {commonContent()}
          <Pager
            itemsKey='instruments'
            items={data[form]}
          >
            <InstrumentTable />
          </Pager>
        </>
      ),
    }, {
      title: 'Collection Groups',
      content: (
        <>
          {commonContent()}
          <Pager
            itemsKey="collectionGroups"
            items={data[form]}
          >
            <CollectionGroupTable />
          </Pager>
        </>
      )
    }];

    return (
      <>
        <Navbar theme='primary' />
        <div className='container mt-3'>
          <div className='card'>
            <Tab.Container
              tabs={tabs}
              onTabChange={(title) => { setForm(title); setFilter(''); }}
              tabListClass='card-header pb-0'
              contentClass='card-body'
            />
          </div>
        </div>
      </>
    );
  }
);
