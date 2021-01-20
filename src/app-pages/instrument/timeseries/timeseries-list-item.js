import React, { useRef } from 'react';
import { connect } from 'redux-bundler-react';
import { classnames } from '../../../utils';
import RoleFilter from '../../../app-components/role-filter';
import TimeseriesForm from './timeseries-form';

export default connect(
  'selectProjectsByRoute',
  'doModalOpen',
  ({ projectsByRoute: project, doModalOpen, item, onClick, active }) => {
    const li = useRef(null);
    if (!item) return null;
    const itemClass = classnames({
      'list-group-item': true,
      active: active,
    });
    return (
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
            onClick={() => {
              doModalOpen(TimeseriesForm, { item: item });
            }}
          >
            <i className='mdi mdi-pencil'></i>
          </button>
        </RoleFilter>
        <div>{item.name}</div>
        <div>
          <small>{`${item.parameter} in ${item.unit}`}</small>
        </div>
      </li>
    );
  }
);
