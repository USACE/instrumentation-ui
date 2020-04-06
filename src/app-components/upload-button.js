import React, { useRef } from "react";
import { connect } from "redux-bundler-react";
import { classnames } from "../utils";

export default connect(
  "doUploadQueueCsv",
  "doUpdateUrl",
  ({ doUploadQueueCsv, doUpdateUrl, size }) => {
    const inputEl = useRef(null);

    const handleClick = e => {
      inputEl.current.click();
    };

    const handleInputChange = e => {
      doUploadQueueCsv(inputEl.current.files[0]);
      doUpdateUrl("/upload");
    };

    const btnClass = classnames({
      button: true,
      "is-success": true,
      "is-small": size === "sm",
      "is-medium": size === "md",
      "is-large": size === "lg"
    });

    return (
      <>
        <button className={btnClass} onClick={handleClick}>
          <i className="mdi mdi-cloud-upload pr-2"></i> Bulk Upload
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
  }
);
