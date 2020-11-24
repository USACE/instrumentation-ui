import React, { useState } from "react";
import { connect } from "redux-bundler-react";

export default connect(
  "doModalClose",
  "doCollectionGroupAddTimeseries",
  "selectCollectionGroupByRoute",
  "doInstrumentTimeseriesFetch",
  "selectInstrumentTimeseriesItemsArray",
  ({
    doModalClose,
    doCollectionGroupAddTimeseries,
    collectionGroupByRoute: collectionGroup,
    doInstrumentTimeseriesFetch,
    instrumentTimeseriesItemsArray: timeseries,
  }) => {
    const [timeseriesSelected, setTimeseriesSelected] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const handleClickAdd = (e) => {
      e.preventDefault();
      if (!timeseriesSelected) {
        console.log("No Timeseries Selected; Skipping POST");
        return;
      }
      doCollectionGroupAddTimeseries({
        projectId: collectionGroup.project_id,
        collectionGroupId: collectionGroup.id,
        timeseriesId: timeseriesSelected.id,
      });
    };

    return (
      <div className="modal-content" style={{ overflow: "visible" }}>
        <header className="modal-header">
          <h5 className="modal-title">Add Field</h5>
          <span className="pointer" onClick={doModalClose}>
            <i className="mdi mdi-close-circle-outline"></i>
          </span>
        </header>
        <section className="modal-body" style={{ overflow: "visible" }}>
          <div className="dropdown">
            <button
              className="btn btn-secondary dropdown-toggle w-100"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              onClick={(e) => setDropdownVisible(!dropdownVisible)}
            >
              {(timeseriesSelected &&
                timeseriesSelected.name &&
                timeseriesSelected.instrument &&
                `${timeseriesSelected.instrument}  |  ${timeseriesSelected.name}`) ||
                "Select a Timeseries"}
            </button>
            <div
              className={`dropdown-menu ${dropdownVisible ? "show" : ""}`}
              aria-labelledby="dropdownMenuButton"
            >
              {timeseries.map((t, idx) => (
                <span
                  key={idx}
                  onClick={(e) => {
                    setTimeseriesSelected(t);
                    setDropdownVisible(false);
                  }}
                  className="dropdown-item"
                >{`${t.instrument}  |  ${t.name}`}</span>
              ))}
            </div>
          </div>
        </section>
        <footer
          className="modal-footer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <button
              onClick={(e) => handleClickAdd(e)}
              className="btn btn-primary mr-2"
            >
              Add
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                doModalClose();
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
          <div></div>
        </footer>
      </div>
    );
  }
);
