import React, { useState } from "react";
import { connect } from "redux-bundler-react";
import Constants from "./constants";
import FormulaEditor from "./formula-editor";
import Timeseries from "./time-series";

export default connect(
  "selectTimeseriesMeasurementsItemsObject",
  ({ timeseriesMeasurementsItemsObject: measurements }) => {
    const [tab, setTab] = useState(0);
    return (
      <div className="card">
        <div className="card-header pb-0">
          <ul className="nav nav-tabs">
            <li
              onClick={() => {
                setTab(0);
              }}
              className="nav-item pointer"
            >
              <span className={`nav-link ${tab === 0 ? "active" : ""}`}>
                <strong>Constants</strong>
              </span>
            </li>
            <li
              onClick={() => {
                setTab(1);
              }}
              className="nav-item pointer"
            >
              <span className={`nav-link ${tab === 1 ? "active" : ""}`}>
                <strong>Formula Editor</strong>
              </span>
            </li>
            <li
              onClick={() => {
                setTab(2);
              }}
              className="nav-item pointer"
            >
              <span className={`nav-link ${tab === 2 ? "active" : ""}`}>
                <strong>Timeseries</strong>
              </span>
            </li>
          </ul>
        </div>
        <div className="card-body">
          {tab === 0 ? <Constants /> : null}
          {tab === 1 ? <FormulaEditor /> : null}
          {tab === 2 ? <Timeseries data={measurements} /> : null}
        </div>
      </div>
    );
  }
);
