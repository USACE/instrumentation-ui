import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';

import Button from '../../../app-components/button';
import FilterSelect from '../../../app-components/filter-select';
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

    const domainRoles = domainsItemsByGroup.role;
    const { email } = member || {};
    const title = !isEdit ? 'Add New Member' : `Edit Permissions for: ${email}`;

    const handleSave = () => {
      doUsersSaveUser(selectedUser, selectedRole);
    };

    useEffect(() => {
      const newItems = (usersItems || []).map(elem => {
        const { username, email, id } = elem;
  
        return {
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
          <FilterSelect
            items={filterItems}
            onChange={(_, q, val) => {
              setSelectedUser(val);
              doTypeaheadQueryUpdated(q);
            }}
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
          onDelete={isEdit ? () => handleDelete() : undefined}
        />
      </div>
    );
  }
);

export default MemberForm;
