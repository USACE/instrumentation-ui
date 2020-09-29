import React from 'react';
import { connect } from 'redux-bundler-react';

const UserProfile = connect(
  "selectProfileAlerts",
  ({ profileAlerts: alerts }) => {

    return (
      <div className="row">
        <div className="col-3">
          User Scaffold

          <img alt="User Profile Picture" />
          <p>user.name [last, first m.]</p>
          <p>user.email</p>
        </div>
        <div className="col-9">
          <div>
            Projects Scaffold
            {[].map((p) => (
            <div>
              Favortied Projects
            </div>
          ))}
          </div>
          <div>
            Alerts Scaffold

            My Profile - Alerts: {alerts.length}
            {alerts.map((a) => (
              <div>
                Alert
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

export default UserProfile;
