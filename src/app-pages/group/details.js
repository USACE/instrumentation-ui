import React from "react";
import { connect } from "redux-bundler-react";
import Navbar from "../../app-components/navbar";
import InstrumentTable from "../manager/instrument-table";
import InstrumentGroupForm from "../manager/instrument-group-form";
import InstrumentForm from "../manager/instrument-form";
import InstrumentPicker from "./instrument-picker";
import InstrumentRemove from "./instrument-remove";
import Map from "../../app-components/classMap";
import TimeSeries from "../../app-components/timeSeries";

export default connect(
  "doModalOpen",
  "selectQueryObject",
  "selectPathname",
  "selectInstrumentGroupsByRoute",
  "selectInstrumentGroupInstrumentsItems",
  ({
    doModalOpen,
    queryObject: q,
    pathname,
    instrumentGroupsByRoute: group,
    instrumentGroupInstrumentsItems: instruments,
  }) => {
    const handleClick = (id) => {
      console.log(`You've clicked ${id}`)
    }
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
                  <button
                    onClick={() => {
                      doModalOpen(InstrumentGroupForm, { item: group });
                    }}
                    className="button is-info is-small"
                  >
                    <i className="mdi mdi-pencil pr-2"></i> Edit
                  </button>
                </div>
                <div className="p-3">{group.description}</div>
              </div>
            </div>
            <div className="column">
              <div className="panel">
                <Map mapKey="groupMap" height={300} />
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
            </div>
            <div className="panel-block">
              <InstrumentTable
                instruments={instruments}
                tools={[InstrumentRemove]}
              />
            </div>
          </div>
          <div className="panel">
            <div className="panel-heading">
              Timeseries
            </div>
            <div className="panel-block">
              <div className="container">
                <div className="columns">
                  <div className="column is-one-quarter">
                    <div className="control">
                      {instruments.map((item, key) => {
                        return (
                          <div className="panel-block">
                            <label className="checkbox">
                              <input type="checkbox" name="timeseries" id={key} value={item.id} onClick={() => handleClick(item.id)} />
                              {item.name}{""}
                            </label>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div className="column">
                    <div>
                      <TimeSeries
                        title={`Data from ${group.name} from Jan 1, 2020 to Jan 10, 2020`}
                        data={[{ x: [1, 2, 3], y: [2, 1, 3] }]}
                      />
                    </div>
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
