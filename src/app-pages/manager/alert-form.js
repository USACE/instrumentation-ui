/* eslint-disable no-mixed-operators */
import React, { useState, useEffect } from "react";
import { connect } from "redux-bundler-react";

export default connect(
  "selectInstrumentsByRoute",
  "doModalClose",
  "doAlertsSave",
  ({
    instrumentsByRoute: instrument,
    doModalClose,
    doAlertsSave,
    item = {},
  }) => {
    const [name, setName] = useState((item && item.name) || "");
    const [instrumentId, setInstrumentId] = useState(
      (instrument && instrument.id) || ""
    );

    useEffect(() => {
      if (instrument && instrument.id) setInstrumentId(instrument.id);
    }, [instrument]);

    const handleSave = (e) => {
      e.preventDefault();
      doAlertsSave(
        Object.assign({}, item, {
          name: name,
          instrument_id: instrumentId,
          body: "",
          formula: "",
          schedule: "",
        }),
        doModalClose,
        true
      );
    };

    return (
      <div className="modal-content" style={{ overflowY: "auto" }}>
        <form id="alert-form" onSubmit={handleSave}>
          <header className="modal-header">
            <h5 className="modal-title">Create Alert</h5>
            <span className="pointer" onClick={doModalClose}>
              <i className="mdi mdi-close-circle-outline"></i>
            </span>
          </header>
          <section className="modal-body">
            <div className="form-group">
              <label>Name</label>
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                className="form-control"
                type="text"
                placeholder="Name"
              />
            </div>
          </section>
          <footer className="modal-footer d-flex justify-content-between align-items-center">
            <div>
              <button type="submit" className="btn btn-primary mr-2">
                Save changes
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  doModalClose();
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </footer>
        </form>
      </div>
    );
  }
);
