import React, { useState, useEffect } from 'react';
import { connect } from 'redux-bundler-react';

import { ModalContent, ModalHeader, ModalFooter } from '../../../app-components/modal';

const MemberDeleteForm = connect(
  'doUsersDeleteUser',
  ({
    doUsersDeleteUser,
    member = null,
  }) => {
    const { profile_id, username, email, role, role_id } = member || {};
    const defaultState = role_id.reduce((accum, id) => ({
      ...accum,
      [id]: { isSelected: true },
    }), {});

    const [selectedRoles, setSelectedRoles] = useState(defaultState);
    const [selectedCount, setSelectedCount] = useState(role_id.length);

    const toggleActive = id => {
      setSelectedRoles(prevState => ({
        ...prevState,
        [id]: { isSelected: !prevState[id].isSelected },
      }));
    };

    useEffect(() => {
      const ids = Object.keys(selectedRoles);
      const count = ids.filter(id => selectedRoles[id].isSelected).length;

      setSelectedCount(count);
    }, [selectedCount, setSelectedCount, selectedRoles, setSelectedRoles]);

    const handleDelete = () => {
      const ids = Object.keys(selectedRoles);
      const roles = ids.filter(id => selectedRoles[id].isSelected);

      roles.forEach(role => {
        doUsersDeleteUser(profile_id, role);
      });
    };

    return (
      <ModalContent>
        <ModalHeader title='Remove User' />
        <div className='m-3'>
          <div className='row'>
            <h5 className='col-2'>User:</h5>
            <p className='col-10 text-primary'>{username}</p>
          </div>
          <div className='row'>
            <h5 className='col-2'>Email:</h5>
            <p className='col-10 text-primary'>{email}</p>
          </div>
          <hr />
          <p className='text-primary'>
            Select the roles to remove from this user.
            <ul className='list-group my-2'>
              {role_id.map((id, index) => (
                <li
                  key={id}
                  className={`list-group-item pointer ${selectedRoles[id].isSelected ? 'list-group-item-info ' : ''}`}
                  onClick={() => toggleActive(id)}
                >
                  {role[index]}
                </li>
              ))}
            </ul>
          </p>
        </div>
        <ModalFooter
          showSaveButton={false}
          showCancelButton
          deleteText={`Delete (${selectedCount})`}
          onDelete={selectedCount ? () => handleDelete() : undefined}
        />
      </ModalContent>
    );
  }
);

export default MemberDeleteForm;
