import React from "react";
import { connect } from "redux-bundler-react";

export default connect(
  "doMapInteractionsReset",
  "doMapInteractionsSelectMode",
  ({ doMapInteractionsReset, doMapInteractionsSelectMode }) => {
    return (
      <div className="container">
        <button
          onClick={doMapInteractionsReset}
          className="button is-primary mr-2"
        >
          <i className="ms ms-pan-hand"></i>
        </button>
        <button
          onClick={doMapInteractionsSelectMode}
          className="button is-primary"
        >
          <i className="ms ms-select-box"></i>
        </button>
      </div>
    );
  }
);
