import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';
import { formatDistance } from 'date-fns';
import { DeleteOutlined, NoteAddOutlined, VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';

import AlertNoteForm from './alert-note-form';
import Button from '../../../app-components/button';

const AlertEntry = connect(
  'selectProfileAlertsByInstrumentId',
  'doAlertReadSave',
  'doAlertUnreadSave',
  'doModalOpen',
  ({
    item,
    profileAlertsByInstrumentId: userAlerts,
    doAlertReadSave,
    doAlertUnreadSave,
    doModalOpen,
  }) => {
    const [isHovered, setIsHovered] = useState(false);

    const timeAgo = formatDistance(new Date(item.create_date), Date.now());

    const userAlert = userAlerts.find(a => a.id === item.id);
    const isRead = userAlert ? userAlert.read : false;
    const toggleRead = (...params) => {
      isRead
        ? doAlertUnreadSave(...params)
        : doAlertReadSave(...params);
    };

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
                <div className='btn-group float-right' role='group' aria-label='Alert Controls' style={{ marginTop: '-17px', marginRight: '-21px' }}>
                  <Button
                    variant='info'
                    size='small'
                    isOutline
                    isDisabled={!userAlert}
                    handleClick={() => toggleRead(item, null, true, true)}
                    title={`Mark as ${isRead ? 'Unread' : 'Read'}`}
                    icon={isRead
                      ? <VisibilityOffOutlined sx={{ fontSize: '12px' }} />
                      : <VisibilityOutlined sx={{ fontSize: '12px' }} />
                    }
                  />
                  <Button
                    variant='info'
                    size='small'
                    isOutline
                    handleClick={() => doModalOpen(AlertNoteForm, { item })}
                    title='Add/Edit Note'
                    icon={<NoteAddOutlined sx={{ fontSize: '12px' }} />}
                  />
                  <Button
                    variant='danger'
                    size='small'
                    isOutline
                    isDisabled={!userAlert}
                    // eslint-disable-next-line no-console
                    handleClick={() => console.log('delete instrument alert')}
                    title='Delete Alert'
                    icon={<DeleteOutlined sx={{ fontSize: '12px' }} color='error' />}
                  />
                </div>
              )}
            </span>
          </>
        </div>
      )
    );
  }
);

export default AlertEntry;
