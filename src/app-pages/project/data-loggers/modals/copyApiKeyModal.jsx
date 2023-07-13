import React from 'react';
import { toast } from 'react-toastify';
import { ContentCopy } from '@mui/icons-material';

import * as Modal from '../../../../app-components/modal';
import Button from '../../../../app-components/button';

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
        <i className='mb-3 d-block'>
          <b className='text-warning d-block mb-2'>WARNING: This key will not be displayed again and should be stored somewhere secure.</b>
          When programming the data logger, this key will need to be added to the <b>X-Api-Key</b> header in order to securely upload measurements.
        </i>
        <textarea
          readOnly
          className='form-control mb-2'
          value={apiKey}
        />
        <Button
          isOutline
          size='small'
          icon={<ContentCopy fontSize='inherit' />}
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
