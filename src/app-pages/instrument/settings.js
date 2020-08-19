import React, { useState } from "react";
import { connect } from "redux-bundler-react";
import Constants from "./constants/constants";
import FormulaEditor from "./formula/formula";
import Timeseries from "./timeseries/timeseries";
import Chart from "./chart/chart";

export default connect(
  "selectTimeseriesMeasurementsItemsObject",
  "selectInstrumentsByRoute",
  ({
    timeseriesMeasurementsItemsObject: measurements,
    instrumentsByRoute: instrument,
  }) => {
    const [tab, setTab] = useState(0);
    return (
      <div className="card">
        <div className="card-header pb-0" style={{ borderBottom: "none" }}>
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
                <strong>Timeseries</strong>
              </span>
            </li>

            <li
              onClick={() => {
                setTab(2);
              }}
              className="nav-item pointer"
            >
              <span className={`nav-link ${tab === 2 ? "active" : ""}`}>
                <strong>Formula Editor</strong>
              </span>
            </li>

            <li
              onClick={() => {
                setTab(3);
              }}
              className="nav-item pointer"
            >
              <span className={`nav-link ${tab === 3 ? "active" : ""}`}>
                <strong>Chart</strong>
              </span>
            </li>
          </ul>
        </div>
        <div className="card-body">
          {tab === 0 ? <Constants /> : null}
          {tab === 1 ? <Timeseries data={measurements[instrument.id]} /> : null}
          {tab === 2 ? <FormulaEditor /> : null}
          {tab === 3 ? <Chart /> : null}
        </div>
      </div>
    );
  }
);
