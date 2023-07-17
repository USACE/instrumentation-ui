import React, { useReducer } from 'react';
import { connect } from 'redux-bundler-react';
import ReactDatePicker from 'react-datepicker';
import Select from 'react-select';

import { ModalContent, ModalBody, ModalFooter, ModalHeader } from '../../../../../app-components/modal';
import { isSaveDisabled, reduceState, initState } from '../../../../../common/helpers/form-helpers';
import { DateTime } from 'luxon';

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

const buildSubmittalOptions = (submittals = []) => (
  submittals.map(s => {
    const { id, create_date, due_date, alert_config_name, alert_type_name } = s;

    if (alert_type_name === 'Timeseries Measurement Submittal') return null;

    return {
      label: `${alert_config_name} | ${DateTime.fromISO(create_date).toFormat('LLL dd, yyyy HH:mm')} - ${DateTime.fromISO(due_date).toFormat('LLL dd, yyyy HH:mm')}`,
      value: id,
    }
  }).filter(el => el)
);

const defaultFormState = {
  name: '',
  body: '',
  instruments: [],
  start_date: '',
  end_date: '',
  alert_config_id: '',
  submittal_id: '',
};

const optionalFields = ['alert_config_id', 'submittal_id'];

const NewEvaluationModal = connect(
  'doModalClose',
  'doCreateQualityControlEvaluation',
  'selectInstrumentsItems',
  'selectSubmittalsMissing',
  ({
    doModalClose,
    doCreateQualityControlEvaluation,
    instrumentsItems: instruments,
    submittalsMissing,
  }) => {
    const [formState, dispatch] = useReducer(reduceState, initState(defaultFormState));

    return (
      <ModalContent style={{ overflow: 'visible' }}>
        <ModalHeader title='Submit New Evaluation' />
        <ModalBody style={{ overflow: 'visible' }}>
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

          <hr className='mb-3 mt-1' />
          <div className='row mx-0 no-gutters'>
            <div className='form-group col-12'>
              <label>Select Missing Submittal (Optional): </label>
              {submittalsMissing.length ? (
                <Select
                  isClearable
                  isSearchable
                  options={buildSubmittalOptions(submittalsMissing)}
                  onChange={(value) => dispatch({ type: 'update', key: 'submittal_id', data: value?.value })}
                  styles={{
                    menuList: base => ({
                      ...base,
                      maxHeight: '200px',
                    })
                  }}
                />
              ) : <div><i>No Alerts Configured for this Project</i></div>}
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
