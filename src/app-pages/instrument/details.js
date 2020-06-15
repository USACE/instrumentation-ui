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
  "selectInstrumentTimeseriesByInstrumentId",
  "selectTimeseriesMeasurementsItemsObject",
  "selectInstrumentTimeseriesActiveId",
  ({
    doModalOpen,
    doInstrumentTimeseriesSetActiveId,
    instrumentsByRoute: instrument,
    instrumentTimeseriesByInstrumentId: timeseriesByInstrumentId,
    timeseriesMeasurementsItemsObject: measurements,
    instrumentTimeseriesActiveId: activeId,
  }) => {
    if (!instrument || !timeseriesByInstrumentId) return null;

    const timeseries = timeseriesByInstrumentId[instrument.id] || [];
    const len = timeseries.length;
    let firstTimeseries = null;
    if (len && len > 0) firstTimeseries = timeseries[0];
    useEffect(() => {
      if (!len || !firstTimeseries) {
        doInstrumentTimeseriesSetActiveId(null);
      }
      if (firstTimeseries && firstTimeseries.id) {
        doInstrumentTimeseriesSetActiveId(firstTimeseries.id);
      }
    }, [len, firstTimeseries, doInstrumentTimeseriesSetActiveId]);

    const handleTab = (id) => {
      doInstrumentTimeseriesSetActiveId(id);
    };

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
                {!len ? (
                  <div>
                    <ul>
                      <li>No Timeseries Available for this Instrument</li>
                    </ul>
                  </div>
                ) : null}
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
