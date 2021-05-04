import React from 'react';
import { connect } from 'redux-bundler-react';

export const isUserAllowed = (authGroupRoles, isAdmin, allowRoles = [], denyRoles = []) => {
  // set our default show value, false makes us find an allow role, true makes us deny
  // if you add both allow and deny we first see if you are allowed, then deny overrides
  let showChildren = allowRoles.length > 0 ? false : true;

  // check allow roles, make sure the user has one of the allow roles
  for (var i = 0; i < allowRoles.length; i++) {
    const groupRole = allowRoles[i].split('.');
    const group = groupRole[0];
    const role = groupRole[1];
    if (authGroupRoles[group] && authGroupRoles[group].length) {
      if (role === '*' || authGroupRoles[group].indexOf(role) !== -1) {
        showChildren = true;
        break;
      }
    }
  }

  // check deny roles, if the user has one, then nope
  for (var y = 0; y < denyRoles.length; y++) {
    const groupRole = denyRoles[y].split('.');
    const group = groupRole[0];
    const role = groupRole[1];
    if (authGroupRoles[group] && authGroupRoles[group].length) {
      if (role === '*' || authGroupRoles[group].indexOf(role) !== -1) {
        showChildren = false;
        break;
      }
    }
  }

  if (isAdmin) showChildren = true;

  return showChildren;
};

export default connect(
  'selectAuthGroupRoles',
  'selectProfileActive',
  ({
    authGroupRoles,
    profileActive: profile,
    allowRoles = [],
    denyRoles = [],
    alt = null,
    children,
  }) => {
    const { is_admin } = profile;
    const showChildren = isUserAllowed(authGroupRoles, is_admin, allowRoles, denyRoles);

    if (showChildren) {
      return <>{children}</>;
    } else {
      const Alt = alt ? alt : null;
      return Alt ? <Alt /> : null;
    }
  }
);
