import React from 'react';
import { connect } from 'redux-bundler-react';

import Button from '../../../app-components/button';
import Card from '../../../app-components/card';
import CollectionGroupForm from '../../collectiongroup/collection-group-form';
import Icon from '../../../app-components/icon';
import RoleFilter from '../../../app-components/role-filter';

import '../project.scss';

const CollectionGroupCard = connect(
  'doModalOpen',
  'selectProjectsByRoute',
  'selectCollectionGroupItems',
  ({
    doModalOpen,
    projectsByRoute: project,
    collectionGroupItems: collectionGroups,
  }) => (
    <Card className='mt-4'>
      <Card.Header text='Collection Groups' />
      <Card.Body hasPaddingVertical={false}>
        <table className='table dashboard-table'>
          <thead>
            <tr>
              <th className='col-9'>Name</th>
              <th className='col-3 pl-3'>Tools</th>
            </tr>
          </thead>
          <tbody>
            {(collectionGroups || []).map(group => (
              <tr key={group.id}>
                <td className='col-9'>
                  <a href={`/${project.slug}/collection-groups/${group.slug}`}>
                    {group.name}
                  </a>
                </td>
                <td className='col-3 pl-3'>
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
      </Card.Body>
    </Card>
  )
);

export default CollectionGroupCard;
