import React from "react";
import { connect } from "redux-bundler-react";

export default connect(
  "doUploadClear",
  "doUploadSend",
  "selectUploadFieldMap",
  ({ doUploadClear, doUploadSend, uploadFieldMap }) => {
    let filled = true;
    if (uploadFieldMap) {
      const values = Object.values(uploadFieldMap);
      for (let i = 0; i < values.length; i++) {
        if (!values[i]) {
          filled = false;
          break;
        }
      }
    } else {
      filled = false;
    }

    return (
      <div className="is-clearfix mt-4">
        <div className="buttons is-pulled-right">
          <button onClick={doUploadClear} className="button is-light">
            Clear All
          </button>
          <button
            disabled={!filled}
            onClick={doUploadSend}
            className="button is-success"
          >
            Upload
          </button>
        </div>
      </div>
    );
  }
);
