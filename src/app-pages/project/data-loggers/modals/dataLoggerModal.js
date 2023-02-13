import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';

import * as Modal from '../../../../app-components/modal';

const DataLoggerModal = connect(
  'doCreateNewDataLogger',
  ({
    doCreateNewDataLogger,
    isEdit = false,
    dataLogger = {
      sn: '',
      name: '',
      model: '',
    },
  }) => {
    const {
      sn: initSn,
      name: initName,
      model: initModel,
    } = dataLogger;
    const title = `${isEdit ? 'Edit' : 'Add New'} Data Logger`;
    
    const [sn, setSN] = useState(initSn);
    const [name, setName] = useState(initName);
    const [model, setModel] = useState(initModel);

    return (
      <Modal.ModalContent>
        <Modal.ModalHeader title={title} />
        <Modal.ModalBody>
          <div className='form-group'>
            <label>Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className='form-control'
              type='text'
              placeholder='Name'
            />
          </div>
          <div className='form-group'>
            <label>Serial Number</label>
            <input
              value={sn}
              onChange={e => setSN(e.target.value)}
              className='form-control'
              type='text'
              placeholder='Serial Number'
            />
          </div>
          <div className='form-group'>
            <label>Model</label>
            <input
              value={model}
              onChange={e => setModel(e.target.value)}
              className='form-control'
              type='text'
              placeholder='Model'
            />
          </div>
        </Modal.ModalBody>
        <Modal.ModalFooter
          showCancelButton
          onSave={() => doCreateNewDataLogger({ sn, name, model })}
        />
      </Modal.ModalContent>
    );
  },
);

export default DataLoggerModal;
