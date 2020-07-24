import React from "react";
import { connect } from "redux-bundler-react";
export default connect(
  "doUploadSetIgnoreRows",
  "doUploadIgnoreErrors",
  "selectUploadIgnoreRows",
  "selectUploadSelectedParser",
  ({
    doUploadSetIgnoreRows,
    doUploadIgnoreErrors,
    uploadIgnoreRows,
    uploadSelectedParser,
  }) => {
    if (!uploadSelectedParser) return null;
    return (
      <div>
        <div className="field is-horizontal" style={{ marginTop: "0.75rem" }}>
          <div className="field-label is-normal">
            <label className="label">Ignore Rows</label>
          </div>
          <div className="field-body">
            <div className="field has-addons">
              <div className="control is-expanded">
                <input
                  value={uploadIgnoreRows}
                  onChange={(e) => {
                    doUploadSetIgnoreRows(e.target.value);
                  }}
                  className="input is-fullwidth"
                  type="text"
                  placeholder="Rows i.e. 1,2,3 or 1-3"
                />
              </div>
              <div className="control">
                <button
                  onClick={doUploadIgnoreErrors}
                  className="button is-secondary"
                >
                  Ignore Errors
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
