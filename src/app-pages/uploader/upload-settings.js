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
      <div className="panel">
        <p className="panel-heading">Upload Settings</p>
        <div className="panel-block">
          {uploadHasFile && uploadJson && uploadJson.length ? (
            <div className="container">
              <ParserSelector />
              <FieldMapper />
              <IgnoreRows />
              <Toolbar />
            </div>
          ) : (
            <Empty />
          )}
        </div>
      </div>
    );
  }
);
