import React, { useRef } from "react";
import { connect } from "redux-bundler-react";

import Button from "../../../app-components/button";
import ConstantForm from "./constant-form";
import RoleFilter from "../../../app-components/role-filter";
import { classnames } from "../../../utils";

export default connect(
  "selectProjectsByRoute",
  "doModalOpen",
  ({ projectsByRoute: project, doModalOpen, item, onClick, active }) => {
    if (!item) return null;

    const li = useRef(null);
    const itemClass = classnames({
      "list-group-item": true,
      active,
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
          <Button
            variant='info'
            size='small'
            className='float-right'
            isOutline
            handleClick={() => doModalOpen(ConstantForm, { item: item })}
            icon={<i className='mdi mdi-pencil' />}
          />
        </RoleFilter>
        <div>{item.name}</div>
        <div>
          <small>{`${item.parameter} in ${item.unit}`}</small>
        </div>
      </li>
    );
  }
);
