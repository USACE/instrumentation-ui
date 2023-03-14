import React from 'react';
import { connect } from 'redux-bundler-react';

import * as Modal from '../../../../app-components/modal';

const DeleteDataLoggerModal = connect(
  'doDeleteDataLogger',
  ({
    doDeleteDataLogger,
    dataLoggerInfo = {},
    callback = () => {},
  }) => {
    const { id } = dataLoggerInfo;

    const deleteDataLogger = () => {
      doDeleteDataLogger({ dataLoggerId: id });
      callback();
    };
    
    return (
      <Modal.ModalContent>
        <Modal.ModalHeader title='Confirm Data Logger Removal' />
        <Modal.ModalBody>
          Are you sure you want to delete this data logger? Any connections made with the key attached to this data logger will no longer function.
        </Modal.ModalBody>
        <Modal.ModalFooter
          showCancelButton
          showSaveButton={false}
          onDelete={deleteDataLogger}
        />
      </Modal.ModalContent>
    );
  },
);

export default DeleteDataLoggerModal;
