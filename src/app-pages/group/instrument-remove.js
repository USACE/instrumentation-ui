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
          <>
            <button
              title="Cancel"
              className="button is-small is-secondary"
              onClick={() => {
                setIsConfirming(false);
              }}
            >
              Cancel
            </button>
            <button
              title="Confirm"
              className="button is-small is-danger is-outlined"
              onClick={handleDelete}
            >
              Confirm
            </button>
          </>
        ) : (
          <button
            title="Remove from Group"
            onClick={() => {
              setIsConfirming(true);
            }}
            className="button is-small is-danger is-outlined"
          >
            <i className="mdi mdi-delete"></i>
          </button>
        )}
      </>
    );
  }
);
