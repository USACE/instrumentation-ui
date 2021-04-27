import React from 'react';
import { connect } from 'redux-bundler-react';

import Button from '../../../app-components/button';
import Card from '../../../app-components/card';
import Icon from '../../../app-components/icon';
import InstrumentGroupForm from '../../group/instrument-group-form';
import RoleFilter from '../../../app-components/role-filter';

const InstrumentGroupCard = connect(
  'doModalOpen',
  'selectProjectsByRoute',
  'selectInstrumentGroupsItems',
  ({
    doModalOpen,
    projectsByRoute: project,
    instrumentGroupsItems: groups,
  }) => (
    <Card>
      <Card.Header text='Instrument Groups' />
      <Card.Body>
        <table className='table dashboard-table'>
          <thead>
            <tr>
              <th className='col-3'>Name</th>
              <th className='col-3'>Instrument Count</th>
              <th className='col-3'>Last Measurement</th>
              <th className='col-3'>Tools</th>
            </tr>
          </thead>
          <tbody>
            {groups.map(group => (
              <tr key={group.id}>
                <td className='col-3'>
                  <a href={`/${project.slug}/groups/${group.slug}`}>
                    {group.name}
                  </a>
                </td>
                <td className='col-3'>
                  Some X Value
                </td>
                <td className='col-3'>
                  Some Time ago
                </td>
                <td className='col-3'>
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
      </Card.Body>
    </Card>
  )
);

export default InstrumentGroupCard;
