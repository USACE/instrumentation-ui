import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';

import Card from '../../app-components/card';
import CollectionGroupTable from './tabs/collection-group-table';
import CollectionGroupForm from './forms/collection-group-form';
import InstrumentForm from './forms/instrument-form';
import InstrumentGroupForm from './forms/instrument-group-form';
import InstrumentGroupTable from './tabs/instrument-group-table';
import InstrumentTable from './tabs/instrument-table';
import LoginMessage from '../../app-components/login-message';
import RoleFilter from '../../app-components/role-filter';
import SearchBar from '../home/search-bar';
import Tab from '../../app-components/tab';

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
    };

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
          <InstrumentGroupTable groups={data[form]} />
        </>
      ),
    }, {
      title: 'All Instruments',
      content: (
        <>
          {commonContent()}
          <InstrumentTable instruments={data[form]} />
        </>
      ),
    }, {
      title: 'Collection Groups',
      content: (
        <>
          {commonContent()}
          <CollectionGroupTable collectionGroups={data[form]} />
        </>
      )
    }];

    return (
      <>
        <div className='container mt-3'>
          <Card>
            <Tab.Container
              tabs={tabs}
              onTabChange={(title) => { setForm(title); setFilter(''); }}
              tabListClass='card-header pb-0'
              contentClass='card-body'
            />
          </Card>
        </div>
      </>
    );
  }
);
