import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';

import { format } from 'date-fns';

const AlertNoteForm = connect(
  'doModalClose',
  ({ doModalClose, item }) => {
    const { name, body, create_date, note = '' } = item;

    const [noteValue, setNoteValue] = useState(note);

    const formattedDate = format(new Date(create_date), 'MMM dd, yyyy HH:mm:ss');

    return (
      <div className='modal-content' style={{ overflowY: 'auto' }}>
        <header className='modal-header'>
          <h5 className='modal-title'>Add Note</h5>
          <span className='close pointer text-primary' onClick={doModalClose}>&times;</span>
        </header>
        <div className='m-3 form'>
          <p>
            <strong>Alert Name: &nbsp;</strong>
            {name}
          </p>
          <p>
            <strong>Triggered At: &nbsp;</strong>
            {formattedDate}
          </p>
          <p><i>{body}</i></p>
          <hr />
          <textarea className='form-control' value={noteValue} onChange={(e) => setNoteValue(e.target.value)} />
          <hr />
          <button className='btn btn-primary mr-2' title='Save' onClick={() => { console.log('save note'); doModalClose(); }}>Save</button>
          <button className='btn btn-secondary' title='Cancel' onClick={() => doModalClose()}>Cancel</button>
        </div>
      </div>
    )
  }
);

export default AlertNoteForm;
