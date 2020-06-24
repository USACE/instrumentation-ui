import React, { useState } from "react";
import { connect } from "redux-bundler-react";
import Navbar from "../../app-components/navbar";
import InstrumentTable from "../manager/instrument-table";
import InstrumentGroupForm from "../manager/instrument-group-form";
import InstrumentForm from "../manager/instrument-form";
import InstrumentPicker from "./instrument-picker";
import InstrumentRemove from "./instrument-remove";
import Map from "../../app-components/classMap";
import TimeSeries from "./group-time-series";
import RoleFilter from "../../app-components/role-filter";
import LoginMessage from "../../app-components/login-message";

export default connect(
  "doModalOpen",
  "doInstrumentTimeseriesSetActiveId",
  "selectProjectsByRoute",
  "selectInstrumentGroupsByRoute",
  "selectInstrumentGroupInstrumentsItems",
  "selectTimeseriesMeasurementsItemsObject",
  "selectInstrumentTimeseriesByInstrumentId",
  ({
    doModalOpen,
    doInstrumentTimeseriesSetActiveId,
    projectsByRoute: project,
    instrumentGroupsByRoute: group,
    instrumentGroupInstrumentsItems: instruments,
    timeseriesMeasurementsItemsObject: measurements,
    instrumentTimeseriesByInstrumentId: timeseriesByInstrument,
  }) => {
    if (!group) return null;

    const [checked, setChecked] = useState([]);

    const unCheck = (id) => {
      const idx = checked.indexOf(id);
      if (idx !== -1) {
        checked.splice(idx, 1);
        setChecked([...checked]);
      }
    };

    const handleClick = (id) => {
      const series = timeseriesByInstrument[id];
      if (series && series.length) {
        series.forEach((ts) => {
          doInstrumentTimeseriesSetActiveId(ts.id);
        });
      }
    };

    const chartSeries = {};
    const activeTimeseries = Object.keys(timeseriesByInstrument).reduce(
      (active, instrumentId) => {
        if (checked.indexOf(instrumentId) !== -1) {
          if (
            timeseriesByInstrument[instrumentId] &&
            timeseriesByInstrument[instrumentId].length
          ) {
            timeseriesByInstrument[instrumentId].forEach((ts) => {
              active.push(ts.id);
            });
          }
        }
        return active;
      },
      []
    );
    Object.keys(measurements).forEach((id) => {
      if (activeTimeseries.indexOf(id) !== -1)
        chartSeries[id] = measurements[id];
    });

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
          <div className="panel">
            <div className="panel-heading">Timeseries</div>
            <div className="panel-block">
              <div className="container">
                <div className="columns">
                  <div className="column is-one-quarter">
                    <div className="control">
                      {instruments.map((item) => {
                        return (
                          <div key={item.id} className="panel-block">
                            <label className="checkbox">
                              <input
                                type="checkbox"
                                name="timeseries"
                                id={item.id}
                                checked={checked.indexOf(item.id) !== -1}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    handleClick(item.id);
                                    setChecked([...checked, item.id]);
                                  } else {
                                    unCheck(item.id);
                                  }
                                }}
                              />
                              {item.name}
                              {""}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="column">
                    <TimeSeries data={chartSeries} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
);
