import React from 'react';
import { connect } from 'redux-bundler-react';

import Badge from '../../../app-components/badge';
import Card from '../../../app-components/card';
import DeleteConfirm from '../../../app-components/delete-confirm';
import Dropdown from '../../../app-components/dropdown';
import Icon from '../../../app-components/icon';
import MemberForm from './memberForm';

const AdminPage = connect(
  'doModalOpen',
  'doUsersDeleteUser',
  'selectDomainsItemsByGroup',
  'selectProfileActive',
  'selectProjectMembersItems',
  ({
    doModalOpen,
    doUsersDeleteUser,
    projectMembersItems: members,
  }) => (
    <div className='container-fluid'>
      <Card className='m-2'>
        <Card.Header className='d-flex justify-content-between'>
          <b>Current Project Members
            <Badge type='pill' variant='secondary' text={members.length} className='ml-2'/>
          </b>
          <Dropdown.Menu
            withToggleArrow={false}
            buttonContent={<Icon icon='dots-vertical' />}
            buttonClasses={['m-0', 'p-0']}
            menuClasses={['dropdown-menu-right']}
          >
            <Dropdown.Item onClick={() => doModalOpen(MemberForm, { isEdit: false })}>Add New Member</Dropdown.Item>
          </Dropdown.Menu>
        </Card.Header>
        <Card.Body className='mx-3'>
          {members.length ? (
            <table className='table'>
              <thead>
                <tr className='row'>
                  <th className='col-3'>Name</th>
                  <th className='col-4'>Email</th>
                  <th className='col-2'>Role</th>
                  <th className='col-3'>Tools</th>
                </tr>
              </thead>
              <tbody>
                {members.map(member => {
                  const { profile_id, username, email, role, role_id } = member;
                  return (
                    <tr key={profile_id} className='row'>
                      <td className='col-3'>{username}</td>
                      <td className='col-4'>{email}</td>
                      <td className='col-2'>{role}</td>
                      <td className='col-3'>
                        <DeleteConfirm
                          size='small'
                          isOutline
                          deleteText=''
                          deleteIcon={<Icon icon='trash-can-outline' />}
                          handleDelete={() => doUsersDeleteUser(profile_id, role_id)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : <p>No Members in this Project</p>}
        </Card.Body>
      </Card>
    </div>
  )
);

export default AdminPage;
