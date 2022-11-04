import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';

import Button from '../../app-components/button';
import Card from '../../app-components/card';
import Icon from '../../app-components/icon';
import RoleFilter from '../../app-components/role-filter';

const NoteEditor = connect(
  'selectInstrumentsByRoute',
  ({ instrumentsByRoute: instrument, note, onSave, onCancel }) => {
    const [id] = useState(note.id || null);
    const [title, setTitle] = useState(note.title || '');
    const [body, setBody] = useState(note.body || '');

    const handleSave = () => {
      onSave({
        id,
        instrument_id: instrument.id,
        title,
        body,
        time: new Date(),
      });
    };

    return instrument ? (
      <div style={{ margin: '1em', paddingBottom: '1em' }}>
        <div className='form-group'>
          <input
            className='form-control'
            type='text'
            placeholder='Title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <textarea
            className='form-control'
            placeholder='Note...'
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
          />
        </div>
        <div>
          <Button className='mr-2' handleClick={handleSave} text='Save' />
          <Button variant='secondary' handleClick={onCancel} text='Cancel' />
        </div>
      </div>
    ) : null;
  }
);

const NoteItem = ({ note, editable, save }) => {
  const [isEditing, setEditing] = useState(false);
  const date = new Date(note.time);

  return (
    <li className='list-group-item'>
      {isEditing ? (
        <NoteEditor
          note={note}
          onSave={(item) => {
            setEditing(false);
            save(item);
          }}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <>
          <div className='d-flex justify-content-between'>
            <strong>{note.title}</strong>
            <div>
              <small>
                <em>{`${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`}</em>
              </small>
              {editable ? (
                <Button
                  variant='link'
                  size='small'
                  className='ml-2'
                  text='Edit'
                  handleClick={() => setEditing(true)}
                  icon={<Icon icon='pencil' />}
                />
              ) : null}
            </div>
          </div>
          <p style={{ whiteSpace: 'pre-wrap' }}>{note.body}</p>
        </>
      )}
    </li>
  );
};

export default connect(
  'selectProjectsByRoute',
  'selectInstrumentNotesItems',
  'selectAuthEdipi',
  'doInstrumentNotesSave',
  'doInstrumentNotesDelete',
  ({
    projectsByRoute: project,
    instrumentNotesItems: notes,
    authEdipi,
    doInstrumentNotesSave: save,
    doInstrumentNotesDelete: del,
  }) => {
    const [isAdding, setIsAdding] = useState(false);

    const edipi = Number(authEdipi);
    const sorted = notes.sort();

    return (
      project && (
        <Card>
          <Card.Header text='Notes' />
          <ul className='list-group list-group-flush'>
            {sorted.length ? (
              sorted.map((note, i) => (
                <NoteItem
                  key={i}
                  note={note}
                  save={save}
                  del={del}
                  editable={edipi === note.creator}
                />
              ))
            ) : (
              <span className='m-3'>No Notes Added</span>
            )}
            <li className='list-group-item'>
              {isAdding ? (
                <NoteEditor
                  key={'editor'}
                  note={{}}
                  onSave={(newNote) => {
                    setIsAdding(false);
                    save(newNote);
                  }}
                  onCancel={() => setIsAdding(false)}
                />
              ) : (
                <RoleFilter allowRoles={[`${project.slug.toUpperCase()}.*`]}>
                  <Button
                    variant='info'
                    isOutline
                    text='Add New'
                    handleClick={() => setIsAdding(true)}
                  />
                </RoleFilter>
              )}
            </li>
          </ul>
        </Card>
      )
    );
  }
);
