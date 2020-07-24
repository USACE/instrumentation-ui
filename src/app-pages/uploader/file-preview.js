import React, { useState } from "react";
import { connect } from "redux-bundler-react";
import PreviewTable from "./preview-table";

export default connect(
  "selectUploadColumnDefsOriginal",
  "selectUploadDataOriginal",
  "selectUploadColumnDefsParsed",
  "selectUploadDataParsed",
  "selectProjectsByRoute",
  "selectQueryObject",
  ({
    uploadColumnDefsOriginal: colDefsOriginal,
    uploadDataOriginal: dataOriginal,
    uploadColumnDefsParsed: colDefsParsed,
    uploadDataParsed: dataParsed,
    projectsByRoute: project,
    queryObject,
  }) => {
    if (!project) return null;

    const [tab, setTab] = useState(
      (queryObject.t && Number(queryObject.t)) || 0
    );

    return (
      <div className="panel">
        <p className="panel-heading">Data Preview</p>
        <div className="panel-block" style={{ display: "block" }}>
          <div className="tabs mb-2">
            <ul>
              {["Original", "Parsed"].map((label, i) => {
                return (
                  <li
                    key={i}
                    onClick={() => {
                      setTab(i);
                    }}
                    className={tab === i ? "is-active" : ""}
                  >
                    <a href={`/${project.slug}/upload?t=${i}`}>{label}</a>
                  </li>
                );
              })}
            </ul>
          </div>
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
