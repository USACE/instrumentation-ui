import React, { useState, useEffect } from 'react';
import { connect } from 'redux-bundler-react';
import { SettingsOutlined } from '@mui/icons-material';

import AlertForm from './alert-editor-form';
import AlertFormModal from './alert-form';
import AlertConfigSettings from './alert-config-form';
import Button from '../../../app-components/button';
import { classArray } from '../../../common/helpers/utils';

export default connect(
  'selectAlertConfigsByRouteByInstrumentId',
  'doModalOpen',
  ({ alertConfigsByRouteByInstrumentId: alerts, doModalOpen }) => {
    const [selectedAlert, setSelectedAlert] = useState(null);

    useEffect(() => {
      if (alerts.length && !selectedAlert) setSelectedAlert(alerts[0]);
    }, [alerts, selectedAlert]);

    const openSettingsModal = (e, a) => {
      e.preventDefault();
      e.stopPropagation();

      doModalOpen(AlertConfigSettings, { item: a });
    };

    const alertListItem = (a, i) => {
      const classes = classArray([
        'list-group-item',
        'list-group-item-action',
        a && selectedAlert && a.id === selectedAlert.id ? 'active' : '',
      ]);

      return (
        <li
          key={i}
          className={classes}
          onClick={() => setSelectedAlert(a)}
        >
          {a.name}
          <span className='float-right pointer' style={{ zIndex: 111 }} onClick={(e) => openSettingsModal(e, a)} title='Open Configuration Settings'>
            <SettingsOutlined fontSize='small' />
          </span>
        </li >
      );
    };

    return (
      <div className='row'>
        <div className='col-3'>
          <div className='d-flex align-items-center justify-content-between my-2'>
            <span>
              <strong>Select an Alert</strong>
            </span>
            <Button
              isOutline
              variant='success'
              size='small'
              handleClick={() => {
                doModalOpen(AlertFormModal, { item: {} });
                // eslint-disable-next-line no-console
                console.log('Clicked the new alert button');
              }}
              text='+ New Alert'
              title='New Alert Configuration'
            />
          </div>
          <ul className='list-group'>
            {alerts.map((a, i) => alertListItem(a, i))}
          </ul>
        </div>
        <div className='col'>
          {selectedAlert && <AlertForm alert={selectedAlert} />}
        </div>
      </div>
    );
  }
);
