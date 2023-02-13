import React from 'react';
import { toast } from 'react-toastify';
import Button from '../../../../app-components/button/button';
import Icon from '../../../../app-components/icon';

import * as Modal from '../../../../app-components/modal';

import testData from './testData';

const RawJSONModal = ({
  rawData,
}) => {
  const {
    name,
    test = testData,
    ...rest
  } = rawData;

  const title = `Data Logger ${name} - Raw JSON Data`;
  const dataString = JSON.stringify(test, null, 4);

  return (
    <Modal.ModalContent>
      <Modal.ModalHeader title={title} />
      <Modal.ModalBody>
        <textarea
          readOnly
          rows={15}
          className='w-100'
          value={dataString}
        />
        <Button
          isOutline
          size='small'
          icon={<Icon icon='content-copy' />}
          text='Copy to Clipboard'
          className='mt-1'
          handleClick={() => {
            try {
              navigator.clipboard.writeText(dataString);
              toast.success('Copied to Clipboard!', { autoClose: 1500 });
            } catch (e) {
              console.error(e);
            }
          }}
        />
      </Modal.ModalBody>
      <Modal.ModalFooter
        cancelText='Close'
        showCancelButton
        showSaveButton={false}
      />
    </Modal.ModalContent>
  );
};

export default RawJSONModal;
