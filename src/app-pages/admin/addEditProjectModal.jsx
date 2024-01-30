import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';
import { Autocomplete, TextField } from '@mui/material';

import * as Modal from '../../app-components/modal';

const defaultProject = {
  name: '',
  federal_id: '',
  district_id: '',
};

const buildDistrictOptions = districts =>
  districts.map(d => ({
    label: d.name,
    id: d.id,
  }));

const validateProjectName = (name, currentProjects = [], isEdit, initName) => {
  const ret = { isError: false, errorString: '' };

  if (!name) {
    ret.isError = true;
    ret.errorString = 'Project Name is required.';
  } else if ((isEdit && initName !== name) && currentProjects.find(el => el.name === name)) {
    ret.isError = true;
    ret.errorString = 'Project Name already exists! Please use a new name.';
  }

  return ret;
};

const AddEditProjectModal = connect(
  'doModalClose',
  'doProjectsSave',
  'selectProjectsItems',
  'selectDistricts',
  ({
    doModalClose,
    doProjectsSave,
    projectsItems: allProjects,
    districts,
    isEdit = false,
    project = defaultProject,
    currentDistrict = undefined,
  }) => {
    const title = isEdit ? 'Edit (TBD "Project")' : 'Create New (TBD "Project")';
    const [formData, setFormData] = useState(project);
    const { name: initName } = project;
    const { name, federal_id } = formData;

    const handleSave = () => {
      const { district_id, federal_id } = formData;
      const finalizedFormData = {
        ...formData,
        district_id: district_id ? district_id : null,
        federal_id: federal_id ? federal_id : null,
      };
      const payload = isEdit ? finalizedFormData : [finalizedFormData];
      
      doProjectsSave(payload, doModalClose, true);
    };

    const { isError, errorString } = validateProjectName(name, allProjects, isEdit, initName);

    return (
      <Modal.ModalContent style={{ overflow: 'visible' }}>
        <Modal.ModalHeader title={title} />
        <Modal.ModalBody style={{ overflow: 'visible' }}>
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
          {!!districts?.length && (
            <Autocomplete
              disablePortal
              id='district-search'
              className='mt-3'
              options={buildDistrictOptions(districts)}
              defaultValue={currentDistrict ? { label: currentDistrict.name, id: currentDistrict.id } : undefined}
              renderInput={params => <TextField {...params} label='Select District/Office' />}
              isOptionEqualToValue={(opt, val) => opt.id === val.id}
              onChange={(_e, val) => setFormData(prev => ({ ...prev, district_id: (val ? val.id : '') }))}
            />
          )}
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
