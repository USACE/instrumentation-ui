import React, { useState, useReducer, useEffect } from 'react';
import { connect } from 'redux-bundler-react';
import ReactDatePicker from 'react-datepicker';
import Select from 'react-select';
import { Tooltip } from 'react-tooltip';

import DomainSelect from '../../../../../app-components/domain-select';
import Icon from '../../../../../app-components/icon';
import IntervalSelection from '../intervalSelection';
import { ModalContent, ModalBody, ModalFooter, ModalHeader } from '../../../../../app-components/modal';
import { reduceState, initState } from '../../../../../common/helpers/form-helpers';
import { isSaveDisabled } from '../../../../../common/helpers/form-helpers';

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

const defaultFormState = {
  name: '',
  body: '',
  instruments: [],
  start_date: '',
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
  'selectUsersItems',
  'selectInstrumentsItems',
  'selectDomainsItemsByGroup',
  ({
    doModalClose,
    doTypeaheadQueryUpdated,
    doCreateProjectAlertConfigs,
    usersItems,
    instrumentsItems: instruments,
    domainsItemsByGroup,
  }) => {
    const [formState, dispatch] = useReducer(reduceState, initState(defaultFormState));
    const [filterItems, setFilterItems] = useState([]);

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
        <ModalHeader title='New Alert Configuration' />
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
              <label>Alert Start Date:</label>
              <ReactDatePicker
                placeholderText='mm/dd/yyyy'
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
                options={buildInstrumentOptions(instruments)}
                onChange={(values) => dispatch({ type: 'update', key: 'instruments', data: values })}
              />
            </div>
          )}
          <div className='row mx-0'>
            <div className='col-4'>
              <label>Schedule Interval: </label>
              <div className='row no-gutters'>
                <IntervalSelection onChange={(value) => dispatch({ type: 'update', key: 'schedule_interval', data: value })} />
              </div>
            </div>
            <div className='col-4'>
              <label>Warning Interval (optional): </label>
              <IntervalSelection
                defaultSelection={{ number: 1, duration: { label: 'weeks', value: 'weeks' } }}
                onChange={(value) => dispatch({ type: 'update', key: 'warning_interval', data: value })}
              />
            </div>
            <div className='col-4'>
              <label>Reminder Interval (optional): </label>
              <IntervalSelection
                defaultSelection={{ number: 3, duration: { label: 'days', value: 'days' } }}
                onChange={(value) => dispatch({ type: 'update', key: 'remind_interval', data: value })}
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
              onChange={values => dispatch({ type: 'update', key: 'alert_email_subscriptions', data: values })}
              onInputChange={input => doTypeaheadQueryUpdated(input)}
            />
            <label className='mt-2 font-italic'>Non-MIDAS Users (Optional):</label>
            <Icon
              id='auto-range-help'
              className='pl-2 d-inline'
              icon='help-circle-outline'
              style={{
                fontSize: '18px',
              }}
            />
            <Tooltip
              anchorId='auto-range-help'
              effect='solid'
              place='right'
              content={
                <span>
                  Manually enter additional emails in the box below to include in the email alerts.
                  <br/>
                  Separate multiple emails with a comma (<b> , </b>).
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
          onSave={() => doCreateProjectAlertConfigs(formState, doModalClose)}
          onCancel={doModalClose}
        />
      </ModalContent>
    );
  }
);

export default NewAlertConfigModal;
