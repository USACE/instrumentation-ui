import React, { useState, useEffect } from "react";
import { connect } from "redux-bundler-react";

import AlertForm from "./alert-editor-form";
import AlertFormModal from "../../manager/alert-form";
import AlertConfigSettings from '../../manager/alert-config-form';

export default connect(
  "selectAlertConfigsByRouteByInstrumentId",
  "doModalOpen",
  ({ alertConfigsByRouteByInstrumentId: alerts, doModalOpen }) => {
    const [selectedAlert, setSelectedAlert] = useState(null);

    useEffect(() => {
      if (alerts.length && !selectedAlert) setSelectedAlert(alerts[0]);
    }, [alerts, selectedAlert]);

    const openSettingsModal = (e, a) => {
      e.preventDefault();
      e.stopPropagation();

      doModalOpen(AlertConfigSettings, { item: a })
    };

    const alertListItem = (a, i) => {
      const classes = [
        'list-group-item',
        'list-group-item-action',
        a && selectedAlert && a.id === selectedAlert.id ? 'active' : '',
      ].join(' ');

      return (
        <li
          key={i}
          className={classes}
          onClick={() => {
            console.log(a);
            setSelectedAlert(a);
          }}
        >
          {a.name}
          <span className="float-right pointer" style={{ zIndex: 111 }} onClick={(e) => openSettingsModal(e, a)}>
            <i className="mdi mdi-cog-outline" />
          </span>
        </li >
      );
    };

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
                  doModalOpen(AlertFormModal, { item: {} });
                  console.log("Clicked the new alert button");
                }}
                className="btn btn-sm btn-success"
              >
                New +
              </button>
            </div>
            <ul className="list-group">
              {alerts.map((a, i) => alertListItem(a, i))}
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
