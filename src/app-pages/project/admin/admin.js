import React from 'react';
import { connect } from 'redux-bundler-react';
import Card from '../../../app-components/card';

const AdminPage = connect(
  'selectDomainsItemsByGroup',
  'selectProfileActive',
  'selectProjectMembersItems',
  ({
    domainsItemsByGroup,
    profileActive: profile,
    projectMembersItems: members,
  }) => {
    console.log('test members:', members);
    const domainRoles = domainsItemsByGroup.role;

    console.log('test domainRoles:', domainRoles);

    return (
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-6'>
            <Card className='m-2'>
              <Card.Header text='All Users' />
              <Card.Body>
                List of Eligible Users
              </Card.Body>
            </Card>
          </div>
          <div className='col-6'>
            <Card className='m-2'>
              <Card.Header text='Current Members' />
              <Card.Body>
                List of Current Members of Project
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    );
  }
);

export default AdminPage;
