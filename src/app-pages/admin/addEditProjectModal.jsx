import React, { useState } from 'react';

import * as Modal from '../../app-components/modal';
import { connect } from 'redux-bundler-react';
import { TextField } from '@mui/material';

const defaultProject = {
  name: '',
  federal_id: '',
  office_id: '',
};

const validateProjectName = (name, currentProjects = []) => {
  const ret = { isError: false, errorString: '' };

  console.log('test currentProjects:', currentProjects);

  if (!name) {
    ret.isError = true;
    ret.errorString = 'Project Name is required.';
  } else if (currentProjects.find(el => el.name === name)) {
    ret.isError = true;
    ret.errorString = 'Project Name already exists! Please use a new name.';
  }

  return ret;
};

const AddEditProjectModal = connect(
  'doModalClose',
  'doProjectsSave',
  'selectProjectsItems',
  ({
    doModalClose,
    doProjectsSave,
    projectsItems: allProjects,
    isEdit = false,
    project = defaultProject,
  }) => {
    const title = isEdit ? 'Edit Project' : 'Create New Project';
    const [formData, setFormData] = useState(project);
    const { name, federal_id, office_id } = formData;

    const handleSave = () => {
      const payload = isEdit ? formData : ({
        projects: [
          formData,
        ],
      });
      
      doProjectsSave(payload, doModalClose, true);
    };

    const { isError, errorString } = validateProjectName(name, allProjects);

    return (
      <Modal.ModalContent>
        <Modal.ModalHeader title={title} />
        <Modal.ModalBody>
          <TextField
            fullWidth
            required
            error={isError}
            helperText={errorString}
            id='project-name-input'
            variant='outlined'
            label='Project Name'
            value={name}
            onChange={(e) => setFormData(prev =>  ({ ...prev, name: e.target.value }))}
          />
          <TextField
            fullWidth
            id='federal-id-input'
            className='mt-3'
            variant='outlined'
            label='Federal ID'
            value={federal_id}
            onChange={(e) => setFormData(prev => ({ ... prev, federal_id: e.target.value }))}
          />
          <TextField
            fullWidth
            id='office-id-input'
            className='mt-3'
            variant='outlined'
            label='Office ID'
            value={office_id}
            onChange={(e) => setFormData(prev => ({ ... prev, office_id: e.target.value }))}
          />
        </Modal.ModalBody>
        <Modal.ModalFooter
          onSave={() => handleSave()}
          saveIsDisabled={isError}
          showCancelButton
        />
      </Modal.ModalContent>
    )
  },
);

export default AddEditProjectModal;
