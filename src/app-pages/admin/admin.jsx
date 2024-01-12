import React, { useEffect, useState } from 'react';
import { Autocomplete, Button, TextField } from '@mui/material';
import { connect } from 'redux-bundler-react';

import Card from '../../app-components/card';
import ProjectDetails from './projectDetails';

const buildProjectOptions = projects => 
  projects.map(p => ({
    label: p.title,
    id: p.id,
  }));

const AdminPage = connect(
  'selectProjectsItemsWithLinks',
  'selectUsersRaw',
  ({
    projectsItemsWithLinks: projects,
    usersRaw,
  }) => {
    const [selectedProject, setSelectedProject] = useState('');

    return (
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
                  renderInput={params => <TextField {...params} label='Select Project...' />}
                  isOptionEqualToValue={(opt, val) => opt.id === val.id}
                  onChange={(_e, val) => setSelectedProject(val ? val.id : '')}
                />
              </div>
              <div className='col-2 border-left'>
                <Button
                  variant='outlined'
                  color='success'
                >
                  New Project
                </Button>
              </div>
            </div>
            {!!selectedProject && (
              <>
                <hr />
                <ProjectDetails project={projects.find(p => p.id === selectedProject)} />
              </>
            )}
          </Card.Body>
        </Card>
      </div>
    );
  }
);

export default AdminPage;
