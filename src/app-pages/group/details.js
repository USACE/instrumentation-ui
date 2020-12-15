import React from "react";
import { connect } from "redux-bundler-react";

import InstrumentForm from "../manager/instrument-form";
import InstrumentGroupForm from "../manager/instrument-group-form";
import InstrumentPicker from "./instrument-picker";
import InstrumentRemove from "./instrument-remove";
import InstrumentTable from "../manager/instrument-table";
import LoginMessage from "../../app-components/login-message";
import Map from "../../app-components/classMap";
import Navbar from "../../app-components/navbar";
import RoleFilter from "../../app-components/role-filter";
import TimeseriesPanel from "./group-time-series-panel";

export default connect(
  "doModalOpen",
  "selectProjectsByRoute",
  "selectInstrumentGroupsByRoute",
  "selectInstrumentGroupInstrumentsItems",
  ({
    doModalOpen,
    projectsByRoute: project,
    instrumentGroupsByRoute: group,
    instrumentGroupInstrumentsItems: instruments,
  }) => {
    if (!group) return null;

    return (
      <>
        <Navbar theme="primary" fixed />
        <section className="container" style={{ marginTop: "6rem" }}>
          <div className="row">
            <div className="col">
              <div className="card" style={{ height: "300px" }}>
                <div
                  className="card-header"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <strong>{group.name}</strong>&nbsp;
                  <RoleFilter
                    allowRoles={[`${project.slug.toUpperCase()}.*`]}
                    alt={LoginMessage}
                  >
                    <button
                      onClick={() => {
                        doModalOpen(InstrumentGroupForm, { item: group });
                      }}
                      className="btn btn-sm btn-outline-info"
                    >
                      <i className="mdi mdi-pencil pr-2" /> Edit
                    </button>
                  </RoleFilter>
                </div>
                <div className="card-body">{group.description}</div>
              </div>
            </div>
            <div className="col">
              <div
                className="card"
                style={{ position: "relative", height: "100%" }}
              >
                <div className="card-body">
                  <Map mapKey="groupMap" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mt-3">
          <div className="card">
            <div
              className="card-header"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <strong>Instruments</strong>
              <RoleFilter allowRoles={[`${project.slug.toUpperCase()}.*`]}>
                <div className="btn-group">
                  <button
                    onClick={() => {
                      doModalOpen(InstrumentForm, { addToGroup: group, isEdit: false });
                    }}
                    className="btn btn-sm btn-outline-info"
                  >
                    <i className="mdi mdi-map-marker-plus pr-2" /> Add New
                    Instrument
                  </button>
                  <button
                    onClick={() => doModalOpen(InstrumentPicker)}
                    className="btn btn-sm btn-outline-info"
                  >
                    <i className="mdi mdi-map-marker pr-2" /> Add Existing Instrument
                  </button>
                </div>
              </RoleFilter>
            </div>
            <div className="card-body">
              <InstrumentTable
                instruments={instruments}
                tools={[InstrumentRemove]}
              />
            </div>
          </div>
          <TimeseriesPanel />
        </section>
      </>
    );
  }
);
