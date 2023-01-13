import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';

import { ModalFooter, ModalHeader } from '../../app-components/modal';

export default connect(
  'doModalClose',
  'doInstrumentGroupsSave',
  'doInstrumentGroupsDelete',
  'selectProjectsByRoute',
  ({
    doModalClose,
    doInstrumentGroupsSave,
    doInstrumentGroupsDelete,
    projectsByRoute: project,
    item,
    isEdit = true,
  }) => {
    const [name, setName] = useState((item && item.name) || '');
    const [description, setDesc] = useState((item && item.description) || '');
    const [project_id] = useState((item && item.project_id) || project.id);

    const handleSave = (e) => {
      e.preventDefault();
      doInstrumentGroupsSave(
        Object.assign({}, item, {
          name,
          project_id,
          description,
        }),
        doModalClose,
        true
      );
    };

    const handleDelete = (e) => {
      e.preventDefault();

      if (item && item.id) {
        doInstrumentGroupsDelete(
          item,
          () => doModalClose(),
          true
        );
      }
    };

    return (
      <div className='modal-content' style={{ overflowY: 'auto' }}>
        <form id='instrument-group-form' onSubmit={handleSave}>
          <ModalHeader title={`${isEdit ? 'Edit' : 'Create'} Instrument Group`} />
          <section className='modal-body'>
            <div className='form-group'>
              <label>Name</label>
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                className='form-control'
                type='text'
                placeholder='Text input'
              />
            </div>
            <div className='form-group'>
              <label>Description</label>
              <input
                value={description}
                onChange={(e) => {
                  setDesc(e.target.value);
                }}
                className='form-control'
                type='text'
                placeholder='Text input'
              />
            </div>
          </section>
          <ModalFooter
            saveIsSubmit
            customClosingLogic
            onCancel={() => doModalClose()}
            onDelete={handleDelete}
          />
        </form>
      </div>
    );
  }
);
