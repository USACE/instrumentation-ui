import React from 'react';

import * as Modal from '../../../../app-components/modal';

const RawJSONModal = ({
  rawData,
}) => {
  const {
    name,
    test = { x: 5, y: 6, z: { a: 'test', b: 'object' }},
    ...rest
  } = rawData;
  const title = `Data Logger ${name} - Raw JSON Data`;

  return (
    <Modal.ModalContent>
      <Modal.ModalHeader title={title} />
      <Modal.ModalBody>
        <textarea
          readOnly
          rows={15}
          className='w-100'
          value={JSON.stringify(test, null, 4)}
        />
      </Modal.ModalBody>
      <Modal.ModalFooter
        cancelText='Close'
        showCancelButton
      />
    </Modal.ModalContent>
  );
};

export default RawJSONModal;
