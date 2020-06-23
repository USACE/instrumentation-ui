/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from "react";
import { connect } from "redux-bundler-react";
import Navbar from "../../app-components/navbar";
import TimeSeries from "./time-series";
import InstrumentForm from "../manager/instrument-form";
import InstrumentDisplay from "./instrument-display";
import Map from "../../app-components/classMap";
import Notes from "./notes";
import RoleFilter from "../../app-components/role-filter";
import LoginMessage from "../../app-components/login-message";

export default connect(
  "doModalOpen",
  "doInstrumentTimeseriesSetActiveId",
  "selectProjectsByRoute",
  "selectInstrumentsByRoute",
  "selectInstrumentTimeseriesByInstrumentId",
  "selectTimeseriesMeasurementsItemsObject",
  "selectInstrumentTimeseriesActiveId",
  ({
    doModalOpen,
    doInstrumentTimeseriesSetActiveId,
    projectsByRoute: project,
    instrumentsByRoute: instrument,
    instrumentTimeseriesByInstrumentId: timeseriesByInstrumentId,
    timeseriesMeasurementsItemsObject: measurements,
    instrumentTimeseriesActiveId: activeId,
  }) => {
    if (!project || !instrument || !timeseriesByInstrumentId) return null;

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
                  <RoleFilter
                    allowRoles={[`${project.slug.toUpperCase()}.*`]}
                    alt={LoginMessage}
                  >
                    <button
                      onClick={() => {
                        doModalOpen(InstrumentForm, { item: instrument });
                      }}
                      className="button is-info is-small"
                    >
                      <i className="mdi mdi-pencil pr-2"></i> Edit
                    </button>
                  </RoleFilter>
                </div>
                <InstrumentDisplay item={instrument} />
              </div>
            </div>
            <div className="column">
              <div className="panel" style={{ height: "100%" }}>
                <Map mapKey="instrumentMap" height={"100%"} />
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
