import React from "react";
import { connect } from "redux-bundler-react";

export default connect(
  "doUploadClear",
  "doUploadSend",
  "selectUploadReadyToUpload",
  ({ doUploadClear, doUploadSend, uploadReadyToUpload }) => {
    return (
      <div className="is-clearfix mt-4">
        <div className="buttons is-pulled-right">
          <button onClick={doUploadClear} className="button is-light">
            Clear All
          </button>
          <button
            disabled={!uploadReadyToUpload}
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
