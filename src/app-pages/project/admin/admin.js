import React from 'react';
import { connect } from 'redux-bundler-react';

import Badge from '../../../app-components/badge';
import Button from '../../../app-components/button';
import Card from '../../../app-components/card';
import Dropdown from '../../../app-components/dropdown';
import Icon from '../../../app-components/icon';
import MemberForm from './memberForm';

const AdminPage = connect(
  'doModalOpen',
  'selectDomainsItemsByGroup',
  'selectProfileActive',
  'selectProjectMembersItems',
  ({
    doModalOpen,
    domainsItemsByGroup,
    profileActive: profile,
    projectMembersItems: members,
  }) => {
    // console.log('test members:', members);
    const domainRoles = domainsItemsByGroup.role;

    // console.log('test domainRoles:', domainRoles);

    return (
      <div className='container-fluid'>
        <Card className='m-2'>
          <Card.Header className='d-flex justify-content-between'>
            <b>Current Project Members
              <Badge type='pill' variant='secondary' text={members.length} className='ml-2'/>
            </b>
            {/* <Dropdown.Menu
              withToggleArrow={false}
              buttonContent={<Icon icon='dots-vertical' />}
              buttonClasses={['m-0', 'p-0']}
              menuClasses={['dropdown-menu-right']}
            >
              <Dropdown.Item onClick={() => doModalOpen(MemberForm, { isEdit: false })}>Add New Member</Dropdown.Item>
            </Dropdown.Menu> */}
          </Card.Header>
          <Card.Body>
            {members.length ? (
              <table className='table'>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Tools</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map(member => (
                    <tr key={member.profile_id}>
                      <td>{member.username}</td>
                      <td>{member.email}</td>
                      <td>{member.role}</td>
                      <td>
                        <Button
                          variant='danger'
                          size='small'
                          isOutline
                          icon={<Icon icon='trash-can-outline' />}
                          isDisabled
                          // handleClick={() => doModalOpen(MemberForm, { member, isEdit: true })}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p>No Members in this Project</p>}
          </Card.Body>
        </Card>
      </div>
    );
  }
);

export default AdminPage;
