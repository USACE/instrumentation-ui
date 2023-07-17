import React from 'react';
import { connect } from 'redux-bundler-react';
import { DateTime, Duration } from 'luxon';
import { Circle, EditOutlined } from '@mui/icons-material';

import Button from '../../../../../app-components/button/button';
import Card, { CardBody, CardHeader } from '../../../../../app-components/card';
import { ModalContent, ModalBody, ModalFooter, ModalHeader } from '../../../../../app-components/modal';
import { titlize } from '../../../../../common/helpers/utils';
import NewAlertConfigModal from './newAlertConfigModal';

const formatDuration = isoDuration => {
  if (!isoDuration) return null;

  return Duration.fromISO(isoDuration).toHuman();
};

const AlertConfigDetailModal = connect(
  'doModalClose',
  'doModalOpen',
  'doDeleteProjectAlertConfig',
  ({
    doModalClose,
    doModalOpen,
    doDeleteProjectAlertConfig,
    config,
  }) => {
    const {
      id,
      name,
      body,
      alert_type,
      start_date,
      schedule_interval,
      remind_interval,
      warning_interval,
      last_checked,
      alert_status,
      last_reminded,
      instruments,
      alert_email_subscriptions,
      creator_username,
      create_date,
      updater_username,
      update_date,
    } = config;

    return (
      <ModalContent>
        <ModalHeader title={`${name} - Details`} />
        <ModalBody>
          <Card>
            <CardHeader>
              <b>Configuration</b>
              <Button
                isOutline
                style={{ marginTop: '-3px' }}
                className='float-right'
                size='small'
                variant='info'
                icon={<EditOutlined fontSize='inherit' />}
                title='Edit Alert Configuration'
                handleClick={() => {
                  doModalClose();
                  doModalOpen(NewAlertConfigModal, { isEdit: true, initAlertConfig: config }, 'lg');
                }}
              />
            </CardHeader>
            <CardBody>
              <div className='row col-12'>
                <b>Name:&nbsp;</b>
                <span>{name}</span>
              </div>
              <div className='row col-12'>
                <b>Body:&nbsp;</b>
                <span>{body}</span>
              </div>
              <div className='row col-12'>
                <b>Alert Type:&nbsp;</b>
                <span>{alert_type}</span>
              </div>
              <div className='row col-12'>
                <b>Alert Start Date:&nbsp;</b>
                <span>{DateTime.fromISO(start_date).toLocal().toFormat('LLL dd, yyyy hh:mm:ss')}</span>
              </div>
              <div className='row col-12'>
                <b>Schedule Interval:&nbsp;</b>
                <span>{formatDuration(schedule_interval)}</span>
              </div>
              <div className='row col-12'>
                <b>Reminder Interval:&nbsp;</b>
                <span>{formatDuration(remind_interval) || <i>None</i>}</span>
              </div>
              <div className='row col-12'>
                <b>Warning Interval:&nbsp;</b>
                <span>{formatDuration(warning_interval) || <i>None</i>}</span>
              </div>
              <div className='row col-12'>
                <b>Instruments:&nbsp;</b>
                <span>{instruments.length ? (
                  <>
                    {instruments.map((instrument, i) => {
                      const { instrument_id, instrument_name } = instrument;

                      return (
                        <span key={instrument_id}>
                          {instrument_name}
                          {i !== instruments.length - 1 && ', '}
                        </span>
                      );
                    })}
                  </>
                ) : <i>None</i>}</span>
              </div>
              <div>
                <b>Email Subscriptions:&nbsp;</b>
                <span>{alert_email_subscriptions.length ? (
                  <ul>
                    {alert_email_subscriptions.map(email_sub => {
                      const { email, username, id } = email_sub;

                      return (
                        <li key={id}>
                          {username ? <span><i>{username}</i> - {email}</span> : email}
                        </li>
                      );
                    })}
                  </ul>
                ) : <i>None</i>}</span>
              </div>
            </CardBody>
          </Card>

          <Card className='mt-3'>
            <CardHeader text='Status' />
            <CardBody>
              <div className='row col-12'>
                <b>Alert Status:&nbsp;</b>
                <span>
                  <Circle
                    sx={{ fontSize: '14px', marginBottom: '2px' }}
                    style={{ color: `${alert_status}` }}
                  /> - {titlize(alert_status)}
                </span>
              </div>
              <div className='row col-12'>
                <b>Last Checked:&nbsp;</b>
                <span>{last_checked ? DateTime.fromISO(last_checked).toFormat('LLL dd, yyyy hh:mm:ss') : <i>Not checked</i>}</span>
              </div>
              <div className='row col-12'>
                <b>Last Reminded:&nbsp;</b>
                <span>{last_reminded ? DateTime.fromISO(last_reminded).toFormat('LLL dd, yyyy hh:mm:ss') : <i>No reminders sent</i>}</span>
              </div>
            </CardBody>
          </Card>

          <Card className='mt-3'>
            <CardHeader text='Misc. Information' />
            <CardBody>
              <div className='row col-12'>
                <b>Created By:&nbsp;</b>
                <span>{creator_username}</span>
              </div>
              <div className='row col-12'>
                <b>Created On:&nbsp;</b>
                <span>{DateTime.fromISO(create_date).toFormat('LLL dd, yyyy hh:mm:ss')}</span>
              </div>
              <div className='row col-12'>
                <b>Last Updated By:&nbsp;</b>
                <span>{updater_username || <i>Not Updated</i>}</span>
              </div>
              <div className='row col-12'>
                <b>Last Updated On:&nbsp;</b>
                <span>{update_date ? DateTime.fromISO(update_date).toFormat('LLL dd, yyyy hh:mm:ss') : <i>Not Updated</i>}</span>
              </div>
            </CardBody>
          </Card>
        </ModalBody>
        <ModalFooter
          showCancelButton
          onDelete={() => doDeleteProjectAlertConfig(id)}
          showSaveButton={false}
          cancelText='Close'
        />
      </ModalContent>
    );
  },
);

export default AlertConfigDetailModal;
