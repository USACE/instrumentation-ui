import React from "react";
import { connect } from "redux-bundler-react";
import Navbar from "../../app-components/navbar";
// import Chart from "../../app-components/chart";
import TimeSeries from "../../app-components/timeSeries";
import InstrumentForm from "../manager/instrument-form";
import Map from "../../app-components/classMap";

export default connect(
  "doModalOpen",
  "selectQueryObject",
  "selectPathname",
  "selectInstrumentsByRoute",
  ({
    doModalOpen,
    queryObject: q,
    pathname,
    instrumentsByRoute: instrument,
  }) => {
    if (!instrument) return null;
    return (
      <div>
        <Navbar theme="primary" />
        <section className="container mt-3">
          <div className="columns">
            <div className="column">
              <div className="panel">
                <div
                  className="panel-heading"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {instrument.name}{" "}
                  <button
                    onClick={() => {
                      doModalOpen(InstrumentForm, { item: instrument });
                    }}
                    className="button is-info is-small"
                  >
                    <i className="mdi mdi-pencil pr-2"></i> Edit
                  </button>
                </div>
                <div className="p-3">
                  <div>{instrument.type}</div>
                  <div>{`Height: ${instrument.height}`}</div>
                </div>
              </div>
            </div>
            <div className="column">
              <div className="panel">
                <Map mapKey="instrumentMap" height={300} />
              </div>
            </div>
          </div>
        </section>
        <section className="container mt-3">
          <div className="panel">
            <div className="panel-heading">
              <div className="tabs">
                <ul>
                  <li className={q.t === "s1" ? "is-active" : ""}>
                    <a href={`${pathname}?t=s1`}>Series 1</a>
                  </li>
                  <li className={q.t === "s2" ? "is-active" : ""}>
                    <a href={`${pathname}?t=s2`}>Series 2</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="panel-block">
              <div className="container">
                <div className="tab is-active">
                  {q.t === "s1" ? (
                    <TimeSeries title={"Series 1"} x={null} y={null} />
                  ) : null}
                  {q.t === "s2" ? (
                    <TimeSeries title={"Series 2"} x={null} y={null} />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
);
