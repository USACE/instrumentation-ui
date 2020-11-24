/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';

import InstrumentForm from './instrument-form';
import InstrumentGroupForm from './instrument-group-form';
import InstrumentGroupTable from './instrument-group-table';
import InstrumentTable from './instrument-table';
import LoginMessage from '../../app-components/login-message';
import Navbar from '../../app-components/navbar';
import Pager from '../../app-components/pager';
import RoleFilter from '../../app-components/role-filter';
import Tab from '../../app-components/tab';

export default connect(
  'selectProjectsByRoute',
  'selectInstrumentGroupsItems',
  'selectInstrumentsItems',
  'doModalOpen',
  ({
    projectsByRoute: project,
    instrumentGroupsItems: groups,
    instrumentsItems: instruments,
    doModalOpen,
  }) => {
    if (!project) return null;

    const [filter, setFilter] = useState('');

    const handleAdd = (title) => {
      title === 'grp'
        ? doModalOpen(InstrumentGroupForm)
        : doModalOpen(InstrumentForm);
    };

    const CommonContent = ({ title }) => (
      <div className='row'>
        <div className='col-10'>
          <div className='form-group'>
            <div className='input-group'>
              <input
                type='text'
                className='form-control'
                placeholder='Filter list...'
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                }}
              />
              <div className='input-group-append'>
                <span
                  title='Clear Filter'
                  className='input-group-text pointer'
                  onClick={() => {
                    setFilter('');
                  }}
                >
                  <i className='mdi mdi-close'></i>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className='col-2'>
          <div className='float-right'>
            <RoleFilter
              allowRoles={[`${project.slug.toUpperCase()}.*`]}
              alt={LoginMessage}
            >
              <button onClick={() => handleAdd(title)} className='btn btn-primary'>
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
          <CommonContent title='grp' />
          <Pager
            itemsKey='groups'
            items={groups.filter((item) => {
              if (!filter) return true;
              return (
                Object.values(item)
                  .join(' ')
                  .toUpperCase()
                  .indexOf(filter.toUpperCase()) !== -1
              );
            })}
          >
            <InstrumentGroupTable />
          </Pager>
        </>
      ),
    }, {
      title: 'All Instruments',
      content: (
        <>
          <CommonContent title='all' />
          <Pager
            itemsKey='instruments'
            items={instruments.filter((item) => {
              if (!filter) return true;
              return (
                Object.values(item)
                  .join(' ')
                  .toUpperCase()
                  .indexOf(filter.toUpperCase()) !== -1
              );
            })}
          >
            <InstrumentTable />
          </Pager>
        </>
      ),
    }];

    return (
      <div>
        <Navbar theme='primary' />
        <section className='container mt-3'>
          <div className='card'>
            <Tab.Container tabs={tabs} tabListClass='card-header pb-0' contentClass='card-body' />
          </div>
        </section>
      </div>
    );
  }
);
