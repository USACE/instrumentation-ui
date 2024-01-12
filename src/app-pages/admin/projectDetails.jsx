import React from 'react';
import { Button } from '@mui/material';
import { DateTime } from 'luxon';

import DeleteConfirm from '../../app-components/delete-confirm';

const ProjectDetails = ({ project }) => {
  const { _raw, title, img, href, instrumentCount } = project;
  const {
    create_date,
    creator,
    update_date,
    updater,
    federal_id,
    office_id,
  } = _raw;

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
        <span className='d-block'><b>Office ID: </b>{office_id ?? <i>None</i>}</span>
        <span className='d-block'><b># of Assigned Instruments: </b>{instrumentCount}</span>
        <hr />
        <span className='d-block'><b>Created On: </b>{DateTime.fromISO(create_date).toLocaleString(DateTime.DATETIME_SHORT)}</span>
        <span className='d-block'><b>Created By: </b>{creator}</span>
        <span className='d-block'><b>Updated On: </b>{update_date ? DateTime.fromISO(update_date).toLocaleString(DateTime.DATETIME_SHORT) : <i>Not Updated</i>}</span>
        <span className='d-block'><b>Updated By: </b>{updater ?? <i>Not Updated</i>}</span>
        <hr />
        <Button
          color='info'
          variant='outlined'
          className='mr-2'
        >
          Edit Project
        </Button>
        <DeleteConfirm
          className='float-right'
          deleteText='DELETE PROJECT'
          cancelText='CANCEL'
          confirmText='CONFIRM'
          handleDelete={() => { console.log('todo'); }}
        />
      </div>
    </div>
  );
};

export default ProjectDetails;
