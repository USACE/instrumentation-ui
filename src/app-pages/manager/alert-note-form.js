import React, { useState } from 'react';
import { format } from 'date-fns';

import { ModalFooter, ModalHeader } from '../../app-components/modal';

const AlertNoteForm = ({ item }) => {
  const { name, body, create_date, note = '' } = item;

  const [noteValue, setNoteValue] = useState(note);

  const formattedDate = format(new Date(create_date), 'MMM dd, yyyy HH:mm:ss');

  return (
    <div className='modal-content' style={{ overflowY: 'auto' }}>
      <ModalHeader title='Add Note' />
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
};

export default AlertNoteForm;
