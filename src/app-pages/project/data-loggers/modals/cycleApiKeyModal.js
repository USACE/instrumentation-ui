import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';
import { toast } from 'react-toastify';

import * as Modal from '../../../../app-components/modal';
import Button from '../../../../app-components/button';
import Icon from '../../../../app-components/icon';

const CycleApiKeyModal = connect(
  'doCycleDataLoggerKey',
  'doClearDataLoggerKey',
  'selectDataLoggerAPIKey',
  ({
    doCycleDataLoggerKey,
    doClearDataLoggerKey,
    dataLoggerAPIKey,
    dataLoggerInfo,
  }) => {
    useEffect(() => {
      doClearDataLoggerKey();
    }, [doClearDataLoggerKey]);

    const { id: dataLoggerId } = dataLoggerInfo;
    const [isGenerating, setIsGenerating] = useState(false);

    const generateNewKey = () => {
      setIsGenerating(true);
      doCycleDataLoggerKey({ dataLoggerId });
    };

    const copyKey = () => {
      try {
        navigator.clipboard.writeText(dataLoggerAPIKey);
        toast.success('Copied Key to Clipboard!', { autoClose: 1200 });
      } catch (e) {
        console.error(e);
      }
    };

    return (
      <Modal.ModalContent>
        <Modal.ModalHeader title='Cycle Data Logger API Key' />
        <Modal.ModalBody>
          <i>
            Cycling an API Key will render any connections made with the old key obsolete. A new key will
            be generated and will need to be entered into the data logger's config to connect with the API.
            <b className='text-danger d-block my-2'>
              WARNING: This action cannot be undone!
            </b>
          </i>
          {!dataLoggerAPIKey ? (
            <Button
              isOutline
              isDisabled={isGenerating}
              size='small'
              variant='info'
              icon={<Icon icon={`${isGenerating ? 'autorenew' : 'key'}`} />}
              text={isGenerating ? 'Generating Key...' : 'Generate Key'}
              handleClick={() => generateNewKey()}
            />
          ) : (
            <>
              <textarea
                readOnly
                className='form-control'
                value={dataLoggerAPIKey}
              />
              <Button
                isOutline
                size='small'
                className='my-2'
                icon={<Icon icon='content-copy' />}
                text='Copy to Clipboard'
                handleClick={copyKey}
              />
              <i className='d-block'>Make sure to have this key saved before closing this modal.</i>
            </>
          )}
        </Modal.ModalBody>
        <Modal.ModalFooter
          showCancelButton
          showSaveButton={false}
          cancelText={(isGenerating || dataLoggerAPIKey) ? 'Close' : 'Cancel'}
          onCancel={() => doClearDataLoggerKey()}
        />
      </Modal.ModalContent>
    );
  },
);

export default CycleApiKeyModal;
