import React from 'react';
import { connect } from 'redux-bundler-react';

import Button from '../../../app-components/button';
import ConstantForm from './constant-form';
import Icon from '../../../app-components/icon';
import RoleFilter from '../../../app-components/role-filter';
import { classArray } from '../../../utils';

export default connect(
  'doModalOpen',
  'selectProjectsByRoute',
  ({
    doModalOpen,
    projectsByRoute: project,
    item,
    onClick,
    active,
  }) => {
    const { id, name, parameter, unit } = item || {};

    const itemClass = classArray([
      'list-group-item',
      'pointer',
      active && 'active',
    ]);

    return (
      item ? (
        <li
          className={itemClass}
          onClick={() => onClick(id)}
        >
          <RoleFilter allowRoles={[`${project.slug.toUpperCase()}.*`]}>
            <Button
              variant='info'
              size='small'
              className='float-right'
              isOutline
              handleClick={() => doModalOpen(ConstantForm, { item })}
              icon={<Icon icon='pencil' />}
            />
          </RoleFilter>
          <div>{name}</div>
          <div>
            <small>{`${parameter} in ${unit}`}</small>
          </div>
        </li>
      ) : null
    );
  }
);
