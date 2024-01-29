import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';
import { Autocomplete, Checkbox, TextField } from '@mui/material';
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';

import * as Modal from '../../app-components/modal';

const buildProjectOptions = projects => projects.map(p => {
  const { id, name } = p;

  return (id ? {
    name,
    value: id,
  } : null);
}).filter(e => e);

const AssignToProjectsModal = connect(
  'doFetchCurrentAdminProjects',
  'doAssignInstrumentToProject',
  'doRemoveInstrumentFromProject',
  'selectProjectsCurrentAdmin',
  ({
    doFetchCurrentAdminProjects,
    doAssignInstrumentToProject,
    doRemoveInstrumentFromProject,
    projectsCurrentAdmin: projects,
    instrument,
  }) => {
    const { projects: currentAssignments } = instrument;
    const [selectedProjects, setSelectedProjects] = useState(buildProjectOptions(currentAssignments));

    const icon = <CheckBoxOutlineBlank fontSize='small' />;
    const checkedIcon = <CheckBox fontSize='small' />;

    const attemptToSave = (values, reason) => {
      if (reason === 'selectOption') {
        const newValue = values.find(el => !selectedProjects.find(p => p.value === el.value));
        doAssignInstrumentToProject(newValue, (didError) => {
          if (!didError) {
            setSelectedProjects(values);
          }
        });
      } else if (reason === 'removeOption') {
        const valueToRemove = selectedProjects.find(el => !values.find(p => p.value === el.value));
        doRemoveInstrumentFromProject(valueToRemove, (didError) => {
          if (!didError) {
            setSelectedProjects(values);
          }
        });
      }
    };

    useEffect(() => {
      doFetchCurrentAdminProjects({ role: 'admin' });
    }, [doFetchCurrentAdminProjects]);

    return (
      <Modal.ModalContent style={{ overflow: 'visible' }}>
        <Modal.ModalHeader title='Assign Instruments to Additional Projects' />
        <Modal.ModalBody style={{ overflow: 'visible' }}>
          Assigning instruments to another project requires you to be an admin of that project. The multi-select box below contains a list of projects that you are an admin of. 
          If the project is highlighted, then the instrument is already assigned to that project. De-selecting a project will remove the instrument's assignment to that project.
          <b className='d-block mt-1'>Changes take immediate effect upon selection/de-selection.</b>
          <i className='d-block mt-2'>
            Note: if you unassign the instrument from all projects you are an admin of, you will not be able to access this instrument again unless someone 
            else assigns it back to one of your projects.
          </i>
          <hr />
          {projects?.length ? (
            <Autocomplete
              multiple
              disableCloseOnSelect
              limitTags={2}
              id='project-selector'
              onChange={(_e, values, reason) => attemptToSave(values, reason)}
              options={buildProjectOptions(projects)}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              defaultValue={buildProjectOptions(currentAssignments)}
              value={selectedProjects}
              getOptionLabel={(option) => option.name || ''}
              renderOption={(props, option, { selected }) => (
                <li {...props} className='p-0 pl-2'>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  <span className='pointer'>
                    {option.name}
                  </span>
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label='Projects' placeholder='Selected Projects' />
              )}
            />
          ) : (
            <i> Not an admin of any projects.</i>
          )}
        </Modal.ModalBody>
        <Modal.ModalFooter
          showSaveButton={false}
          showCancelButton
          cancelText='Close'
        />
      </Modal.ModalContent>
    );
  },
);

export default AssignToProjectsModal;
