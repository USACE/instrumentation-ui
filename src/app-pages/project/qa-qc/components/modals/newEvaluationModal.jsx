import React, { useReducer } from 'react';
import { connect } from 'redux-bundler-react';
import ReactDatePicker from 'react-datepicker';
import Select from 'react-select';

import { ModalContent, ModalBody, ModalFooter, ModalHeader } from '../../../../../app-components/modal';
import { isSaveDisabled, reduceState, initState } from '../../../../../common/helpers/form-helpers';

const buildInstrumentOptions = (instruments = []) => (
  instruments.map(instrument => {
    const { name, id, status } = instrument;

    if (status !== 'active') return null;
    
    return {
      label: name,
      value: id,
    };
  }).filter(el => el)
);

const buildAlertOptions = (alerts = [], evalAlertTypeId) => (
  alerts.map(alert => {
    const { name, id, alert_type_id } = alert;

    if (alert_type_id !== evalAlertTypeId) return null;

    return {
      label: name,
      value: id,
    };
  }).filter(el => el)
);

const defaultFormState = {
  name: '',
  body: '',
  instruments: [],
  start_date: '',
  end_date: '',
  alert_config_id: '',
};

const optionalFields = ['alert_config_id'];

const NewEvaluationModal = connect(
  'doModalClose',
  'doCreateQualityControlEvaluation',
  'selectInstrumentsItems',
  'selectProjectAlertConfigs',
  'selectDomainsItemsByGroup',
  ({
    doModalClose,
    doCreateQualityControlEvaluation,
    instrumentsItems: instruments,
    projectAlertConfigs,
    domainsItemsByGroup: domains,
  }) => {
    const [formState, dispatch] = useReducer(reduceState, initState(defaultFormState));

    const evalAlertTypeId = domains['alert_type'].find(el => el.value === 'Evaluation Submittal')?.id;

    return (
      <ModalContent style={{ overflowY: 'visible' }}>
        <ModalHeader title='Submit New Evaluation' />
        <ModalBody style={{ overflowY: 'visible' }}>
          <div className='form-group'>
            <label>Evaluation Name: </label>
            <input
              className='form-control'
              type='text'
              placeholder='Evaluation Name...'
              maxLength={480}
              value={formState.name?.val}
              onChange={e => dispatch({ type: 'update', key: 'name', data: e.target.value })}
            />
          </div>
          <div className='form-group'>
            <label>Evaluation Body: </label>
            <textarea
              className='form-control'
              placeholder='Evaluation Body...'
              rows={3}
              value={formState.body?.val}
              onChange={e => dispatch({ type: 'update', key: 'body', data: e.target.value })}
            />
          </div>
          <div className='form-group'>
            <label>Associated Alert (Optional): </label>
            {projectAlertConfigs.length ? (
              <Select
                isClearable
                isSearchable
                options={buildAlertOptions(projectAlertConfigs, evalAlertTypeId)}
                onChange={(value) => dispatch({ type: 'update', key: 'alert_config_id', data: value?.value })}
              />
            ) : <div><i>No Alerts Configured for this Project</i></div>}
          </div>
          {instruments.length && (
            <div className='form-group'>
              <label>Instruments Evaluated: </label>
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
          <div className='row mx-0 no-gutters'>
            <div className='form-group pr-2 col-6'>
              <label>Dataset Start Date:</label>
              <ReactDatePicker
                placeholderText='mm/dd/yyyy'
                className='form-control'
                maxDate={formState.end_date?.val || Date.now()}
                selected={formState.start_date?.val}
                onChange={(date) => dispatch({ type: 'update', key: 'start_date', data: date })}
              />
            </div>
            <div className='form-group pl-2 col-6'>
              <label>Dataset End Date:</label>
              <ReactDatePicker
                placeholderText='mm/dd/yyyy'
                className='form-control'
                minDate={formState.start_date?.val || null}
                maxDate={Date.now()}
                selected={formState.end_date?.val}
                onChange={(date) => dispatch({ type: 'update', key: 'end_date', data: date })}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter
          saveText='Submit'
          saveIsDisabled={isSaveDisabled(formState, optionalFields)}
          onSave={() => doCreateQualityControlEvaluation(formState)}
          onCancel={doModalClose}
        />
      </ModalContent>
    );
  }
);

export default NewEvaluationModal;
