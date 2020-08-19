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
        <div className="form-group row" style={{ marginBottom: "0.75rem" }}>
          <label className="col-3 col-form-label text-right">Import As</label>

          <div className="col-9">
            <select
              className="form-control"
              value={(uploadSelectedParser && uploadSelectedParser.name) || ""}
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
    );
  }
);
