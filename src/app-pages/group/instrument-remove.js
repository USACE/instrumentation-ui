import React, { useState } from "react";
import { connect } from "redux-bundler-react";

export default connect(
  "doInstrumentGroupInstrumentsDelete",
  ({ doInstrumentGroupInstrumentsDelete, item }) => {
    const [isConfirming, setIsConfirming] = useState(false);

    const handleDelete = () => {
      setIsConfirming(false);
      doInstrumentGroupInstrumentsDelete(item);
    };

    return (
      <>
        {isConfirming ? (
          <div className="btn-group">
            <button
              title="Cancel"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => {
                setIsConfirming(false);
              }}
            >
              Cancel
            </button>
            <button
              title="Confirm"
              className="btn btn-sm btn-outline-danger"
              onClick={handleDelete}
            >
              Confirm
            </button>
          </div>
        ) : (
          <button
            title="Remove from Group"
            onClick={() => {
              setIsConfirming(true);
            }}
            className="btn btn-sm btn-outline-danger"
          >
            <i className="mdi mdi-delete"></i>
          </button>
        )}
      </>
    );
  }
);
