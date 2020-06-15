/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from "react";
import { connect } from "redux-bundler-react";
import Navbar from "../../app-components/navbar";
import TimeSeries from "./time-series";
import InstrumentForm from "../manager/instrument-form";
import InstrumentDisplay from "./instrument-display";
import Map from "../../app-components/classMap";
import Notes from "./notes";

export default connect(
  "doModalOpen",
  "doInstrumentTimeseriesSetActiveId",
  "selectInstrumentsByRoute",
  "selectInstrumentTimeseriesItems",
  "selectTimeseriesMeasurementsItemsObject",
  "selectInstrumentTimeseriesActiveId",
  ({
    doModalOpen,
    doInstrumentTimeseriesSetActiveId,
    instrumentsByRoute: instrument,
    instrumentTimeseriesItems: timeseries,
    timeseriesMeasurementsItemsObject: measurements,
    instrumentTimeseriesActiveId: activeId,
  }) => {
    const len = timeseries.length;
    let firstTimeseries = null;
    if (len && len > 0) firstTimeseries = timeseries[0];
    useEffect(() => {
      if (!len || !firstTimeseries) return undefined;
      if (firstTimeseries && firstTimeseries.id) {
        doInstrumentTimeseriesSetActiveId(firstTimeseries.id);
      }
    }, [len, firstTimeseries, doInstrumentTimeseriesSetActiveId]);

    const handleTab = (id) => {
      doInstrumentTimeseriesSetActiveId(id);
    };

    if (!instrument) return null;
    // eslint-disable-next-line
    return (
      <div style={{ marginBottom: "200px" }}>
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
                <InstrumentDisplay item={instrument} />
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
                {timeseries.map((item, i) => {
                  return (
                    <div key={item.id}>
                      <ul>
                        <li className={activeId === item.id ? "is-active" : ""}>
                          <a onClick={() => handleTab(item.id)}>{item.name}</a>
                        </li>
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="panel-block">
              <div className="container">
                <div className="tab is-active">
                  <TimeSeries data={measurements[activeId]} />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="container mt-3 ">
          <div className="panel">
            <div className="panel-heading">Notes</div>
            <Notes />
          </div>
        </section>
      </div>
    );
  }
);
