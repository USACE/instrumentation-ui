import React, { useEffect } from "react";
import { connect } from "redux-bundler-react";
import Navbar from "../../app-components/navbar";
import Toolbar from "./toolbar";
import FileDetails from "./file-details";
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
            <Toolbar />
          </div>
        </div>
      </section>
      <section className="container mt-3">
        <FilePreview />
      </section>
    </div>
  );
});
