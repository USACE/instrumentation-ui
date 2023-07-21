import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';
import Select from 'react-select';

import Button from '../../../app-components/button';
import { ModalHeader, ModalFooter } from '../../../app-components/modal';

const MemberForm = connect(
  'doTypeaheadQueryUpdated',
  'doUsersSaveUser',
  'selectUsersItems',
  'selectDomainsItemsByGroup',
  ({
    doTypeaheadQueryUpdated,
    doUsersSaveUser,
    usersItems,
    domainsItemsByGroup,
    member = null,
    isEdit = false,
  }) => {
    const [filterItems, setFilterItems] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);

    const { email } = member || {};
    const domainRoles = domainsItemsByGroup.role;
    const title = !isEdit ? 'Add New Member' : `Edit Permissions for: ${email}`;

    const handleSave = () => {
      doUsersSaveUser(selectedUser, selectedRole);
    };

    useEffect(() => {
      const newItems = (usersItems || []).map(elem => {
        const { username, email, id } = elem;
  
        return {
          label: `${username} | ${email}`,
          text: `${username} | ${email}`,
          value: id,
        };
      });

      setFilterItems(newItems);
    }, [usersItems, setFilterItems]);

    return (
      <div className='modal-content' style={{ overflow: 'visible' }}>
        <ModalHeader title={title} />
        <div className='m-3'>
          <Select
            options={filterItems}
            onChange={newVal => setSelectedUser(newVal?.value)}
            onInputChange={input => doTypeaheadQueryUpdated(input)}
          />
        </div>
        {selectedUser && (
          <div className='btn-group mx-5 mb-3'>
            {domainRoles.map(role => {
              const { id, value } = role;

              return (
                <Button
                  key={id}
                  text={value}
                  isActive={selectedRole === id}
                  handleClick={() => setSelectedRole(id)}
                  variant='info'
                  isOutline
                />
              );
            })}
          </div>
        )}
        <ModalFooter
          showCancelButton
          saveIsDisabled={!(selectedUser && selectedRole)}
          saveText={isEdit ? 'Save' : 'Add'}
          onSave={() => handleSave()}
          // @TODO - Delete Member?
          // onDelete={isEdit ? () => handleDelete() : undefined}
        />
      </div>
    );
  }
);

export default MemberForm;
