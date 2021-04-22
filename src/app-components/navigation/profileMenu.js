import React from 'react';
import { connect } from 'redux-bundler-react';

import Dropdown from '../dropdown';

const getInitials = (name = '') => {
  let initials = ['U', 'N'];
  let parts = name.split('.');
  if (parts[1] && parts[1][0]) initials[0] = parts[1][0];
  if (parts[0] && parts[0][0]) initials[1] = parts[0][0];
  return initials.join('');
};

const ProfileMenu = connect(
  'selectAuthTokenPayload',
  ({ authTokenPayload: user }) => (
    <Dropdown.Menu
      dropdownClasses={['nav-item']}
      menuClasses={['dropdown-menu-right']}
      customContent={
        <span
          style={{ border: '2px solid green', borderRadius: '2em' }}
          className='nav-link ml-2'
          id='navbarDropdownMenuLink'
          role='button'
        >
          {`${getInitials(user.name)}`}
        </span>
      }
    >
      <Dropdown.Item href='/profile'>My Profile</Dropdown.Item>
      <Dropdown.Item href='/logout'>
        Logout
        <small className='d-block'>Currently logged in as {user.name}</small>
      </Dropdown.Item>
    </Dropdown.Menu>
  )
);

export default ProfileMenu;
