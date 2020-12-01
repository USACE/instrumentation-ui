import React from 'react';
import { connect } from 'redux-bundler-react';

import { convertTimeAgo } from '../instrument/alert/alert-entry';
import Navbar from '../../app-components/navbar';
import Tab from '../../app-components/tab';

import './userProfile.css';

const urlify = str => str.toLowerCase().split(' ').join('-');

const buildAlertContent = (alerts = []) => {
  if (!alerts.length) return <p>No alerts!</p>;

  return (
    <>
      {alerts.map((alert, i) => {
        const { project_name, instrument_name, name, body, read, create_date } = alert;
        const url = `/instrumentation/${urlify(project_name)}/instruments/${urlify(instrument_name)}`;
        const timeAgo = convertTimeAgo(Date.now() - new Date(create_date));

        return (
          <div
            key={i}
            onClick={() => window.location.assign(url)}
            className={`alert-container${read ? '' : ' unread'} pointer`}
            title={`Go To ${instrument_name}`}
          >
            <span className={`list-group-item flex-column align-items-start${read && ' list-group-item-action'}`}>
              <div className='d-flex w-100 justify-content-between'>
                <h5 className='mb-3'>{name} - {instrument_name}</h5>
                <small>{timeAgo}</small>
              </div>
              <p className='mb-1'>{body}</p>
            </span>
          </div>
        );
      })}
    </>
  );
};

const UserProfile = connect(
  'selectProfileAlerts',
  'selectAuthTokenPayload',
  ({ profileAlerts: alerts, authTokenPayload: user }) => {
    const tabs = [
      {
        title: 'Projects',
        content: <div>Project List Goes Here</div>
      },
      {
        title: 'Alerts',
        content: buildAlertContent(alerts),
      }
    ];

    return (
      <>
        <Navbar theme='primary' />
        <section className='container-fluid'>
          <div className='row'>
            <div className='col-4 user-container'>
              <p>{user.name}</p>
            </div>
            <div className='col-8'>
              <div className='card p-0 mt-2'>
                <Tab.Container tabs={tabs} tabListClass='card-header pb-0' contentClass='card-body' />
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
);

export default UserProfile;
