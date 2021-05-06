import React from 'react';
import { connect } from 'redux-bundler-react';

export const isUserAllowed = (profileRoles, isAdmin, allowRoles = [], denyRoles = []) => {
  // If there are no profile roles, user shouldn't be here
  if (!profileRoles) return false;
  if (isAdmin) return true;

  // set our default show value, false makes us find an allow role, true makes us deny
  // if you add both allow and deny we first see if you are allowed, then deny overrides
  let showChildren = allowRoles.length > 0 ? false : true;

  // check allow roles, make sure the user has one of the allow roles
  for (var i = 0; i < allowRoles.length; i++) {
    const groupRole = allowRoles[i].split('.');
    const group = groupRole[0];
    const role = groupRole[1];

    if (profileRoles[group] && profileRoles[group].length) {
      if (role === '*' || profileRoles[group].indexOf(role) !== -1) {
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
    if (profileRoles[group] && profileRoles[group].length) {
      if (role === '*' || profileRoles[group].indexOf(role) !== -1) {
        showChildren = false;
        break;
      }
    }
  }

  return showChildren;
};

export default connect(
  'selectProfileRolesObject',
  'selectProfileIsAdmin',
  ({
    profileRolesObject,
    profileIsAdmin,
    allowRoles = [],
    denyRoles = [],
    alt = null,
    children,
  }) => {
    const showChildren = isUserAllowed(profileRolesObject, profileIsAdmin, allowRoles, denyRoles);

    if (showChildren) {
      return <>{children}</>;
    } else {
      const Alt = alt ? alt : null;
      return Alt ? <Alt /> : null;
    }
  }
);
