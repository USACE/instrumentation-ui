import React from 'react';
import { connect } from 'redux-bundler-react';
import { Edit } from '@mui/icons-material';

import Button from '../../../app-components/button';
import ConstantForm from './constant-form';
import RoleFilter from '../../../app-components/role-filter';
import { classArray } from '../../../common/helpers/utils';

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
              handleClick={() => doModalOpen(ConstantForm, { item, isEdit: true })}
              icon={<Edit fontSize='inherit' />}
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
