import React, { useEffect } from "react";
import { connect } from "redux-bundler-react";
import Navbar from "../../app-components/navbar";
import FileDetails from "./file-details";
import UploadSettings from "./upload-settings";
import FilePreview from "./file-preview";
import Notifications from "../../app-components/notifications";

export default connect("doUploadClear", ({ doUploadClear }) => {
  useEffect(() => {
    return doUploadClear;
  });
  return (
    <div>
      <Navbar theme="primary" />
      <section className="container is-fluid mt-3">
        <div className="columns">
          <div className="column is-4">
            <FileDetails />
            <UploadSettings />
          </div>
          <div className="column is-8">
            <FilePreview />
          </div>
        </div>
      </section>
      <Notifications />
    </div>
  );
});
