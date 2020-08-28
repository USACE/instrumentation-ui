import React, { useState } from "react";
import { connect } from "redux-bundler-react";
import RoleFilter from "../../app-components/role-filter";

const NoteEditor = connect(
  "selectInstrumentsByRoute",
  ({ instrumentsByRoute: instrument, note, onSave, onCancel }) => {
    if (!instrument) return null;
    const [id] = useState(note.id || null);
    const [title, setTitle] = useState(note.title || "");
    const [body, setBody] = useState(note.body || "");
    const handleSave = () => {
      onSave({
        id,
        instrument_id: instrument.id,
        title,
        body,
        time: new Date(),
      });
    };
    return (
      <div style={{ margin: "1em", paddingBottom: "1em" }}>
        <div className="form-group">
          <input
            className="form-control"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>
        <div className="form-group">
          <textarea
            className="form-control"
            placeholder="Note..."
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
            }}
            rows={5}
          />
        </div>
        <div>
          <button className="btn btn-primary mr-2" onClick={handleSave}>
            Save
          </button>
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    );
  }
);

const NoteItem = ({ note, editable, save, del }) => {
  const [isEditing, setEditing] = useState(false);
  const date = new Date(note.time);
  return (
    <li className="list-group-item">
      {isEditing ? (
        <NoteEditor
          note={note}
          onSave={(item) => {
            setEditing(false);
            save(item);
          }}
          onCancel={() => {
            setEditing(false);
          }}
        />
      ) : (
        <>
          <div className="d-flex justify-content-between">
            <strong>{note.title}</strong>
            <div>
              <small>
                <em>{`${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`}</em>
              </small>
              {editable ? (
                <button
                  onClick={() => {
                    setEditing(true);
                  }}
                  className="btn btn-sm btn-link ml-2"
                >
                  <i className="mdi mdi-pencil"></i> Edit
                </button>
              ) : null}
            </div>
          </div>
          <p style={{ whiteSpace: "pre-wrap" }}>{note.body}</p>
        </>
      )}
    </li>
  );
};

export default connect(
  "selectProjectsByRoute",
  "selectInstrumentNotesItems",
  "selectAuthEdipi",
  "doInstrumentNotesSave",
  "doInstrumentNotesDelete",
  ({
    projectsByRoute: project,
    instrumentNotesItems: notes,
    authEdipi,
    doInstrumentNotesSave: save,
    doInstrumentNotesDelete: del,
  }) => {
    if (!project) return null;
    const edipi = Number(authEdipi);
    const [isAdding, setAdding] = useState(false);
    const sorted = notes.sort();
    return (
      <div className="card">
        <div className="card-header">
          <strong>Notes</strong>
        </div>
        <ul className="list-group list-group-flush">
          {sorted.map((note, i) => {
            return (
              <NoteItem
                key={i}
                note={note}
                save={save}
                del={del}
                editable={edipi === note.creator}
              />
            );
          })}
          <li className="list-group-item">
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
              <RoleFilter allowRoles={[`${project.slug.toUpperCase()}.*`]}>
                <button
                  className="btn btn-outline-info"
                  onClick={() => {
                    setAdding(true);
                  }}
                >
                  Add New
                </button>
              </RoleFilter>
            )}
          </li>
        </ul>
      </div>
    );
  }
);
