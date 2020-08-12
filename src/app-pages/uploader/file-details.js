import React from "react";
import { connect } from "redux-bundler-react";
import UploadButton from "../../app-components/upload-button";

export default connect(
  "selectUploadFileData",
  "selectUploadHasFile",
  ({ uploadFileData, uploadHasFile }) => {
    const { name, size, type, lastModified } = uploadFileData;
    return (
      <div className="card mb-3">
        <p className="card-header">
          <strong>File Info</strong>
        </p>
        <div className="card-body">
          <div>
            {uploadHasFile ? (
              <div className="text-italic">
                <p>
                  <strong>{name}</strong>
                </p>
                <div className="d-flex justify-content-between">
                  <span>
                    <small className="text-muted">{`file size: `}</small>
                    {size}
                  </span>
                  <span>
                    <small className="text-muted">{`type: `}</small>
                    {type}
                  </span>
                  <span>
                    <small className="text-muted">{`last modified: `}</small>
                    {lastModified}
                  </span>
                </div>
              </div>
            ) : (
              <UploadButton size="sm" />
            )}
          </div>
        </div>
      </div>
    );
  }
);
