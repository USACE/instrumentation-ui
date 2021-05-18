import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';

import { ModalContent, ModalHeader, ModalFooter } from '../../../app-components/modal';

const MemberDeleteForm = connect(
  'doModalClose',
  ({
    doModalClose,
    member = null,
    isEdit = false,
  }) => {
    const { username, email, role, role_id } = member || {};
    const defaultState = role_id.reduce((accum, id) => ({
      ...accum,
      [id]: { isSelected: true },
    }), {});

    const [selectedCheckboxes, setSelectedCheckboxes] = useState(defaultState);

    const toggleCheckbox = id => {
      setSelectedCheckboxes(prevState => ({
        ...prevState,
        [id]: { isSelected: !prevState[id].isSelected },
      }));
    };

    const handleDelete = () => {};

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
                  className={`list-group-item pointer ${selectedCheckboxes[id].isSelected ? 'list-group-item-info ' : ''}`}
                  onClick={() => toggleCheckbox(id)}
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
          onDelete={() => handleDelete()}
        />
      </ModalContent>
    );
  }
);

export default MemberDeleteForm;
