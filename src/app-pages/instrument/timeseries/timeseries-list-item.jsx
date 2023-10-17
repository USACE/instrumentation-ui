import React, { useRef } from 'react';
import { connect } from 'redux-bundler-react';
import { Edit } from '@mui/icons-material';

import RoleFilter from '../../../app-components/role-filter';
import TimeseriesForm from './timeseries-form';
import { classnames } from '../../../common/helpers/utils';

export default connect(
  'selectProjectsByRoute',
  'doModalOpen',
  ({ projectsByRoute: project, doModalOpen, item, onClick, active }) => {
    const li = useRef(null);
    const itemClass = classnames({
      'list-group-item': true,
      active: active,
    });

    return (
      item && (
        <li
          ref={li}
          className={itemClass}
          onClick={(e) => {
            if (e.currentTarget === li.current) onClick(item);
          }}
        >
          <RoleFilter allowRoles={[`${project.slug.toUpperCase()}.*`]}>
            <button
              className='float-right btn btn-sm btn-outline-info'
              onClick={(e) => {
                doModalOpen(TimeseriesForm, { item: item, isEdit: true });
              }}
            >
              <Edit fontSize='inherit' />
            </button>
          </RoleFilter>
          <div>{item.name}</div>
          <div>
            <small>{`${item.parameter} in ${item.unit}`}</small>
          </div>
        </li>
      )
    );
  }
);
