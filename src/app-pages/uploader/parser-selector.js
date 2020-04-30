import React from "react";
import { connect } from "redux-bundler-react";

export default connect(
  "selectUploadSelectedParser",
  "selectUploadParsers",
  "doUploadSetSelectedParser",
  ({ uploadSelectedParser, uploadParsers, doUploadSetSelectedParser }) => {
    const handleSelectParser = (e) => {
      const filtered = uploadParsers.filter((p) => {
        return p.name === e.target.value;
      });
      if (filtered.length) {
        doUploadSetSelectedParser(filtered[0]);
      }
    };
    return (
      <div>
        <div
          className="field is-horizontal"
          style={{ marginBottom: "0.75rem" }}
        >
          <div className="field-label is-normal">
            <label className="label">Import As</label>
          </div>
          <div className="field-body">
            <div className="field">
              <div className="control">
                <div className="select is-fullwidth">
                  <select
                    value={
                      (uploadSelectedParser && uploadSelectedParser.name) || ""
                    }
                    onChange={handleSelectParser}
                  >
                    <option value="">Select One...</option>
                    {uploadParsers.map((parser, i) => {
                      return (
                        <option key={i} value={parser.name}>
                          {parser.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
