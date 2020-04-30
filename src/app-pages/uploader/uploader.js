import React, { useEffect } from "react";
import { connect } from "redux-bundler-react";
import Navbar from "../../app-components/navbar";
import FileDetails from "./file-details";
import UploadSettings from "./upload-settings";
import FilePreview from "./file-preview";

export default connect("doUploadClear", ({ doUploadClear }) => {
  useEffect(() => {
    return doUploadClear;
  });
  return (
    <div>
      <Navbar theme="primary" />
      <section className="container mt-3">
        <div className="columns">
          <div className="column">
            <FileDetails />
          </div>
          <div className="column">
            <UploadSettings />
          </div>
        </div>
      </section>
      <section className="container mt-3">
        <FilePreview />
      </section>
    </div>
  );
});
