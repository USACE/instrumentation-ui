import React, { useEffect, useState } from 'react';
import { Autocomplete, Button, TextField } from '@mui/material';
import { connect } from 'redux-bundler-react';

import AddEditProjectModal from './addEditProjectModal';
import Card from '../../app-components/card';
import ProjectDetails from './projectDetails';
import RoleFilter from '../../app-components/role-filter';

const buildProjectOptions = projects => 
  projects.map(p => ({
    label: p.title,
    id: p.id,
  }));

const AdminPage = connect(
  'doModalOpen',
  'doFetchDistricts',
  'selectProjectsItemsWithLinks',
  ({
    doModalOpen,
    doFetchDistricts,
    projectsItemsWithLinks: projects,
  }) => {
    const [selectedProject, setSelectedProject] = useState('');

    useEffect(() => {
      doFetchDistricts();
    }, [doFetchDistricts]);

    return (
      <RoleFilter alt={() => (
        <span className='container-fluid'>
          You do not have access to this resource. Click <a href='/'>here</a> to navigate back to the home screen.
        </span>
      )}>
        <div className='container-fluid'>
          <Card>
            <Card.Header text='Project Management' />
            <Card.Body>
              Search and select a project to manage or click the <b>New Project</b> button to create a new project.
              <div className='row mt-3'>
                <div className='col-10'>
                  <Autocomplete
                    disablePortal
                    id='admin-project-search'
                    options={buildProjectOptions(projects)}
                    renderInput={params => <TextField {...params} label='Select a Project...' />}
                    isOptionEqualToValue={(opt, val) => opt.id === val.id}
                    onChange={(_e, val) => setSelectedProject(val ? val.id : '')}
                  />
                </div>
                <div className='col-2 border-left'>
                  <Button
                    variant='outlined'
                    color='success'
                    onClick={() => doModalOpen(AddEditProjectModal, {}, 'md')}
                  >
                    New Project
                  </Button>
                </div>
              </div>
              {!!selectedProject && (
                <>
                  <hr />
                  <ProjectDetails project={projects.find(p => p.id === selectedProject)} setSelectedProject={setSelectedProject} />
                </>
              )}
            </Card.Body>
          </Card>
        </div>
      </RoleFilter>
    );
  }
);

export default AdminPage;
