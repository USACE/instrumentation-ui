import React from 'react';
import { connect } from 'redux-bundler-react';

import * as Modal from '../../../app-components/modal';

const DataLoggerModal = ({
  isEdit = false,
}) => {
  const title = `${isEdit ? 'Edit' : 'Add New'} Data Logger`;

  return (
    <Modal.ModalContent>
      <Modal.ModalHeader title={title} />
      <Modal.ModalBody>
        Test Content
      </Modal.ModalBody>
      <Modal.ModalFooter showCancelButton />
    </Modal.ModalContent>
  );
};

export default DataLoggerModal;
