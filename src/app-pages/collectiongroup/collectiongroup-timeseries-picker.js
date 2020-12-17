import React, { useState } from "react";
import { connect } from "redux-bundler-react";

import { ModalFooter, ModalHeader } from "../../app-components/modal";

export default connect(
  "doModalClose",
  "doCollectionGroupAddTimeseries",
  "selectCollectionGroupByRoute",
  "selectInstrumentTimeseriesItemsByRoute",
  ({
    doModalClose,
    doCollectionGroupAddTimeseries,
    collectionGroupByRoute: collectionGroup,
    instrumentTimeseriesItemsByRoute: timeseries,
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
        <ModalHeader title='Add Field' />
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
              style={{ maxHeight: 240, overflow: "auto" }}
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
        <ModalFooter
          customClosingLogic
          saveText='Add'
          onSave={(e) => handleClickAdd(e)}
          onCancel={(e) => {
            e.preventDefault();
            doModalClose();
          }}
        />
      </div>
    );
  }
);
