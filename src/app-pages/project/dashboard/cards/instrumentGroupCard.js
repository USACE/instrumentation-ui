import React from 'react';
import { connect } from 'redux-bundler-react';

import Badge from '../../../../app-components/badge';
import Button from '../../../../app-components/button';
import Card from '../../../../app-components/card';
import Dropdown from '../../../../app-components/dropdown';
import Icon from '../../../../app-components/icon';
import RoleFilter from '../../../../app-components/role-filter';
import Table from '../../../../app-components/table';
import { InstrumentGroupForm } from '../../../instrument-group';

import '../../project.scss';

const NoGroupsDisplay = ({ doModalOpen, project }) => (
  <div className='my-3'>
    No Instrument Groups in this project.
    <br />
    <RoleFilter allowRoles={[`${project.slug.toUpperCase()}.*`]}>
      <Button
        isOutline
        size='small'
        variant='info'
        text='Create New Group'
        className='mt-2'
        handleClick={() => doModalOpen(InstrumentGroupForm, { isEdit: false })}
      />
    </RoleFilter>
  </div>
);

const InstrumentGroupCard = connect(
  'doModalOpen',
  'selectProjectsByRoute',
  'selectInstrumentGroupsItems',
  ({
    doModalOpen,
    projectsByRoute: project,
    instrumentGroupsItems: groups,
  }) => (
    <Card className='dashboard-card'>
      <Card.Header>
        <div className='dashboard-card-header'>
          <b>
            Instrument Groups
            <Badge type='pill' variant='secondary' text={groups.length} className='ml-2'/>
          </b>
          <RoleFilter allowRoles={[`${project.slug.toUpperCase()}.*`]}>
            <Dropdown.Menu
              withToggleArrow={false}
              buttonContent={<Icon icon='menu' />}
              buttonClasses={['m-0', 'p-0']}
              menuClasses={['dropdown-menu-right']}
            >
              <Dropdown.Item onClick={() => doModalOpen(InstrumentGroupForm, { isEdit: false })}>
                Create New Group
              </Dropdown.Item>
            </Dropdown.Menu>
          </RoleFilter>
        </div>
      </Card.Header>
      <Card.Body className='mx-2 my-1' hasPaddingVertical={false} hasPaddingHorizontal={false}>
        {groups.length ? (
          <Table
            className='dashboard-table'
            data={groups}
            columns={[{
              key: 'name',
              header: 'Name',
              isSortable: true,
              render: (data) => (
                <a href={`/${project.slug}/groups/${data.slug}`}>
                  {data.name}
                </a>
              ),
            }, {
              key: 'instrument_count',
              isSortable: true,
              isRightAlign: true,
              header: 'Instrument Count',
              render: (data) => <span className='float-right'>{data.instrument_count}</span>,
            }, {
              key: 'timeseries_count',
              isSortable: true,
              isRightAlign: true,
              header: 'Timeseries Count',
              render: (data) => <span className='float-right'>{data.timeseries_count}</span>,
            }, {
              key: 'username',
              header: 'Tools',
              isRightAlign: true,
              render: (data) => (
                <RoleFilter allowRoles={[`${project.slug.toUpperCase()}.*`]}>
                  <Button
                    isOutline
                    size='small'
                    variant='info'
                    title='Edit'
                    className='float-right'
                    handleClick={() => doModalOpen(InstrumentGroupForm, { item: data })}
                    icon={<Icon icon='pencil' />}
                  />
                </RoleFilter>
              )
            }]}
          />
        ) : <NoGroupsDisplay doModalOpen={doModalOpen} project={project} />}
      </Card.Body>
    </Card>
  )
);

export default InstrumentGroupCard;
