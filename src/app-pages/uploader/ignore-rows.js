import React from "react";
import { connect } from "redux-bundler-react";

export default connect(
  "doUploadSetIgnoreRows",
  "doUploadIgnoreErrors",
  "selectUploadIgnoreRows",
  ({
    doUploadSetIgnoreRows,
    doUploadIgnoreErrors,
    uploadIgnoreRows,
  }) => (
    <div className="form-group row">
      <label className="col-3 col-form-label text-right">Ignore Rows</label>
      <div className="col-9">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Rows i.e. 1,2,3 or 1-3"
            value={uploadIgnoreRows}
            onChange={(e) => {
              doUploadSetIgnoreRows(e.target.value);
            }}
          />
          <div className="input-group-append">
            <span
              title="Ignore all error rows"
              className="input-group-text pointer"
              onClick={doUploadIgnoreErrors}
            >
              Ignore Errors
            </span>
          </div>
        </div>
      </div>
    </div>
  )
);
