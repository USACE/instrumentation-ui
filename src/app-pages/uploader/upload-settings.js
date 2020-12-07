import React from "react";
import { connect } from "redux-bundler-react";
import ParserSelector from "./parser-selector";
import FieldMapper from "./field-mapper";
import IgnoreRows from "./ignore-rows";
import Toolbar from "./toolbar";

const Empty = () => {
  return <p>Select a file to preview and upload...</p>;
};

export default connect(
  "selectUploadHasFile",
  "selectUploadJson",
  ({ uploadHasFile, uploadJson }) => {
    return (
      <div className="card">
        <p className="card-header">
          <strong>Upload Settings</strong>
        </p>
        <div className="card-body">
          {uploadHasFile && uploadJson && uploadJson.length ? (
            <>
              <ParserSelector />
              <FieldMapper />
              <IgnoreRows />
              <Toolbar />
            </>
          ) : (
            <Empty />
          )}
        </div>
      </div>
    );
  }
);
