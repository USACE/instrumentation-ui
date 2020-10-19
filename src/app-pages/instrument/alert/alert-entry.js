import React from 'react';
import { connect } from 'redux-bundler-react';

const convertTimeAgo = milli => {
  const minutes = milli / 1000 / 60;

  if (minutes < 1) {
    return '< 1 minute';
  }

  if (minutes < 60) {
    return `${Math.floor(minutes)} minute${Math.floor(minutes) !== 1 ? 's' : ''}`;
  }

  const hours = minutes / 60;
  if (hours < 24) {
    return `${Math.floor(hours)} hour${Math.floor(hours) !== 1 ? 's' : ''}`;
  }

  const days = hours / 24;
  return `${Math.floor(days)} day${Math.floor(days) !== 1 ? 's' : ''}`;
}

const AlertEntry = connect(
  'selectProfileAlertsByInstrumentId',
  'doAlertReadSave',
  'doAlertUnreadSave',
  ({ item, profileAlertsByInstrumentId: userAlerts, doAlertReadSave, doAlertUnreadSave }) => {
    const timeAgo = convertTimeAgo(Date.now() - new Date(item.create_date));

    const userAlert = userAlerts.find(a => a.id === item.id);
    const isRead = userAlert ? userAlert.read : false;
    const toggleRead = userAlert ? (...params) => {
      isRead
        ? doAlertUnreadSave(...params)
        : doAlertReadSave(...params)
    } : () => { };

    return (
      item && (
        <div
          className={`alert-container${isRead ? '' : ' unread'}`}
          onClick={() => toggleRead(item, null, true, true)}
        >
          <span className='list-group-item list-group-item-action flex-column align-items-start'>
            <div className='d-flex w-100 justify-content-between'>
              <h5 className='mb-1'>{item.name}</h5>
              <small>{timeAgo}</small>
            </div>
            <p className='mb-1'>{item.body}</p>
          </span>
        </div>
      )
    );
  }
);

export default AlertEntry;
