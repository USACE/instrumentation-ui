import React from 'react';
import { connect } from 'redux-bundler-react';

import * as Modal from '../../../../app-components/modal';

const DeleteDataLoggerMappingRowModal = connect(
  'doDeleteDataLoggerEquivalencyRow',
  ({
    doDeleteDataLoggerEquivalencyRow,
    dataLoggerId,
    id,
    tableId,
  }) => (
    <Modal.ModalContent>
      <Modal.ModalHeader title='Confirm Data Logger Mapping Removal' />
      <Modal.ModalBody>
        Are you sure you want to delete this data logger mapping? Associated timeseries will <b><i>NOT</i></b> be deleted and will not receieve any new data unless assigned to another datalogger.
      </Modal.ModalBody>
      <Modal.ModalFooter
        showCancelButton
        showSaveButton={false}
        onDelete={() => doDeleteDataLoggerEquivalencyRow({ dataLoggerId, id, tableId })}
      />
    </Modal.ModalContent>
  ),
);

export default DeleteDataLoggerMappingRowModal;
