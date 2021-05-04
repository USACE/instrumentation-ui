import React from 'react';
import { ModalHeader, ModalFooter } from '../../../app-components/modal';
import Select from '../../../app-components/select';

const MemberForm = ({
  member = null,
  isEdit = false,
}) => {
  const { email } = member || {};
  const title = !isEdit ? 'Add New Member' : `Edit Permissions for: ${email}`;

  const handleSave = () => console.log('test saving!');
  const handleDelete = () => console.log('test delete!');

  return (
    <div className='modal-content' style={{ overflowY: 'auto' }}>
      <ModalHeader title={title} />
      <div className='m-3'>
        <Select
          // options=
        />
      </div>
      <ModalFooter
        showCancelButton
        saveText={isEdit ? 'Save' : 'Add'}
        onSave={() => handleSave()}
        onDelete={isEdit ? () => handleDelete() : undefined}
      />
    </div>
  );
};

export default MemberForm;
