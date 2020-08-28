import React, { useState } from "react";
import { connect } from "redux-bundler-react";
import PreviewTable from "./preview-table";

export default connect(
  "selectUploadColumnDefsOriginal",
  "selectUploadDataOriginal",
  "selectUploadColumnDefsParsed",
  "selectUploadDataParsed",
  "selectProjectsByRoute",
  ({
    uploadColumnDefsOriginal: colDefsOriginal,
    uploadDataOriginal: dataOriginal,
    uploadColumnDefsParsed: colDefsParsed,
    uploadDataParsed: dataParsed,
    projectsByRoute: project,
  }) => {
    if (!project) return null;

    const [tab, setTab] = useState(0);

    return (
      <div className="card">
        <div className="card-header pb-0" style={{ borderBottom: "none" }}>
          <ul className="nav nav-tabs">
            <li
              onClick={() => {
                setTab(0);
              }}
              className="nav-item pointer"
            >
              <span className={`nav-link ${tab === 0 ? "active" : ""}`}>
                <strong>Original</strong>
              </span>
            </li>
            <li
              onClick={() => {
                setTab(1);
              }}
              className="nav-item pointer"
            >
              <span className={`nav-link ${tab === 1 ? "active" : ""}`}>
                <strong>Parsed</strong>
              </span>
            </li>
          </ul>
        </div>
        <div className="card-body">
          <div>
            {tab === 0 ? (
              <PreviewTable columnDefs={colDefsOriginal} data={dataOriginal} />
            ) : (
              <PreviewTable columnDefs={colDefsParsed} data={dataParsed} />
            )}
          </div>
        </div>
      </div>
    );
  }
);
