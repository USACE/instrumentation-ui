import React from 'react';
import { connect } from 'redux-bundler-react';
import Navbar from '../../app-components/navbar';
import Tab from '../../app-components/tab';

import './userProfile.css';

const UserProfile = connect(
  "selectProfileAlerts",
  "selectAuthTokenPayload",
  ({ profileAlerts: alerts, authTokenPayload: user }) => {
    const tabs = [
      {
        title: 'Projects',
        content: <div>Project List Goes Here</div>
      },
      {
        title: 'Alerts',
        content: <div>User Subscribed Alerts Go Here</div>
      }
    ];

    return (
      <>
        <Navbar theme='primary' fixed />
        <section className='container-fluid' style={{ marginTop: '4.65rem' }}>
          <div className="row">
            <div className="col-4 user-container">
              User Scaffold
              <p>
                {user.name}
              </p>
            </div>
            <div className="col-8">
              <Tab.Container tabs={tabs} className='mt-2' />
            </div>
          </div>
        </section>
      </>
    );
  }
);

export default UserProfile;
