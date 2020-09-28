import React, { useState, useRef, useEffect } from "react";
import { connect } from "redux-bundler-react";
import { AgGridReact } from "ag-grid-react";
import TimeseriesListItem from "./timeseries-list-item";
import TimeseriesForm from "./timeseries-form";
import RoleFilter from "../../../app-components/role-filter";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import "ag-grid-community/dist/styles/ag-theme-balham-dark.css";
import "ag-grid-community/dist/styles/ag-theme-fresh.css";

export default connect(
  "selectProjectsByRoute",
  "selectInstrumentsByRoute",
  "selectInstrumentTimeseriesItemsByRoute",
  "selectTimeseriesMeasurementsItemsObject",
  "doModalOpen",
  "doInstrumentTimeseriesSetActiveId",
  ({
    projectsByRoute: project,
    instrumentsByRoute: instrument,
    instrumentTimeseriesItemsByRoute: timeseries,
    timeseriesMeasurementsItemsObject: measurements,
    doModalOpen,
    doInstrumentTimeseriesSetActiveId,
  }) => {
    const grid = useRef(null);
    const [activeTimeseries, setActiveTimeseries] = useState(null);

    // trigger the fetch for our measurements
    useEffect(() => {
      if (!activeTimeseries) return undefined;
      doInstrumentTimeseriesSetActiveId(activeTimeseries);
    }, [activeTimeseries, doInstrumentTimeseriesSetActiveId]);

    // filter out any timeseries used for constants
    const actualSeries = timeseries.filter((ts) => {
      return instrument.constants.indexOf(ts.id) === -1;
    });

    const data = measurements[activeTimeseries];
    const items = (data && data.items) || [];

    const keys = items && items.length ? Object.keys(items[0]) : [];
    const columnDefs = [
      { headerName: "", valueGetter: "node.rowIndex + 1", width: 40 },
      ...keys
        .filter((key) => {
          return key !== "id";
        })
        .map((key) => {
          return {
            headerName: key.toUpperCase(),
            field: key,
            resizable: true,
            sortable: false,
            filter: true,
            editable: false,
          };
        }),
    ];

    return (
      <div>
        <p>
          Timeseries are the data associated with an instrument. Often there
          will be a single timeseries that will be plotted directly or in
          combination with constants, however some instruments may have multiple
          series of measurements associated with them.
        </p>
        <div className="row">
          <div className="col-3">
            <RoleFilter allowRoles={[`${project.slug.toUpperCase()}.*`]}>
              <button
                className="btn btn-sm btn-outline-secondary mb-2"
                onClick={() => {
                  doModalOpen(TimeseriesForm);
                }}
              >
                <i className="mdi mdi-plus mr-1"></i>New Timeseries
              </button>
            </RoleFilter>
            <ul className="list-group">
              {actualSeries.map((ts, i) => {
                return (
                  <TimeseriesListItem
                    key={i}
                    active={activeTimeseries === ts.id}
                    item={ts}
                    onClick={(item) => {
                      if (activeTimeseries === ts.id)
                        return setActiveTimeseries(null);
                      setActiveTimeseries(item.id);
                    }}
                  />
                );
              })}
            </ul>
          </div>
          <div className="col">
            <div className="mb-2">
              <button
                // disabled={!activeTimeseries}
                disabled={true}
                className="btn btn-sm btn-outline-secondary"
                onClick={() => {}}
              >
                <i className="mdi mdi-upload mr-1"></i>Upload to this timeseries
              </button>
            </div>
            <div
              className="ag-theme-balham"
              style={{
                height: `200px`,
                width: "100%",
              }}
            >
              <AgGridReact
                ref={grid}
                columnDefs={columnDefs}
                rowData={items}
              ></AgGridReact>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
