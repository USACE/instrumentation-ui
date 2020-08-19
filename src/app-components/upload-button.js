import React, { useRef } from "react";
import { connect } from "redux-bundler-react";

export default connect("doUploadQueueCsv", ({ doUploadQueueCsv }) => {
  const inputEl = useRef(null);

  const handleClick = (e) => {
    inputEl.current.click();
  };

  const handleInputChange = (e) => {
    doUploadQueueCsv(inputEl.current.files[0]);
  };

  return (
    <>
      <button className="btn btn-success" onClick={handleClick}>
        <i className="mdi mdi-cloud-upload pr-2"></i> Choose File
      </button>
      <input
        accept=".csv"
        style={{ display: "none" }}
        ref={inputEl}
        type="file"
        onChange={handleInputChange}
      ></input>
    </>
  );
});
