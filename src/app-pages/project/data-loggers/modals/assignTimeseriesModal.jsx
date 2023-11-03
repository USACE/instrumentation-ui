import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, Checkbox, FormControlLabel } from '@mui/material';
import { connect } from 'redux-bundler-react';

import * as Modal from '../../../../app-components/modal';

const buildInstrumentOptions = (instruments) => {
  if (!instruments || !instruments.length) return [];

  return instruments.map(i => ({
    label: i.name,
    value: i.id,
  }));
};

const AssignTimeseriesModal = connect(
  'doSaveFieldNamesToTimeseries',
  'selectInstrumentTimeseriesByInstrumentId',
  'selectInstrumentsItems',
  ({
    doSaveFieldNamesToTimeseries,
    instrumentTimeseriesByInstrumentId: timeseries,
    instrumentsItems,
    equivalencyTable,
  }) => {
    const [selectedInstrument, setSelectedInstrument] = useState(null);
    const [overwriteExisting, setOverwriteExisting] = useState(false);
    const [updatingObject, setUpdatingObject] = useState({ newTs: [], existingTs: [] });
    const { dataLoggerId, rows } = equivalencyTable;

    const saveTimeseriesToInstrument = () => {
      doSaveFieldNamesToTimeseries(updatingObject, selectedInstrument);
    };

    useEffect(() => {
      if (selectedInstrument) {
        const newTs = [];
        const existingTs = [];

        rows.forEach(row => {
          if (overwriteExisting || !row.timeseries_id) {
            const found = timeseries[selectedInstrument]?.find(el => el.name === row.field_name);
            if (found) existingTs.push({
              field: row,
              timeseries: found,
            });
            else newTs.push(row);
          }
        });

        setUpdatingObject({ newTs, existingTs });
      }
    }, [selectedInstrument, overwriteExisting]);

    return (
      <Modal.ModalContent>
        <Modal.ModalHeader title='Assign Timeseries to Instrument' />
        <Modal.ModalBody>
          Select an instrument to save timeseries to. This tool will attempt to find matching timeseries within the instrument
          and assign the fields accordingly. If no timeseries exists with a matching name, one will be created and assigned automatically upon
          saving for each field name.
          <hr />
          <FormControlLabel
            label='Overwrite Existing Mappings'
            control={(
              <Checkbox
                size='small'
                defaultChecked={false}
                onChange={() => setOverwriteExisting(prev => !prev)}
                label='Overwrite Existing Mappings'
              />
            )}
          />
          <Autocomplete
            size='small'
            className='mt-1'
            isOptionEqualToValue={(opt, val) => opt.value === val.value}
            renderInput={(p) => <TextField {...p} placeholder='Select an instrument...' />}
            options={buildInstrumentOptions(instrumentsItems)}
            onChange={(_e, newValue) => setSelectedInstrument(newValue?.value)}
          />
          {!!selectedInstrument && (
            <>
              <hr />
              Assigning <b>{updatingObject.existingTs.length}</b> field name(s) to existing timeseries.<br/>
              Creating <b>{updatingObject.newTs.length}</b> new timeseries.
            </>
          )}
        </Modal.ModalBody>
        <Modal.ModalFooter
          showCancelButton
          cancelText='Close'
          saveIsDisabled={!selectedInstrument}
          onSave={() => saveTimeseriesToInstrument()}
        />
      </Modal.ModalContent>
    );
  },
);

export default AssignTimeseriesModal;
