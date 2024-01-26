import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';

import * as Modal from '../../app-components/modal';
import MultiSelect from '../../app-components/multi-select';

const AssignToProjectsModal = connect(
  // 'selectAuthTokenPayload',
  'doFetchCurrentAdminProjects',
  'selectProjectsCurrentAdmin',
  ({
    // authTokenPayload: user,
    doFetchCurrentAdminProjects,
    projectsCurrentAdmin: projects,
    instrument,
  }) => {
    console.log('test instrument:', instrument);
    const { projects: currentAssignments } = instrument;
    const [selectedProjects, setSelectedProjects] = useState(currentAssignments);
    console.log('test projects:', projects);

    useEffect(() => {
      doFetchCurrentAdminProjects({ role: 'admin' });
    }, [doFetchCurrentAdminProjects]);

    return (
      <Modal.ModalContent style={{ overflow: 'visible' }}>
        <Modal.ModalHeader title='Assign Instruments to Additional Projects' />
        <Modal.ModalBody style={{ overflow: 'visible' }}>
          Assigning instruments to another project requires you to be an admin of that project. The multi-select box below contains a list of projects that you are an admin of. 
          If the project is highlighted, then the instrument is already assigned to that project. De-selecting a project will remove the instrument's assignment to that project.
          <i className='d-block mt-2'>
            Note: if you unassign the instrument from all projects you are an admin of, you will not be able to access this instrument again unless someone 
            else assigns it back to one of your projects.
          </i>
          <hr />
          <MultiSelect
            isFilterable
            withSelectAllOption
            menuClasses='dropdown-menu'
            text={`Select Options (${(selectedProjects || []).length} selected)`}
            options={projects || []}
            onChange={val => setSelectedProjects(val)}
            initialValues={selectedProjects}
          />
          <hr />
          Removing X assignments<br/>
          Adding Y assignments
        </Modal.ModalBody>
        <Modal.ModalFooter
          showCancelButton
          onSave={() => {}}
        />
      </Modal.ModalContent>
    );
  },
);

export default AssignToProjectsModal;
