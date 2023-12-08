import React from 'react';
import { connect } from 'redux-bundler-react';
import { formatDistance } from 'date-fns';

import Card from '../../app-components/card';
import TabContainer from '../../app-components/tab';

import './userProfile.css';

const urlify = str => str?.toLowerCase().split(' ').join('-');

const buildProjectContent = (projects = []) => {
  if (!projects.length) return <p>No Projects!</p>;

  return (
    <div>
      Favorited Project List goes here!
    </div>
  );
};

const buildAlertContent = (alerts = [], onClick = () => {}) => {
  if (!alerts.length) return <p>No alerts!</p>;

  return (
    <>
      {alerts.map(alert => {
        const { project_name, instruments, name, body, read, create_date } = alert;

        return instruments.map(instrument => {
          const { instrument_name, instrument_id } = instrument;

          const url = `/${urlify(project_name)}/instruments/${urlify(instrument_name)}`;
          const timeAgo = formatDistance(new Date(create_date), Date.now());

          return (
            <div
              key={instrument_id}
              onClick={() => onClick(url)}
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
        });
      })}
    </>
  );
};

const UserProfile = connect(
  'selectProfileAlerts',
  'selectAuthTokenPayload',
  'doUpdateRelativeUrl',
  ({ profileAlerts: alerts, authTokenPayload: user, doUpdateRelativeUrl }) => {
    const tabs = [
      {
        title: 'Projects',
        content: buildProjectContent([], doUpdateRelativeUrl),
      },
      {
        title: 'Alerts',
        content: buildAlertContent(alerts, doUpdateRelativeUrl),
      }
    ];

    return (
      <>
        <section className='container-fluid'>
          <div className='row'>
            <div className='col-4 user-container'>
              <p>{user.name}</p>
            </div>
            <div className='col-8'>
              <Card className='p-0 mt-2'>
                <TabContainer tabs={tabs} tabListClass='card-header pb-0' contentClass='card-body limit-height py-0' />
              </Card>
            </div>
          </div>
        </section>
      </>
    );
  }
);

export default UserProfile;
