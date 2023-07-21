import React from 'react';
import { connect } from 'redux-bundler-react';
import { DeleteOutlined, Menu } from '@mui/icons-material';

import Badge from '../../../app-components/badge';
import Button from '../../../app-components/button';
import Card from '../../../app-components/card';
import DeleteConfirm from '../../../app-components/delete-confirm';
import Dropdown from '../../../app-components/dropdown';
import Table from '../../../app-components/table';
import MemberDeleteForm from './memberDeleteForm';
import MemberForm from './memberForm';

const AdminPage = connect(
  'doModalOpen',
  'doUsersDeleteUser',
  'selectDomainsItemsByGroup',
  'selectProfileActive',
  'selectMembersObject',
  ({
    doModalOpen,
    doUsersDeleteUser,
    membersObject: members,
  }) => {
    const memberKeys = Object.keys(members);
    const membersById = memberKeys.map(key => members[key]);
  
    return (
      <div className='container-fluid'>
        <Card className='m-2'>
          <Card.Header className='d-flex justify-content-between'>
            <b>Current Project Members
              <Badge type='pill' variant='secondary' text={memberKeys.length} className='ml-2'/>
            </b>
            <Dropdown.Menu
              withToggleArrow={false}
              buttonContent={<Menu fontSize='inherit' />}
              buttonClasses={['m-0', 'p-0']}
              menuClasses={['dropdown-menu-right']}
            >
              <Dropdown.Item onClick={() => doModalOpen(MemberForm, { isEdit: false })}>Add New Member</Dropdown.Item>
            </Dropdown.Menu>
          </Card.Header>
          <Card.Body className='mx-3'>
            {memberKeys.length ? (
              <Table
                data={membersById}
                columns={[
                  {
                    key: 'username',
                    header: 'Name',
                    isSortable: true,
                  }, {
                    key: 'email',
                    header: 'Email',
                    isSortable: true,
                  }, {
                    key: 'role',
                    header: 'Role',
                    isSortable: true,
                    render: (data) => (
                      <>
                        {data?.role?.sort()?.join(', ')}
                      </>
                    )
                  }, {
                    key: 'tools',
                    header: 'Tools',
                    render: (data) => (
                      <>
                        {data?.role_id?.length > 1 ? (
                          <Button
                            isOutline
                            size='small'
                            title='Delete'
                            variant='danger'
                            icon={<DeleteOutlined fontSize='inherit' />}
                            handleClick={() => doModalOpen(MemberDeleteForm, { member: data })}
                          />
                        ) : (
                          <DeleteConfirm
                            size='small'
                            isOutline
                            deleteText=''
                            deleteIcon={<DeleteOutlined fontSize='inherit' />}
                            handleDelete={() => doUsersDeleteUser(data?.profile_id, data?.role_id[0])}
                          />
                        )}
                      </>
                    )
                  }
                ]}
              />
            ) : <p>No Members in this Project</p>}
          </Card.Body>
        </Card>
      </div>
    );
  }
);

export default AdminPage;
