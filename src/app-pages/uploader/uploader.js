import React, { useEffect } from "react";
import { connect } from "redux-bundler-react";
import Navbar from "../../app-components/navbar";
import FileDetails from "./file-details";
import UploadSettings from "./upload-settings";
import FilePreview from "./file-preview";
import Notifications from "../../app-components/notifications";

export default connect("doUploadSettingsClear", ({ doUploadSettingsClear }) => {
  useEffect(() => {
    return () => {

      doUploadSettingsClear();
    };
  });

  return (
    <div>
      <Navbar theme="primary" fixed />
      <section className="container-fluid" style={{ marginTop: "6rem" }}>
        <div className="row">
          <div className="col-4">
            <FileDetails />
            <UploadSettings />
          </div>
          <div className="col-8">
            <FilePreview />
          </div>
        </div>
      </section>
      <Notifications />
    </div>
  );
});
