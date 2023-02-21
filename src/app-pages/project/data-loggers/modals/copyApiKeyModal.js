import React from 'react';
import { toast } from 'react-toastify';

import * as Modal from '../../../../app-components/modal';
import Button from '../../../../app-components/button';
import Icon from '../../../../app-components/icon';

const CopyApiKeyModal = ({
  apiKey = '',
}) => {
  const copyKey = () => {
    try {
      navigator.clipboard.writeText(apiKey);
      toast.success('Copied Key to Clipboard!', { autoClose: 1200 });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal.ModalContent>
      <Modal.ModalHeader title='Data Logger API Key' />
      <Modal.ModalBody>
        <textarea
          readOnly
          className='form-control'
          value={apiKey}
        />
        <Button
          isOutline
          size='small'
          icon={<Icon icon='content-copy' />}
          text='Copy to Clipboard'
          handleClick={copyKey}
        />
      </Modal.ModalBody>
      <Modal.ModalFooter
        showCancelButton
        showSaveButton={false}
        cancelText='Close'
      />
    </Modal.ModalContent>
  );
};

export default CopyApiKeyModal;
