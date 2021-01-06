import React, { useState } from "react";
import { connect } from "redux-bundler-react";

import DomainSelect from "../../../app-components/domain-select";
import { ModalFooter, ModalHeader } from "../../../app-components/modal";

export default connect(
  "doModalClose",
  "doInstrumentConstantsSave",
  "doInstrumentsSave",
  "doInstrumentConstantsDelete",
  "selectInstrumentsByRoute",
  ({
    doModalClose,
    doInstrumentConstantsSave,
    doInstrumentsSave,
    doInstrumentConstantsDelete,
    instrumentsByRoute: instrument,
    item,
  }) => {
    const [name, setName] = useState((item && item.name) || "");
    const [instrument_id] = useState(instrument.id);
    const [parameter_id, setParameterId] = useState(
      (item && item.parameter_id) || ""
    );
    const [unit_id, setUnitId] = useState((item && item.unit_id) || "");

    const handleSave = (e) => {
      e.preventDefault();
      doInstrumentConstantsSave(
        Object.assign({}, item, {
          name,
          instrument_id,
          parameter_id,
          unit_id,
        }),
        (updatedItem) => {
          doModalClose();
          if (instrument.constants.indexOf(updatedItem.id) === -1) {
            instrument.constants.push(updatedItem.id);
            doInstrumentsSave(instrument);
          }
        },
        true
      );
    };

    const handleDelete = (e) => {
      e.preventDefault();

      if (item && item.id) {
        doInstrumentConstantsDelete(item, () => doModalClose(), true)
      }
    }

    return (
      <div className="modal-content" style={{ overflowY: "auto" }}>
        <form id="instrument-constant-form" onSubmit={handleSave}>
          <ModalHeader title='Edit Constant' />
          <section className="modal-body">
            <div className="form-group">
              <label>Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control"
                type="text"
                placeholder="Text input"
              />
            </div>
            <div className="form-group">
              <label>Parameter</label>
              <DomainSelect
                value={parameter_id}
                onChange={(val) => setParameterId(val)}
                domain="parameter"
              />
            </div>
            <div className="form-group">
              <label>Unit</label>
              <DomainSelect
                value={unit_id}
                onChange={(val) => setUnitId(val)}
                domain="unit"
              />
            </div>
          </section>
          <ModalFooter
            saveIsSubmit
            customClosingLogic
            saveText='Save changes'
            onCancel={() => doModalClose()}
            onDelete={handleDelete}
          />
        </form>
      </div>
    );
  }
);
