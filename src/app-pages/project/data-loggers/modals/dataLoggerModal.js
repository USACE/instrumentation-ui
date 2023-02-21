import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';

import * as Modal from '../../../../app-components/modal';
import DomainSelect from '../../../../app-components/domain-select';

const DataLoggerModal = connect(
  'doCreateNewDataLogger',
  'doUpdateDataLogger',
  ({
    doCreateNewDataLogger,
    doUpdateDataLogger,
    isEdit = false,
    callback = () => {},
    dataLogger = {
      id: '',
      sn: '',
      name: '',
      model_id: '',
    },
  }) => {
    const {
      id,
      sn: initSn,
      name: initName,
      model_id: initModelId,
    } = dataLogger;
    const title = `${isEdit ? 'Edit' : 'Add New'} Data Logger`;
    
    const [sn, setSN] = useState(initSn);
    const [name, setName] = useState(initName);
    const [modelId, setModelId] = useState(initModelId);

    const saveDataLoggerDetails = () => {
      if (isEdit) {
        doUpdateDataLogger({ name, dataLoggerId: id });
        callback({ label: name, value: id });
      } else {
        doCreateNewDataLogger({ sn, name, model_id: modelId });
      }
    };

    return (
      <Modal.ModalContent style={{ overflow: 'visible' }}>
        <Modal.ModalHeader title={title} />
        <Modal.ModalBody style={{ overflow: 'visible' }}>
          <div className='form-group'>
            <label>Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className='form-control text-primary'
              type='text'
              placeholder='Name'
            />
          </div>
          {!isEdit ? (
            <>
              <div className='form-group'>
                <label>Serial Number</label>
                <input
                  value={sn}
                  onChange={e => setSN(e.target.value)}
                  className='form-control text-primary'
                  type='text'
                  placeholder='Serial Number'
                />
              </div>
              <div className='form-group'>
                <label>Model</label>
                <DomainSelect
                  value={modelId}
                  onChange={val => setModelId(val)}
                  domain='datalogger_model'
                />
              </div>
            </>
          ) : (
            <small>
              The <i><b>Serial Number</b></i> and <i><b>Model</b></i> fields are not editable. If they are not correct, please create a new data logger with the proper values and delete the invalid data logger.
            </small>
          )}
        </Modal.ModalBody>
        <Modal.ModalFooter
          showCancelButton
          onSave={saveDataLoggerDetails}
        />
      </Modal.ModalContent>
    );
  },
);

export default DataLoggerModal;
