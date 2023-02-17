import React, { useState } from 'react';
import Select from 'react-select';
import { connect } from 'redux-bundler-react';

import * as Modal from '../../../../app-components/modal';

const generateInstrumentOptions = (instruments = []) => (
  instruments.map(i => ({
    label: i.name,
    value: i.id,
  }))
);

const generateTimeseriesOptions = (timeseries = {}, selectedInstrument) => {
  const tIds = Object.keys(timeseries);

  return tIds.map(t => {
    if (timeseries[t].instrument_id === selectedInstrument) {  
      return ({
        label: timeseries[t].name,
        value: t,
      });
    }
  }).filter(e => e);
};

const getInstrumentValue = (instruments, instrumentId) => {
  const i = instruments.find(el => el.id === instrumentId);

  return i ? {
    label: i.name,
    value: i.id,
  } : null;
};

const getTimeseriesValue = (timeseries, timeseriesId) => {
  const ts = timeseries[timeseriesId];

  return timeseriesId ? {
    label: ts.name,
    value: ts.id,
  } : null;
};

const EditMappingRowModal = connect(
  'doCreateNewDataLogger',
  'selectInstrumentsItems',
  'selectInstrumentTimeseriesItemsObject',
  ({
    doCreateNewDataLogger,
    instrumentsItems: instruments,
    instrumentTimeseriesItemsObject: timeseries,
    rowData,
  }) => {
    const {
      field_name: initFieldName,
      display_name: initDisplayName,
      instrument_id: initInstrumentId,
      timeseries_id: initTimeseriesId,
    } = rowData;
    const title = 'Edit Row Data';
    
    const [fieldName, setFieldName] = useState(initFieldName);
    const [displayName, setDisplayName] = useState(initDisplayName);
    const [instrumentId, setInstrumentId] = useState(initInstrumentId);
    const [timeseriesId, setTimeseriesId] = useState(initTimeseriesId);

    const isSaveDisabled = () => (
      !fieldName ||
      !instrumentId ||
      !timeseriesId
    );

    return (
      <Modal.ModalContent style={{ overflow: 'visible' }}>
        <Modal.ModalHeader title={title} />
        <Modal.ModalBody style={{ overflow: 'visible' }}>
          <div className='form-group'>
            <label>Field Name <small>*</small></label>
            <input
              value={fieldName}
              onChange={e => setFieldName(e.target.value)}
              className='form-control text-primary'
              type='text'
              placeholder='Enter Field Name...'
            />
          </div>
          <div className='form-group'>
            <label>Display Name</label>
            <input
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              className='form-control text-primary'
              type='text'
              placeholder='Enter Display Name...'
            />
          </div>
          <div className='form-group'>
            <label>Instrument <small>*</small></label>
            {instruments?.length && (
              <Select
                placeholder='Select Instrument...'
                options={generateInstrumentOptions(instruments)}
                value={getInstrumentValue(instruments, instrumentId)}
                onChange={(val) => {
                  setInstrumentId(val.value);
                  setTimeseriesId(null);
                }}
              />
            )}
          </div>
          <div className='form-group'>
            <label>Timeseries <small>*</small></label>
            {Object.keys(timeseries || {}).length && (
              <Select
                isDisabled={!instrumentId}
                placeholder='Select Timeseries...'
                options={generateTimeseriesOptions(timeseries, instrumentId)}
                value={getTimeseriesValue(timeseries, timeseriesId)}
                onChange={(val) => setTimeseriesId(val.value)}
              />
            )}
          </div>
        </Modal.ModalBody>
        <Modal.ModalFooter
          showCancelButton
          saveIsDisabled={isSaveDisabled()}
          onSave={() => doCreateNewDataLogger({ sn, name, model })}
        />
      </Modal.ModalContent>
    );
  },
);

export default EditMappingRowModal;
