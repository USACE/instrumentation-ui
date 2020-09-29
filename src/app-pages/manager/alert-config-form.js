import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';

const AlertConfigSettings = connect(
  "doModalClose",
  "doAlertsSave",
  "doAlertSubscribeSave",
  "doAlertUnsubscribeSave",
  "doProfileAlertSubscriptionsSave",
  "selectProfileAlertSubscriptions",
  ({ doModalClose, doAlertsSave, doAlertSubscribeSave, doAlertUnsubscribeSave, doProfileAlertSubscriptionsSave, profileAlertSubscriptions, item }) => {
    const subscription = profileAlertSubscriptions.find(e => e.alert_config_id === item.id);

    const [configSettings, setConfigSettings] = useState(item);
    const [userPreferences, setUserPreferences] = useState({
      isSubscribed: !!subscription,
      muteUi: subscription ? subscription.mute_ui : false,
      muteNotify: subscription ? subscription.mute_notify : false,
    });

    const toggleSubscribe = (active) => {
      if (active) {
        doAlertSubscribeSave(item, null, true, true);
      } else {
        doAlertUnsubscribeSave(item, null, true, true);
      }
    }

    const saveSettings = () => {
      if (configSettings.name !== item.name) {
        doAlertsSave(configSettings, null, true, false);
      }

      if (!!subscription) {
        const putBody = {
          ...subscription,
          mute_ui: userPreferences.muteUi,
          mute_notify: userPreferences.muteNotify,
        };

        doProfileAlertSubscriptionsSave(putBody, null, true, false);
      }

      doModalClose();
    };

    return (
      <div className="modal-content" style={{ overflowY: "auto" }}>
        <header className="modal-header">
          <h5 className="modal-title">Alert Config Settings</h5>
          <span className="pointer" onClick={doModalClose}>
            <i className="mdi mdi-close-circle-outline"></i>
          </span>
        </header>
        <div className="m-3">
          <div className="form-group row mt-2">
            <label htmlFor="alertNameInput" className="col-sm-2 col-form-label">Name</label>
            <div className="col-sm-10">
              <input
                type="text"
                id="alertNameInput"
                className="form-control"
                placeholder="Alert Name"
                value={configSettings.name}
                onChange={e => setConfigSettings({ ...configSettings, name: e.target.value })}
              />
            </div>
          </div>
          <hr />
          <div className="form-group row">
            <label htmlFor="userSubscribe" className="col-sm-3">Subscribed</label>
            <div className="col-sm-9">
              <div className="form-check">
                <input
                  type="checkbox"
                  id="userSubscribe"
                  className="form-check-input"
                  defaultChecked={userPreferences.isSubscribed}
                  onChange={(e) => toggleSubscribe(e.target.checked)}
                />
              </div>
            </div>
          </div>
          {!!subscription && (
            <>
              <div className="form-group row">
                <label htmlFor="userMuteUI" className="col-sm-3">Mute UI</label>
                <div className="col-sm-9">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      id="userMuteUI"
                      className="form-check-input"
                      defaultChecked={userPreferences.muteUi}
                      onChange={() => setUserPreferences({ ...userPreferences, muteUi: !userPreferences.muteUi })}
                    />
                  </div>
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="userMuteNotify" className="col-sm-3">Mute Notify</label>
                <div className="col-sm-9">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      id="userMuteNotify"
                      className="form-check-input"
                      defaultChecked={userPreferences.muteNotify}
                      onChange={() => setUserPreferences({ ...userPreferences, muteNotify: !userPreferences.muteNotify })}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          <div>
            <button className="btn btn-primary mr-2" onClick={saveSettings}>
              Save
            </button>
            <button className="btn btn-secondary" onClick={doModalClose}>
              Cancel
            </button>
            <button className="btn btn-danger float-right">
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }
);

export default AlertConfigSettings;
