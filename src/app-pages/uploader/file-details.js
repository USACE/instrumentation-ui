import React from "react";
import { connect } from "redux-bundler-react";
import UploadButton from "../../app-components/upload-button";

export default connect(
  "selectUploadFileData",
  "selectUploadHasFile",
  ({ uploadFileData, uploadHasFile }) => {
    const { name, size, type, lastModified } = uploadFileData;
    return (
      <div className="panel">
        <p className="panel-heading">File Info</p>
        <div className="panel-block">
          <div className="container">
            {uploadHasFile ? (
              <div className="level is-italic">
                <span className="level-item">
                  <strong>{name}</strong>
                </span>
                <span className="level-item">{size}</span>
                <span className="level-item">{type}</span>
                <span className="level-item">{lastModified}</span>
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
