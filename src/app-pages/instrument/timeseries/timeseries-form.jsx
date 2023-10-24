import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';
import { Autocomplete, TextField } from '@mui/material';

import DomainSelect from '../../../app-components/domain-select';
import { ModalFooter, ModalHeader } from '../../../app-components/modal';

export default connect(
  'doModalClose',
  'doInstrumentTimeseriesSave',
  'doInstrumentsSave',
  'doInstrumentTimeseriesDelete',
  'selectInstrumentsByRoute',
  'selectInstrumentTimeseriesByProjectId',
  'selectProjectsIdByRoute',
  ({
    doModalClose,
    doInstrumentTimeseriesSave,
    doInstrumentsSave,
    doInstrumentTimeseriesDelete,
    instrumentsByRoute: instrument,
    instrumentTimeseriesByProjectId,
    projectsIdByRoute,
    item,
    isEdit = false,
  }) => {
    const [name, setName] = useState((item && item.name) || '');
    const [instrument_id] = useState(instrument.id);
    const [parameter_id, setParameterId] = useState((item && item.parameter_id) || '');
    const [unit_id, setUnitId] = useState((item && item.unit_id) || '');
    const { projectId } = projectsIdByRoute;
    const projectTimeseries = instrumentTimeseriesByProjectId[projectId]?.map(el => ({ label: el.name, value: el.name })) || [];

    const title = isEdit ? 'Edit Timeseries' : 'New Timeseries';

    const handleSave = (e) => {
      e.preventDefault();
      doInstrumentTimeseriesSave(
        Object.assign({}, item, {
          name,
          instrument_id,
          parameter_id,
          unit_id,
        }),
        (updatedItem) => {
          doModalClose();
          if (instrument.constants.indexOf(updatedItem.id) === -1) {
            instrument.constants.push(updatedItem.id);
            doInstrumentsSave(instrument);
          }
        },
        true
      );
    };

    const handleDelete = (e) => {
      e.preventDefault();

      if (item && item.id) {
        doInstrumentTimeseriesDelete(item, () => doModalClose(), true);
      }
    };

    return (
      <div className='modal-content' style={{ overflowY: 'auto' }}>
        <form id='instrument-constant-form' onSubmit={handleSave}>
          <ModalHeader title={title} />
          <section className='modal-body'>
            <div className='form-group'>
              <label>Name</label>
              <Autocomplete
                freeSolo
                size='small'
                id='timeseries-name-ac'
                options={projectTimeseries}
                defaultValue={projectTimeseries.find(el => el.value === name)}
                renderInput={(params) => (
                  <TextField {...params} placeholder='Timeseries Name... ' onChange={e => setName(e.target.value)} />
                )}
                onChange={e => setName(e.target.innerText)}
                 // @TODO: check value from this.
              />
            </div>
            <div className='form-group'>
              <label>Parameter</label>
              <DomainSelect
                defaultValue={parameter_id}
                onChange={val => setParameterId(val?.id)}
                domain='parameter'
              />
            </div>
            <div className='form-group'>
              <label>Unit</label>
              <DomainSelect
                defaultValue={unit_id}
                onChange={val => setUnitId(val?.id)}
                domain='unit'
              />
            </div>
          </section>
          <ModalFooter
            saveIsSubmit
            customClosingLogic
            saveText='Save changes'
            onCancel={() => doModalClose()}
            onDelete={handleDelete}
          />
        </form>
      </div>
    );
  }
);
