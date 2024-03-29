import React from 'react';
import { Button } from '@mui/material';
import { connect } from 'redux-bundler-react';
import { DateTime } from 'luxon';

import DeleteConfirm from '../../app-components/delete-confirm';
import AddEditProjectModal from './addEditProjectModal';

const ProjectDetails = connect(
  'doModalOpen',
  'doProjectsDelete',
  'selectDistricts',
  ({
    doModalOpen,
    doProjectsDelete,
    districts,
    project,
    setSelectedProject,
  }) => {
    const { _raw, title, img, href, instrumentCount } = project;
    const {
      create_date,
      creator_username,
      update_date,
      updater_username,
      federal_id,
      district_id,
    } = _raw;

    const currentDistrict = districts.find(el => el.id === district_id);

    return (
      <div className='row'>
        <div className='col-3'>
          <img src={img} />
          <br />
          <Button
            disabled
            size='small'
            variant='outlined'
            className='mt-2'
          >
            Upload New Image
          </Button>
        </div>
        <div className='col-9 border-left'>
          <h5>Project Details</h5>
          <span className='d-block'><b>Name: </b><a href={href}>{title}</a></span>
          <span className='d-block'><b>Federal ID: </b>{federal_id ?? <i>None</i>}</span>
          <span className='d-block'><b>District ID: </b>{district_id ? `${currentDistrict.name} / ${district_id}` : <i>None</i>}</span>
          <span className='d-block'><b># of Assigned Instruments: </b>{instrumentCount}</span>
          <hr />
          <span className='d-block'><b>Created On: </b>{DateTime.fromISO(create_date).toLocaleString(DateTime.DATETIME_SHORT)}</span>
          <span className='d-block'><b>Created By: </b>{creator_username}</span>
          <span className='d-block'><b>Updated On: </b>{update_date ? DateTime.fromISO(update_date).toLocaleString(DateTime.DATETIME_SHORT) : <i>Not Updated</i>}</span>
          <span className='d-block'><b>Updated By: </b>{updater_username ?? <i>Not Updated</i>}</span>
          <hr />
          <Button
            color='info'
            variant='outlined'
            className='mr-2'
            onClick={() => doModalOpen(AddEditProjectModal, { isEdit: true, project: _raw, currentDistrict }, 'md')}
          >
            Edit Project
          </Button>
          <DeleteConfirm
            className='float-right'
            deleteText='DELETE PROJECT'
            cancelText='CANCEL'
            confirmText='CONFIRM'
            handleDelete={() => {
              setSelectedProject('');
              doProjectsDelete(_raw);
            }}
          />
        </div>
      </div>
    );
  }
);

export default ProjectDetails;
