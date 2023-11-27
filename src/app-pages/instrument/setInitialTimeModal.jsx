import React, { useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import { connect } from 'redux-bundler-react';
import { addDays, subDays } from 'date-fns';
import { useDeepCompareEffect } from 'react-use';
import { Autocomplete, TextField } from '@mui/material';
import { DateTime } from 'luxon';

import * as Modal from '../../app-components/modal';

const generateMeasurementOptions = measurements => measurements.map(m => ({
  label: DateTime.fromISO(m.time).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS),
}));

const SetInitialTimeModal = connect(
  'doInstrumentsSave',
  'doFetchInstrumentSensorMeasurements',
  'selectInstrumentsByRoute',
  'selectInstrumentSensorsMeasurements',
  ({
    doInstrumentsSave,
    doFetchInstrumentSensorMeasurements,
    instrumentsByRoute: instrument,
    instrumentSensorsMeasurements: measurements,
    type,
  }) => {
    const [dateRange, setDateRange] = useState([subDays(new Date(), 7), new Date()]);
    const [selectedMeasurement, setSelectedMeasurement] = useState(null);
    const isSaveDisabled = !selectedMeasurement;

    const selectOptions = generateMeasurementOptions(measurements);

    const saveInitialTime = () => {
      doInstrumentsSave({
        ...instrument,
        opts: {
          ...instrument.opts,
          initial_time: new Date(selectedMeasurement).toISOString(),
        }
      })
    };

    useDeepCompareEffect(() => {
      doFetchInstrumentSensorMeasurements(type, dateRange[1].toISOString(), dateRange[0].toISOString());
    }, [dateRange, doFetchInstrumentSensorMeasurements]);

    return (
      <Modal.ModalContent style={{ overflow: 'visible' }}>
        <Modal.ModalHeader title='Set Initial Time' />
        <Modal.ModalBody style={{ overflow: 'visible' }}>
          Use the date range fields to narrow the focus of measurements and then select a measurement time to use as the instrument's initial time.<br/>
          <div className='row mt-2'>
            <div className='col-3'>
              <i>Start Date</i>
              <ReactDatePicker
                calendarClassName='sketch-picker'
                placeholderText='mm/dd/yyyy'
                className='form-control'
                maxDate={Date.now()}
                selected={dateRange[0]}
                onChange={(date) => setDateRange([date, addDays(date, 7)])}
              />
            </div>
            <div className='col-3'>
              <i>End Date</i>
              <ReactDatePicker
                placeholderText='mm/dd/yyyy'
                className='form-control'
                maxDate={Date.now()}
                selected={dateRange[1]}
                onChange={(date) => setDateRange([subDays(date, 7), date])}
              />
            </div>
          </div>
          <i><small>Note: Date range is limited to one (1) week.</small></i>
          <div className='row mt-2'>
            <div className='col-6'>
              Select Measurement:
              {!!measurements && (
                <Autocomplete
                  size='small'
                  onChange={e => setSelectedMeasurement(e.target.innerText)}
                  options={selectOptions}
                  isOptionEqualToValue={(opt, val) => opt.label === val.label}
                  renderInput={(params) => <TextField placeholder='Select a measurement...' {...params} />}
                />
              )}
            </div>
          </div>
        </Modal.ModalBody>
        <Modal.ModalFooter
          showCancelButton
          saveIsDisabled={isSaveDisabled}
          onSave={() => saveInitialTime()}
        />
      </Modal.ModalContent>
    );
  },
);

export default SetInitialTimeModal;
