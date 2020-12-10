import React from "react";
import { connect } from "redux-bundler-react";

export default connect(
  "doUploadSettingsClear",
  "doUploadSend",
  "selectUploadReadyToUpload",
  ({ doUploadSettingsClear, doUploadSend, uploadReadyToUpload }) => (
    <div className="clearfix">
      <div className="float-right">
        <button onClick={doUploadSettingsClear} className="btn btn-secondary mr-2">
          Clear Settings
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
