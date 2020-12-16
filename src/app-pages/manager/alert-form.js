/* eslint-disable no-mixed-operators */
import React, { useState, useEffect } from "react";
import { connect } from "redux-bundler-react";

import Button from '../../app-components/button';

export default connect(
  "selectInstrumentsByRoute",
  "doModalClose",
  "doAlertConfigsSave",
  ({
    instrumentsByRoute: instrument,
    doModalClose,
    doAlertConfigsSave,
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
      doAlertConfigsSave(
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
            <span className='close pointer text-primary' onClick={doModalClose}>&times;</span>
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
          <footer className="modal-footer">
            <div>
              <Button
                type='submit'
                className='mr-2'
                text='Save changes'
              />
              <Button
                variant='secondary'
                handleClick={(e) => {
                  e.preventDefault();
                  doModalClose();
                }}
                text='Cancel'
              />
            </div>
          </footer>
        </form>
      </div>
    );
  }
);
