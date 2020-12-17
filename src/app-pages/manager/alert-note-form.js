import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';
import { format } from 'date-fns';

import { ModalFooter } from '../../app-components/modal';

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
        <section className='modal-body form'>
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
        </section>
        <ModalFooter
          onSave={() => console.log('save note')}
          showCancelButton
        />
      </div>
    )
  }
);

export default AlertNoteForm;
