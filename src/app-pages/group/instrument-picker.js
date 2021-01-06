import React, { useState } from "react";
import { connect } from "redux-bundler-react";

import { ModalFooter, ModalHeader } from "../../app-components/modal";

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
      <div className="modal-content">
        <form id="instrument-picker" onSubmit={handleSave}>
          <ModalHeader title='Choose Instrument' />
          <section className="modal-body">
            <div className="form-group">
              <label>Type</label>
              <select
                className="form-control"
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
            </div>
          </section>
          <ModalFooter
            saveIsSubmit
            customClosingLogic
            saveText='Save changes'
            onCancel={() => doModalClose()}
          />
        </form>
      </div>
    );
  }
);
