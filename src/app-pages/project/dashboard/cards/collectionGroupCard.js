import React from 'react';
import { connect } from 'redux-bundler-react';

import Badge from '../../../../app-components/badge';
import Button from '../../../../app-components/button';
import Card from '../../../../app-components/card';
import CollectionGroupForm from '../../../collectiongroup/collection-group-form';
import Dropdown from '../../../../app-components/dropdown';
import Icon from '../../../../app-components/icon';
import RoleFilter from '../../../../app-components/role-filter';

import '../../project.scss';

const NoGroupsDisplay = ({ doModalOpen }) => (
  <div className='my-3'>
    No Collection Groups in this project.
    <br />
    <Button
      isOutline
      size='small'
      variant='info'
      text='Create New Group'
      className='mt-2'
      handleClick={() => doModalOpen(CollectionGroupForm, { isEdit: false })}
    />
  </div>
);

const CollectionGroupCard = connect(
  'doModalOpen',
  'selectProjectsByRoute',
  'selectCollectionGroupItems',
  ({
    doModalOpen,
    projectsByRoute: project,
    collectionGroupItems: collectionGroups,
  }) => (
    <Card className='dashboard-card mt-4'>
      <Card.Header>
        <div className='dashboard-card-header'>
          <b>
            Collection Groups
            <Badge type='pill' variant='secondary' text={collectionGroups.length} className='ml-2'/>
          </b>
          <Dropdown.Menu
            withToggleArrow={false}
            buttonContent={<Icon icon='menu' />}
            buttonClasses={['m-0', 'p-0']}
            menuClasses={['dropdown-menu-right']}
          >
            <Dropdown.Item onClick={() => doModalOpen(CollectionGroupForm, { isEdit: false })}>Create New Group</Dropdown.Item>
          </Dropdown.Menu>
        </div>
      </Card.Header>
      <Card.Body className='mx-3 my-1' hasPaddingVertical={false}>
        {collectionGroups.length ? (
          <table className='table dashboard-table'>
            <thead>
              <tr className='row'>
                <th className='col-10'>Name</th>
                <th className='col-2 pl-3'>Tools</th>
              </tr>
            </thead>
            <tbody>
              {collectionGroups.map(group => (
                <tr key={group.id} className='row'>
                  <td className='col-10'>
                    <a href={`/${project.slug}/collection-groups/${group.slug}`}>
                      {group.name}
                    </a>
                  </td>
                  <td className='col-2 pl-3'>
                    <RoleFilter allowRoles={[`${project.slug.toUpperCase()}.*`]}>
                      <Button
                        isOutline
                        size='small'
                        variant='info'
                        title='Edit'
                        handleClick={() => doModalOpen(CollectionGroupForm, { item: group })}
                        icon={<Icon icon='pencil' />}
                      />
                    </RoleFilter>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <NoGroupsDisplay doModalOpen={doModalOpen} />}
      </Card.Body>
    </Card>
  )
);

export default CollectionGroupCard;
