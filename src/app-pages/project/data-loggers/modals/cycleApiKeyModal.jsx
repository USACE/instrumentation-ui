import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';
import { toast } from 'react-toastify';
import { Autorenew, ContentCopy, Key } from '@mui/icons-material';

import * as Modal from '../../../../app-components/modal';
import Button from '../../../../app-components/button';

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
        // eslint-disable-next-line no-console
        console.error(e);
      }
    };

    return (
      <Modal.ModalContent>
        <Modal.ModalHeader title='Cycle Data Logger API Key' />
        <Modal.ModalBody>
          <i>
            Cycling an API Key will render any connections made with the old key obsolete. A new key will
            be generated and will need to be added to the <b>X-Api-Key</b> header in order to securely upload measurements.
            {!dataLoggerAPIKey ? (
              <b className='text-danger d-block my-2'>
                WARNING: This action cannot be undone!
              </b>
            ) : (
              <i className='d-block my-2'>
                <b className='text-warning'>WARNING: This key will not be displayed again and should be stored somewhere secure.</b>
              </i>
            )}
          </i>
          {!dataLoggerAPIKey ? (
            <Button
              isOutline
              isDisabled={isGenerating}
              size='small'
              variant='info'
              icon={isGenerating ? <Autorenew fontSize='inherit' /> : <Key fontSize='inherit' />}
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
                icon={<ContentCopy fontSize='inherit' />}
                text='Copy to Clipboard'
                handleClick={copyKey}
              />
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
