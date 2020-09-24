import React, { useState, useEffect } from "react";
import { connect } from "redux-bundler-react";

import AlertForm from "./alert-editor-form";
import InstrumentForm from "../../manager/alert-form";

export default connect(
  "selectAlertsByRouteByInstrumentId",
  "doModalOpen",
  ({ alertsByRouteByInstrumentId: alerts, doModalOpen }) => {
    const [selectedAlert, setSelectedAlert] = useState(null);

    useEffect(() => {
      if (alerts.length && !selectedAlert) setSelectedAlert(alerts[0]);
    }, [alerts, selectedAlert]);

    return (
      <div>
        <div className="row">
          <div className="col-3">
            <div className="d-flex align-items-center justify-content-between my-2">
              <span>
                <strong>Select an Alert</strong>
              </span>
              <button
                onClick={() => {
                  doModalOpen(InstrumentForm, { item: {} });
                  console.log("Clicked the new alert button");
                }}
                className="btn btn-sm btn-success"
              >
                New +
              </button>
            </div>
            <ul className="list-group">
              {alerts.map((a, i) => {
                return (
                  <li
                    key={i}
                    className={`list-group-item list-group-item-action ${
                      a && selectedAlert && a.id === selectedAlert.id
                        ? "active"
                        : ""
                      }`}
                    onClick={() => {
                      console.log(a);
                      setSelectedAlert(a);
                    }}
                  >
                    {a.name}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="col">
            {selectedAlert && <AlertForm alert={selectedAlert} />}
          </div>
        </div>
      </div>
    );
  }
);
