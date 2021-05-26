import React from 'react';
import { connect } from 'redux-bundler-react';

import Badge from '../../../../app-components/badge';
import Button from '../../../../app-components/button';
import Card from '../../../../app-components/card';
import Dropdown from '../../../../app-components/dropdown';
import Icon from '../../../../app-components/icon';
import InstrumentGroupForm from '../../../group/instrument-group-form';
import RoleFilter from '../../../../app-components/role-filter';

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
      <Card.Body className='mx-3 my-1' hasPaddingVertical={false} hasPaddingHorizontal={false}>
        {groups.length ? (
          <table className='table dashboard-table'>
            <thead>
              <tr className='row'>
                <th className='col-4'>Name</th>
                <th className='col-3'>
                  <span className='float-right'>Instrument Count</span>
                </th>
                {/* <th className='col-3'>
                  <span className='float-right'>Last Measurement</span>
                </th> */}
                {/* Temp */}
                <th className='col-3'>
                  <span className='float-right'>Timeseries Count</span>
                </th>
                <th className='col-2 pl-3'>Tools</th>
              </tr>
            </thead>
            <tbody>
              {groups.map(group => (
                <tr key={group.id} className='row'>
                  <td className='col-4'>
                    <a href={`/${project.slug}/groups/${group.slug}`}>
                      {group.name}
                    </a>
                  </td>
                  <td className='col-3'>
                    <span className='float-right'>{group.instrument_count}</span>
                  </td>
                  {/* <td className='col-3'>
                    <span className='float-right'>Some Time Ago</span>
                  </td> */}
                  {/* vvv Temp vvv */}
                  <td className='col-3'>
                    <span className='float-right'>{group.timeseries_count}</span>
                  </td>
                  <td className='col-2 pl-3'>
                    <RoleFilter allowRoles={[`${project.slug.toUpperCase()}.*`]}>
                      <Button
                        isOutline
                        size='small'
                        variant='info'
                        title='Edit'
                        handleClick={() => doModalOpen(InstrumentGroupForm, { item: group })}
                        icon={<Icon icon='pencil' />}
                      />
                    </RoleFilter>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <NoGroupsDisplay doModalOpen={doModalOpen} project={project} />}
      </Card.Body>
    </Card>
  )
);

export default InstrumentGroupCard;
