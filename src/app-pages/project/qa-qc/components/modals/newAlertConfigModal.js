import React, { useState, useReducer, useEffect } from 'react';
import ReactDatePicker from 'react-datepicker';
import Select from 'react-select';
import { connect } from 'redux-bundler-react';
import { DateTime, Duration } from 'luxon';

import DomainSelect from '../../../../../app-components/domain-select';
import IntervalSelection from '../intervalSelection';
import HelperTooltip from '../../../../../app-components/helper-tooltip';
import { ModalContent, ModalBody, ModalFooter, ModalHeader } from '../../../../../app-components/modal';
import { reduceState, initState } from '../../../../../common/helpers/form-helpers';
import { isSaveDisabled } from '../../../../../common/helpers/form-helpers';

const initStartDate = () => {
  const date = new Date(Date.now());
  date.setHours(8, 0, 0);
  return date;
};

const buildInstrumentOptions = (instruments = []) => (
  instruments.map(instrument => {
    const { name, id, status } = instrument;

    if (status !== 'active') return null;
    
    return {
      label: name,
      value: id,
    };
  }).filter(e => e)
);

const cleanInstrumentOptions = (instruments = []) => (
  instruments.map(instrument => {
    const { instrument_id, instrument_name } = instrument;

    return {
      label: instrument_name,
      value: instrument_id,
    };
  }).filter(e => e)
);

const cleanInterval = isoInterval => {
  const obj = Duration.fromISO(isoInterval).toObject();
  const keys = Object.keys(obj);

  return keys.length ? {
    number: obj[keys[0]],
    duration: {
      label: keys[0],
      value: keys[0],
    }
  } : {};
};

const cleanEmails = (email_subscriptions = [], hasProfile) => {
  if (hasProfile) {
    const profileEmails = email_subscriptions.filter(el => el.user_type === 'profile');

    return profileEmails.map(el => ({
      ...el,
      label: `${el.username} | ${el.email}`,
      value: el.id,
    }));
  } else {
    const emails = email_subscriptions.filter(el => el.user_type === 'email');

    return emails.map(el => el.email).join(', ');
  }
};

const cleanFormat = initConfig => {
  const { last_checked, last_reminded, updater_username, updater, update_date, ...rest } = initConfig;
  const { start_date, schedule_interval, warning_interval, remind_interval, instruments, alert_email_subscriptions } = rest;

  const cleanStartDate = DateTime.fromISO(start_date).toLocal().toJSDate();

  const ret = {
    ...rest,
    start_date: cleanStartDate,
    schedule_interval: cleanInterval(schedule_interval),
    warning_interval: cleanInterval(warning_interval),
    remind_interval: cleanInterval(remind_interval),
    instruments: cleanInstrumentOptions(instruments),
    alert_email_subscriptions: cleanEmails(alert_email_subscriptions, true),
    additional_emails: cleanEmails(alert_email_subscriptions, false),
  };

  return ret;
};

const defaultFormState = {
  name: '',
  body: '',
  instruments: [],
  start_date: initStartDate(),
  alert_type_id: '',
  schedule_interval: {},
  warning_interval: { 'weeks': 1 },
  remind_interval: { 'days': 3 },
  n_missed_before_alert: 1,
  alert_email_subscriptions: [],
  additional_emails: '',
};

const NewAlertConfigModal = connect(
  'doModalClose',
  'doTypeaheadQueryUpdated',
  'doCreateProjectAlertConfigs',
  'doUpdateProjectAlertConfigs',
  'selectUsersItems',
  'selectInstrumentsItems',
  'selectDomainsItemsByGroup',
  ({
    doModalClose,
    doTypeaheadQueryUpdated,
    doCreateProjectAlertConfigs,
    doUpdateProjectAlertConfigs,
    usersItems,
    instrumentsItems: instruments,
    domainsItemsByGroup,
    isEdit = false,
    initAlertConfig = {},
  }) => {
    const [formState, dispatch] = useReducer(reduceState, initState(isEdit ? cleanFormat(initAlertConfig) : defaultFormState));
    const [filterItems, setFilterItems] = useState([]);

    const { id: alertConfigId } = initAlertConfig;

    const optionalFields = [
      'warning_interval',
      'remind_interval',
      'additional_emails',
      formState.alert_type?.val === domainsItemsByGroup['alert_type'].find(el => el.value === 'Evaluation Submittal')?.id && 'instruments',
    ].filter(e => e);

    useEffect(() => {
      const newItems = (usersItems || []).map(elem => {
        const { username, email, id } = elem;
  
        return {
          ...elem,
          label: `${username} | ${email}`,
          text: `${username} | ${email}`,
          value: id,
        };
      });

      setFilterItems(newItems);
    }, [usersItems, setFilterItems]);

    return (
      <ModalContent style={{ overflowY: 'visible' }}>
        <ModalHeader title={`${isEdit ? 'Edit' : 'New'} Alert Configuration`} />
        <ModalBody style={{ overflowY: 'visible' }}>
          <div className='form-group'>
            <label>Alert Name: </label>
            <input
              className='form-control'
              type='text'
              placeholder='Alert Name...'
              maxLength={480}
              value={formState.name?.val}
              onChange={e => dispatch({ type: 'update', key: 'name', data: e.target.value })}
            />
          </div>
          <div className='form-group'>
            <label>Alert Body: </label>
            <textarea
              className='form-control'
              placeholder='Alert Body...'
              rows={3}
              value={formState.body?.val}
              onChange={e => dispatch({ type: 'update', key: 'body', data: e.target.value })}
            />
          </div>
          <div className='row mx-0 no-gutters'>
            <div className='form-group pr-2 col-6'>
              <label>Alert Type: </label>
              <DomainSelect
                value={formState.alert_type_id?.val}
                onChange={val => dispatch({ type: 'update', key: 'alert_type_id', data: val })}
                domain='alert_type'
              />
            </div>
            <div className='form-group pl-2 col-6'>
              <label>Alert Check Start Date:</label>
              <HelperTooltip
                id='alert-start-help'
                content={
                  <span>
                    The date at which the system will begin to evaluate the supplied
                    <br />
                    conditions. Alert messages will not be sent prior to this date.
                  </span>
                }
              />
              <ReactDatePicker
                showTimeInput
                placeholderText='mm/dd/yyyy h:mm'
                dateFormat='MM/dd/yyyy  h:mm aa'
                className='form-control'
                minDate={Date.now()}
                selected={formState.start_date?.val}
                onChange={(date) => dispatch({ type: 'update', key: 'start_date', data: date })}
              />
            </div>
          </div>
          {instruments.length && (
            <div className='form-group'>
              <label>Instruments: </label>
              <Select
                isMulti
                isClearable
                isSearchable
                closeMenuOnSelect={false}
                defaultValue={formState.instruments?.val || undefined}
                options={buildInstrumentOptions(instruments)}
                onChange={(values) => dispatch({ type: 'update', key: 'instruments', data: values })}
              />
            </div>
          )}
          <div className='row mx-0 border p-2 pt-3 mb-2'>
            <div className='col-4'>
              <HelperTooltip
                id='interval-help'
                className='pr-2 d-inline'
                content={
                  <span>
                    The following intervals are used to determine the frequency of messages sent to the subscribed emails.
                    <br /><br />
                    <b>Schedule Interval:&nbsp;</b>The frequency at which the alerts' conditions need to be fulfilled by. An alert<br />
                    &emsp;will be sent once on this interval timeframe. <i>Note that consecutive intervals with failed conditions will</i><br />
                    &emsp;<i>only send reminder messages.</i>
                    <br/>
                    <b>Warning Interval:&nbsp;</b>The timeframe prior to the alerts' next scheduled check. A message will<br />
                    &emsp;be sent at this timeframe once per scheduled interval.
                    <br />
                    <b>Reminder Interval:&nbsp;</b>The timeframe after an alert has been sent to send a follow-up message.<br />
                    &emsp;This reminder interval will continue to send messages at the given interval until the <br />
                    &emsp;alerts' conditions have been fulfilled.
                  </span>
                }
              />
              <label>Schedule Interval: </label>
              <div className='row no-gutters'>
                <IntervalSelection
                  defaultSelection={isEdit ? formState.schedule_interval?.val : {}}
                  onChange={(value) => dispatch({ type: 'update', key: 'schedule_interval', data: value })}
                />
              </div>
            </div>
            <div className='col-4'>
              <label>Warning Interval (optional): </label>
              <IntervalSelection
                defaultSelection={isEdit ? formState.warning_interval?.val : { number: 1, duration: { label: 'weeks', value: 'weeks' } }}
                onChange={(value) => dispatch({ type: 'update', key: 'warning_interval', data: value })}
              />
            </div>
            <div className='col-4'>
              <label>Reminder Interval (optional): </label>
              <IntervalSelection
                defaultSelection={isEdit ? formState.remind_interval?.val : { number: 3, duration: { label: 'days', value: 'days' } }}
                onChange={(value) => dispatch({ type: 'update', key: 'remind_interval', data: value })}
                isMinDays
              />
            </div>
          </div>
          <div className='form-group'>
            <label>
              Number of Missed Intervals to Trigger Alert: 
            </label>
            <input
              type='text'
              className='form-control'
              style={{ width: '75px' }}
              value={formState.n_missed_before_alert?.val}
              onChange={e => {
                const regex = /^[0-9\b]+$/;
                if (e.target.value === '' || regex.test(e.target.value)) {
                  dispatch({ type: 'update', key: 'n_missed_before_alert', data: e.target.value });
                }
              }}
            />
          </div>
          <div className='form-group'>
            <label>Email Subscriptions: </label>
            <Select
              isClearable
              isMulti
              options={filterItems}
              defaultValue={isEdit ? formState.alert_email_subscriptions?.val : undefined}
              onChange={values => dispatch({ type: 'update', key: 'alert_email_subscriptions', data: values })}
              onInputChange={input => doTypeaheadQueryUpdated(input)}
            />
            <label className='mt-2 font-italic'>Non-MIDAS Users (Optional):</label>
            <HelperTooltip
              id='auto-range-help'
              place='right'
              content={
                <span>
                  Manually enter additional emails in the box below to include in the email alerts.
                  <br/>
                  Separate multiple emails with a comma (<b> , </b>).
                  <br /><br />
                  <b>Verify any email addresses entered are valid and correct prior to saving.</b>
                </span>
              }
            />
            <textarea
              className='form-control'
              placeholder='Additional Emails...'
              rows={3}
              value={formState.additional_emails?.val}
              onChange={e => dispatch({ type: 'update', key: 'additional_emails', data: e.target.value })}
            />
          </div>
        </ModalBody>
        <ModalFooter
          customClosingLogic
          saveText='Submit'
          saveIsDisabled={isSaveDisabled(formState, optionalFields)}
          onSave={() => {
            isEdit
              ? doUpdateProjectAlertConfigs(formState, alertConfigId, doModalClose)
              : doCreateProjectAlertConfigs(formState, doModalClose);
          }}
          onCancel={doModalClose}
        />
      </ModalContent>
    );
  }
);

export default NewAlertConfigModal;
