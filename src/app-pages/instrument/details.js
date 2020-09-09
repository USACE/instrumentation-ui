/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from "react";
import { connect } from "redux-bundler-react";
import Navbar from "../../app-components/navbar";
import InstrumentForm from "../manager/instrument-form";
import InstrumentDisplay from "./instrument-display";
import Map from "../../app-components/classMap";
import Notes from "./notes";
import Settings from "./settings";
import RoleFilter from "../../app-components/role-filter";
import LoginMessage from "../../app-components/login-message";

const sampleAlerts = [
  {
    id: "1",
    name: "Above Target Height",
    time: "4 minutes ago",
    body:
      "The demo staff gage has exceeded the target height. Sincerely, Midas",
  },
  {
    id: "2",
    name: "Above Target Height",
    time: "10 minutes ago",
    body:
      "The demo staff gage has exceeded the target height. Sincerely, Midas",
  },
  {
    id: "3",
    name: "Above Target Height",
    time: "16 minutes ago",
    body:
      "The demo staff gage has exceeded the target height. Sincerely, Midas",
  },
];

const AlertEntry = ({ item }) => {
  return (
    item && (
      <span className="list-group-item list-group-item-action flex-column align-items-start ">
        <div className="d-flex w-100 justify-content-between">
          <h5 className="mb-1">{item.name}</h5>
          <small>{item.time}</small>
        </div>
        <p className="mb-1">{item.body}</p>
      </span>
    )
  );
};

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

    // eslint-disable-next-line
    return (
      <div style={{ marginBottom: "200px" }}>
        <Navbar theme="primary" fixed />
        <section className="container-fluid" style={{ marginTop: "6rem" }}>
          <div className="row">
            <div className="col">
              <div className="card">
                <div
                  className="card-header"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <strong>{instrument.name}</strong>{" "}
                  <RoleFilter
                    allowRoles={[`${project.slug.toUpperCase()}.*`]}
                    alt={LoginMessage}
                  >
                    <button
                      onClick={() => {
                        doModalOpen(InstrumentForm, { item: instrument });
                      }}
                      className="btn btn-sm btn-outline-info"
                    >
                      <i className="mdi mdi-pencil pr-2"></i> Edit
                    </button>
                  </RoleFilter>
                </div>
                <InstrumentDisplay item={instrument} />
              </div>
            </div>
            <div className="col">
              <div className="card h-100">
                <div
                  className="card-header"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <strong>Alerts</strong>
                </div>
                <div
                  className="card-body"
                  style={{ maxHeight: 400, overflow: "auto" }}
                >
                  <div className="list-group">
                    {sampleAlerts.map((a) => (
                      <AlertEntry item={a} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card h-100" style={{ position: "relative" }}>
                <div className="card-body">
                  <Map mapKey="instrumentMap" />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="container-fluid mt-4">
          <Settings />
        </section>
        <section className="container-fluid my-4">
          <Notes />
        </section>
      </div>
    );
  }
);
