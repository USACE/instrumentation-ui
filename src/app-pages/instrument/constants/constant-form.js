import React, { useState } from "react";
import { connect } from "redux-bundler-react";
import DomainSelect from "../../../app-components/domain-select";

const DeleteButton = connect(
  "doInstrumentConstantsDelete",
  "doModalClose",
  ({
    doInstrumentConstantsDelete,
    doModalClose,
    item,
  }) => {
    const [isConfirming, setIsConfirming] = useState(false);
    if (!item || !item.id) return null;

    const handleDelete = () => {
      setIsConfirming(false);
      doInstrumentConstantsDelete(
        item,
        () => {
          doModalClose();
        },
        true
      );
    };

    return (
      <>
        {isConfirming ? (
          <div className="btn-group">
            <button
              title="Confirm"
              className="btn btn-danger"
              onClick={handleDelete}
            >
              Confirm
            </button>
            <button
              title="Cancel"
              className="btn btn-secondary"
              onClick={() => {
                setIsConfirming(false);
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            title="Remove from Group"
            onClick={() => {
              setIsConfirming(true);
            }}
            className="btn btn-danger"
          >
            Delete
          </button>
        )}
      </>
    );
  }
);

export default connect(
  "doModalClose",
  "doInstrumentConstantsSave",
  "doInstrumentsSave",
  "selectInstrumentsByRoute",
  ({
    doModalClose,
    doInstrumentConstantsSave,
    doInstrumentsSave,
    item,
    instrumentsByRoute: instrument,
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

    return (
      <div className="modal-content" style={{ overflowY: "auto" }}>
        <form id="instrument-constant-form" onSubmit={handleSave}>
          <header className="modal-header">
            <h5 className="modal-title">Edit Constant</h5>
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
          <footer
            className="modal-footer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
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
            <div>
              <DeleteButton item={item} />
            </div>
          </footer>
        </form>
      </div>
    );
  }
);
