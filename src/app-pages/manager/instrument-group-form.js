import React, { useState } from "react";
import { connect } from "redux-bundler-react";

export default connect(
  "doModalClose",
  "doInstrumentGroupsSave",
  ({ doModalClose, doInstrumentGroupsSave, item }) => {
    const [name, setName] = useState((item && item.name) || "");
    const [description, setDesc] = useState((item && item.description) || "");
    const handleSave = (e) => {
      e.preventDefault();
      doInstrumentGroupsSave(
        Object.assign({}, item, {
          name,
          description,
        }),
        doModalClose,
        true
      );
    };
    return (
      <div className="modal-card">
        <form id="instrument-form" onSubmit={handleSave}>
          <header className="modal-card-head">
            <p className="modal-card-title">Edit Instrument Group</p>
            <button
              type="button"
              onClick={doModalClose}
              className="delete"
            ></button>
          </header>
          <section className="modal-card-body">
            <div className="field">
              <label className="label">Name</label>
              <p className="control">
                <input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  className="input"
                  type="text"
                  placeholder="Text input"
                />
              </p>
            </div>
            <div className="field">
              <label className="label">Description</label>
              <p className="control">
                <input
                  value={description}
                  onChange={(e) => {
                    setDesc(e.target.value);
                  }}
                  className="input"
                  type="text"
                  placeholder="Text input"
                />
              </p>
            </div>
          </section>
          <footer className="modal-card-foot">
            <button type="submit" className="button is-primary">
              Save changes
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                doModalClose();
              }}
              className="button"
            >
              Cancel
            </button>
          </footer>
        </form>
      </div>
    );
  }
);
