import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';

import * as Modal from '../../../../app-components/modal';

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
      model: '',
    },
  }) => {
    const {
      id,
      sn: initSn,
      name: initName,
      model: initModel,
    } = dataLogger;
    const title = `${isEdit ? 'Edit' : 'Add New'} Data Logger`;
    
    const [sn, setSN] = useState(initSn);
    const [name, setName] = useState(initName);
    const [model, setModel] = useState(initModel);

    const saveDataLoggerDetails = () => {
      if (isEdit) {
        doUpdateDataLogger({ name, dataLoggerId: id });
        callback({ label: name, value: id });
      } else {
        doCreateNewDataLogger({ sn, name, model });
      }
    };

    return (
      <Modal.ModalContent>
        <Modal.ModalHeader title={title} />
        <Modal.ModalBody>
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
                <input
                  value={model}
                  onChange={e => setModel(e.target.value)}
                  className='form-control text-primary'
                  type='text'
                  placeholder='Model'
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
