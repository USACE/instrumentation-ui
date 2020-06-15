import React, { useState } from "react";
import { connect } from "redux-bundler-react";

const NoteEditor = connect(
  "selectInstrumentsByRoute",
  ({ instrumentsByRoute: instrument, note, onSave, onCancel }) => {
    const [title, setTitle] = useState(note.title || "");
    const [body, setBody] = useState(note.body || "");
    const handleSave = () => {
      onSave({
        instrument_id: instrument.id,
        title,
        body,
        time: new Date(),
      });
    };
    return (
      <div style={{ margin: "1em", paddingBottom: "1em" }}>
        <div className="field">
          <div className="control">
            <input
              className="input"
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="field">
          <div className="control">
            <textarea
              className="textarea"
              placeholder="Note..."
              value={body}
              onChange={(e) => {
                setBody(e.target.value);
              }}
              lines={4}
            />
          </div>
        </div>
        <div>
          <button className="button is-primary mr-2" onClick={handleSave}>
            Save
          </button>
          <button className="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    );
  }
);

const NoteItem = ({ note }) => {
  // eslint-disable-next-line no-unused-vars
  const [isEditing, setEditing] = useState(false);
  const date = new Date(note.time);
  return (
    <div className="panel-block">
      {isEditing ? (
        <NoteEditor note={note} />
      ) : (
        <div style={{ width: "100%", marginBottom: "1.5rem" }}>
          <div className="level" style={{ marginBottom: "0.5rem" }}>
            <div className="level-left">
              <div className="level-item">
                <strong>{note.title}</strong>
              </div>
            </div>
            <div className="level-right">
              <div className="level-item">
                <em>{`${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`}</em>
              </div>
            </div>
          </div>
          <p style={{ whiteSpace: "pre-wrap" }}>{note.body}</p>
        </div>
      )}
    </div>
  );
};

export default connect(
  "selectInstrumentNotesItems",
  "doInstrumentNotesSave",
  "doInstrumentNotesDelete",
  ({
    instrumentNotesItems: notes,
    doInstrumentNotesSave: save,
    doInstrumentNotesDelete: del,
  }) => {
    const [isAdding, setAdding] = useState(false);
    const sorted = notes.sort();
    return (
      <>
        {sorted.map((note, i) => {
          return <NoteItem key={i} note={note} />;
        })}
        {isAdding ? (
          <NoteEditor
            key={"editor"}
            note={{}}
            onSave={(newNote) => {
              setAdding(false);
              save(newNote);
            }}
            onCancel={() => {
              setAdding(false);
            }}
          />
        ) : (
          <div className="panel-block">
            <button
              className="button is-primary"
              onClick={() => {
                setAdding(true);
              }}
            >
              Add New
            </button>
          </div>
        )}
      </>
    );
  }
);
