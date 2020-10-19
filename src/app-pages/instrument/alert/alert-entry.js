import React, { useState } from 'react';
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
    const [isHovered, setIsHovered] = useState(false);
    const [noteIsOpen, setNoteIsOpen] = useState(false);

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
          onMouseOver={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`alert-container${isRead ? '' : ' unread'}`}
        >
          <>
            <span className={`list-group-item flex-column align-items-start${isRead && ' list-group-item-action'}`}>
              <div className='d-flex w-100 justify-content-between'>
                <h5 className='mb-1'>{item.name}</h5>
                <small>{timeAgo}</small>
              </div>
              <p className='mb-1'>{item.body}</p>
              {isHovered && (
                <div className="btn-group float-right" role="group" aria-label="Alert Controls" style={{ marginTop: '-17px', marginRight: '-21px' }}>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-info"
                    onClick={() => toggleRead(item, null, true, true)}
                    title={`Mark as ${isRead ? 'Unread' : 'Read'}`}
                  >
                    <i className={`mdi ${isRead ? 'mdi-eye-off-outline' : 'mdi-eye-outline'}`} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-info"
                    onClick={() => setNoteIsOpen(!noteIsOpen)}
                    title="Add/Edit Note"
                  >
                    <i className='mdi mdi-note-plus-outline' />
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    title='Delete'
                  >
                    <i className='mdi mdi-trash-can-outline' />
                  </button>
                </div>
              )}
            </span>
            {noteIsOpen && (
              <>HELLO!</>
            )}
          </>
        </div>
      )
    );
  }
);

export default AlertEntry;
