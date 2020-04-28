import React, { useState } from "react";
import { connect } from "redux-bundler-react";

export default connect(
  "doModalClose",
  "doInstrumentGroupInstrumentsSave",
  "selectInstrumentsItemsObject",
  "selectInstrumentGroupInstrumentsItemsObject",
  ({
    doModalClose,
    doInstrumentGroupInstrumentsSave,
    instrumentsItemsObject: instruments,
    instrumentGroupInstrumentsItemsObject: groupInstruments,
  }) => {
    const [instrumentSlug, setInstrumentSlug] = useState("");

    const handleSelect = (e) => {
      setInstrumentSlug(e.target.value);
    };

    const handleSave = (e) => {
      e.preventDefault();
      const instrument = instruments[instrumentSlug];
      console.log(instrument);
      doInstrumentGroupInstrumentsSave(instrument, doModalClose, true, true);
    };

    const currentMembers = Object.keys(groupInstruments);
    const options = Object.values(instruments)
      .filter((inst) => {
        return currentMembers.indexOf(inst.id) === -1;
      })
      .sort((a, b) => {
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
        return 0;
      });

    return (
      <div className="modal-card">
        <form id="instrument-picker" onSubmit={handleSave}>
          <header className="modal-card-head">
            <p className="modal-card-title">Choose Instrument</p>
            <button
              type="button"
              onClick={doModalClose}
              className="delete"
            ></button>
          </header>
          <section className="modal-card-body">
            <div className="field">
              <label className="label">Type</label>
              <p className="control">
                <span className="select" style={{ width: "100%" }}>
                  <select
                    className="input"
                    value={instrumentSlug}
                    onChange={handleSelect}
                  >
                    {instrumentSlug ? null : (
                      <option value="">Select one...</option>
                    )}
                    {options.map((opt, i) => {
                      return (
                        <option key={i} value={opt.slug}>
                          {opt.name}
                        </option>
                      );
                    })}
                  </select>
                </span>
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
