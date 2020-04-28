/* eslint-disable no-mixed-operators */
import React, { useState, useEffect } from "react";
import { connect } from "redux-bundler-react";
import Map from "../../app-components/classMap";
import DomainSelect from "../../app-components/domain-select";

export default connect(
  "doModalClose",
  "doInstrumentsSave",
  "doInstrumentDrawUpdateLoc",
  "doInstrumentDrawOnMapClose",
  "doProjSetDisplayProjection",
  "doProjTransformFromLonLat",
  "doProjTransformToLonLat",
  "doInstrumentGroupInstrumentsSave",
  "selectInstrumentDrawLon",
  "selectInstrumentDrawLat",
  "selectInstrumentDrawReady",
  "selectProjDisplayProjection",
  "selectProjOptions",
  ({
    doModalClose,
    doInstrumentsSave,
    doInstrumentDrawUpdateLoc,
    doInstrumentDrawOnMapClose,
    doProjSetDisplayProjection,
    doProjTransformFromLonLat,
    doProjTransformToLonLat,
    doInstrumentGroupInstrumentsSave,
    item,
    addToGroup,
    instrumentDrawLat,
    instrumentDrawLon,
    instrumentDrawReady,
    projDisplayProjection,
    projOptions,
  }) => {
    const [name, setName] = useState((item && item.name) || "");
    const [type_id, setTypeId] = useState((item && item.type_id) || "");
    const [height, setHeight] = useState((item && item.height) || "");
    // const [lat, setLat] = useState(instrumentDrawLat || "");
    // const [lon, setLon] = useState(instrumentDrawLon || "");

    const projected =
      instrumentDrawLon && instrumentDrawLat
        ? doProjTransformFromLonLat(
            [instrumentDrawLon, instrumentDrawLat],
            projOptions[projDisplayProjection]
          )
        : ["", ""];

    const [x, setX] = useState(projected[0]);
    const [y, setY] = useState(projected[1]);

    useEffect(() => {
      if (!instrumentDrawReady || !item || !item.geometry) return undefined;
      const geom = item.geometry;
      const itemLon = geom.coordinates[0];
      const itemLat = geom.coordinates[1];
      doInstrumentDrawUpdateLoc({ lat: itemLat, lon: itemLon });
      return doInstrumentDrawOnMapClose;
    }, [
      instrumentDrawReady,
      doInstrumentDrawUpdateLoc,
      doInstrumentDrawOnMapClose,
      item,
    ]);

    useEffect(() => {
      if (instrumentDrawLat && instrumentDrawLon) {
        const projected = doProjTransformFromLonLat(
          [instrumentDrawLon, instrumentDrawLat],
          projOptions[projDisplayProjection]
        );
        setX(projected[0]);
        setY(projected[1]);
      }
    }, [
      instrumentDrawLat,
      instrumentDrawLon,
      doProjTransformFromLonLat,
      projOptions,
      projDisplayProjection,
    ]);

    const handleSave = (e) => {
      e.preventDefault();
      if (x && y) {
        const lonLat = doProjTransformToLonLat(
          [Number(x), Number(y)],
          projOptions[projDisplayProjection]
        );
        doInstrumentsSave(
          Object.assign({}, item, {
            name,
            type_id,
            height: Number(height),
            geometry: {
              type: "Point",
              coordinates: [lonLat[0], lonLat[1]],
            },
          }),
          (updatedItem) => {
            if (addToGroup) {
              doInstrumentGroupInstrumentsSave(
                updatedItem,
                doModalClose,
                true,
                true
              );
            } else {
              doModalClose();
            }
          },
          true
        );
      }
    };

    const handleLocUpdate = () => {
      if (x && y) {
        const lonLat = doProjTransformToLonLat(
          [Number(x), Number(y)],
          projOptions[projDisplayProjection]
        );
        doInstrumentDrawUpdateLoc({ lon: lonLat[0], lat: lonLat[1] });
      }
    };

    const handleSetDisplayProjection = (e) => {
      doProjSetDisplayProjection(e.target.value);
    };

    return (
      <div className="modal-card">
        <form id="instrument-form" onSubmit={handleSave}>
          <header className="modal-card-head">
            <p className="modal-card-title">Edit Instrument</p>
            <button
              type="button"
              onClick={doModalClose}
              className="delete"
            ></button>
          </header>
          <section className="modal-card-body">
            <div className="mb-3">
              <Map
                mapKey="inst-edit"
                height={300}
                options={{ center: [-80.79, 26.94], zoom: 9 }}
              />
            </div>
            <div className="field">
              <label className="label">Name</label>
              <p className="control">
                <input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  className="input"
                  type="text"
                  placeholder="Name"
                />
              </p>
            </div>
            <div className="field">
              <label className="label">Type</label>
              <p className="control">
                <DomainSelect
                  value={type_id}
                  onChange={(e) => {
                    setTypeId(e.target.value);
                  }}
                  domain="instrument_type"
                />
              </p>
            </div>
            <div className="field">
              <label className="label">Height</label>
              <p className="control">
                <input
                  value={height}
                  onChange={(e) => {
                    setHeight(e.target.value);
                  }}
                  className="input"
                  type="number"
                  placeholder="Height"
                />
              </p>
            </div>
            <div className="field">
              <label className="label">
                <span style={{ float: "right" }}>
                  Use Projection:
                  <select
                    onChange={handleSetDisplayProjection}
                    value={projDisplayProjection}
                    className="ml-2"
                  >
                    {Object.keys(projOptions).map((key, i) => {
                      return (
                        <option key={i} value={key}>
                          {key}
                        </option>
                      );
                    })}
                  </select>
                </span>
                X Coordinate
              </label>
              <p className="control">
                <input
                  data-key="x"
                  value={x}
                  onChange={(e) => {
                    setX(e.target.value);
                  }}
                  onBlur={handleLocUpdate}
                  className="input"
                  type="number"
                  placeholder="Longitude in DD"
                />
              </p>
            </div>
            <div className="field">
              <label className="label">Y Coordinate</label>
              <p className="control">
                <input
                  data-key="y"
                  value={y}
                  onChange={(e) => {
                    setY(e.target.value);
                  }}
                  onBlur={handleLocUpdate}
                  className="input"
                  type="number"
                  placeholder="Latitude in DD"
                />
              </p>
            </div>
          </section>
          <footer className="modal-card-foot">
            <button type="submit" className="button is-primary">
              Save changes
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                doModalClose();
              }}
              className="button"
            >
              Cancel
            </button>
          </footer>
        </form>
      </div>
    );
  }
);
