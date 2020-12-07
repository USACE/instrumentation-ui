import React from "react";
import { connect } from "redux-bundler-react";

export default connect(
  "doUploadClear",
  "doUploadSend",
  "selectUploadReadyToUpload",
  ({ doUploadClear, doUploadSend, uploadReadyToUpload }) => (
    <div className="clearfix">
      <div className="float-right">
        <button onClick={doUploadClear} className="btn btn-secondary mr-2">
          Clear All
        </button>
        <button
          disabled={!uploadReadyToUpload}
          onClick={doUploadSend}
          className="btn btn-success"
        >
          Upload
        </button>
      </div>
    </div>
  )
);
