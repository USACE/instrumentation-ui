import React from "react";
import { connect } from "redux-bundler-react";
import Navbar from "../../app-components/navbar";
import InstrumentTable from "../manager/instrument-table";
import InstrumentGroupForm from "../manager/instrument-group-form";
import InstrumentForm from "../manager/instrument-form";
import InstrumentPicker from "./instrument-picker";
import InstrumentRemove from "./instrument-remove";
import Map from "../../app-components/classMap";
import TimeseriesPanel from "./group-time-series-panel";
import RoleFilter from "../../app-components/role-filter";
import LoginMessage from "../../app-components/login-message";

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
      <div>
        <Navbar theme="primary" />
        <section className="container mt-3">
          <div className="columns">
            <div className="column">
              <div className="panel" style={{ height: "300px" }}>
                <div
                  className="panel-heading"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {group.name}{" "}
                  <RoleFilter
                    allowRoles={[`${project.slug.toUpperCase()}.*`]}
                    alt={LoginMessage}
                  >
                    <button
                      onClick={() => {
                        doModalOpen(InstrumentGroupForm, { item: group });
                      }}
                      className="button is-info is-small"
                    >
                      <i className="mdi mdi-pencil pr-2"></i> Edit
                    </button>
                  </RoleFilter>
                </div>
                <div className="p-3">{group.description}</div>
              </div>
            </div>
            <div className="column">
              <div
                className="panel"
                style={{ position: "relative", height: "100%" }}
              >
                <Map mapKey="groupMap" />
              </div>
            </div>
          </div>
        </section>
        <section className="container mt-3">
          <div className="panel">
            <div
              className="panel-heading"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              Instruments
              <RoleFilter allowRoles={[`${project.slug.toUpperCase()}.*`]}>
                <div className="buttons">
                  <button
                    onClick={() => {
                      doModalOpen(InstrumentForm, { addToGroup: group });
                    }}
                    className="button is-info is-small"
                  >
                    <i className="mdi mdi-map-marker-plus pr-2"></i> Add New
                    Instrument
                  </button>
                  <button
                    onClick={() => {
                      doModalOpen(InstrumentPicker);
                    }}
                    className="button is-info is-small"
                  >
                    <i className="mdi mdi-map-marker pr-2"></i> Add Existing
                    Instrument
                  </button>
                </div>
              </RoleFilter>
            </div>
            <div className="panel-block">
              <InstrumentTable
                instruments={instruments}
                tools={[InstrumentRemove]}
              />
            </div>
          </div>
          <TimeseriesPanel />
        </section>
      </div>
    );
  }
);
