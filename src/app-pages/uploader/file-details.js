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
          <>
            {uploadHasFile ? (
              <div className="text-italic">
                <UploadButton text='Change File' icon='mdi-file-replace-outline' buttonClass='float-right' />
                <p><strong>{name}</strong></p>
                <div className="d-flex justify-content-between pt-2">
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
              <UploadButton clearSettings={false} />
            )}
          </>
        </div>
      </div>
    );
  }
);
