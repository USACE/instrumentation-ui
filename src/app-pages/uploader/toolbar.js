import React from "react";
import { connect } from "redux-bundler-react";

export default connect("doUploadClear", ({ doUploadClear }) => {
  return (
    <div className="buttons is-pulled-right">
      <button onClick={doUploadClear} className="button is-light">
        Clear
      </button>
      <button className="button is-success">Upload</button>
    </div>
  );
});
