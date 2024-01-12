import React from 'react';
import { connect } from 'redux-bundler-react';
import { Edit, Menu } from '@mui/icons-material';

import Badge from '../../../../app-components/badge';
import Button from '../../../../app-components/button';
import Card from '../../../../app-components/card';
import Dropdown from '../../../../app-components/dropdown';
import RoleFilter from '../../../../app-components/role-filter';
import Table from '../../../../app-components/table';
import { CollectionGroupForm } from '../../../collection-group';

import '../../project.scss';

const NoGroupsDisplay = ({ doModalOpen, project }) => (
  <div className='container-fluid my-3'>
    No Collection Groups in this project.
    <br />
    <RoleFilter allowRoles={[`${project.slug.toUpperCase()}.*`]}>
      <Button
        isOutline
        size='small'
        variant='info'
        text='Create New Group'
        className='mt-2'
        handleClick={() => doModalOpen(CollectionGroupForm, { isEdit: false })}
      />
    </RoleFilter>
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
    <Card className='dashboard-card mt-3'>
      <Card.Header>
        <div className='dashboard-card-header'>
          <b>
            Collection Groups
            <Badge type='pill' variant='secondary' text={collectionGroups.length} className='ml-2'/>
          </b>
          <RoleFilter allowRoles={[`${project.slug.toUpperCase()}.*`]}>
            <Dropdown.Menu
              withToggleArrow={false}
              buttonContent={<Menu fontSize='inherit' />}
              buttonClasses={['m-0', 'p-0']}
              menuClasses={['dropdown-menu-right']}
            >
              <Dropdown.Item onClick={() => doModalOpen(CollectionGroupForm, { isEdit: false })}>Create New Group</Dropdown.Item>
            </Dropdown.Menu>
          </RoleFilter>
        </div>
      </Card.Header>
      <Card.Body className='mx-2 my-1' hasPaddingVertical={false} hasPaddingHorizontal={false}>
        {collectionGroups.length ? (
          <Table
            className='dashboard-table'
            data={collectionGroups}
            columns={[{
              key: 'name',
              header: 'Name',
              render: (data) => (
                <a href={`/${project.slug}/collection-groups/${data.slug}`}>
                  {data.name}
                </a>
              ),
            }, {
              key: 'tools',
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
                    handleClick={() => doModalOpen(CollectionGroupForm, { item: data })}
                    icon={<Edit fontSize='inherit' />}
                  />
                </RoleFilter>
              ),
            }]}
          />
        ) : <NoGroupsDisplay doModalOpen={doModalOpen} project={project} />}
      </Card.Body>
    </Card>
  )
);

export default CollectionGroupCard;
