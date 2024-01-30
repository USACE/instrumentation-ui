import React from 'react';
import { IconButton } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import { toast } from 'react-toastify';

import * as Modal from '../app-components/modal';
import { DateTime } from 'luxon';

const MovingBannerModal = ({
  migrationDate,
}) => {
  const copyToClipboard = (text) => {
    try {
      navigator.clipboard.writeText(text);
      toast.success('Copied to Clipboard!', { autoClose: 1200 });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  return (
    <Modal.ModalContent>
      <Modal.ModalHeader title='Telemetry Migration Information' />
      <Modal.ModalBody>
        <span className='d-block'>Users who manage a CR-6 or CR-1000X datalogger sending automated telemetry to MIDAS:</span>
        <div className='pl-3 mt-1'>
          <span className='d-block font-weight-bold'>All data will be frozen at {migrationDate.toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)}.</span>
          <span className='d-block mt-2'>For the Telemetry API to continue to send data, please update the base URL in the datalogger script to:</span>
            <p className='font-weight-bold'>
              &emsp;https://midas-telemetry.sec.usace.army.mil
              <IconButton
                size='small'
                className='ml-2'
                title='Copy to Clipboard'
                onClick={() => copyToClipboard('https://midas-telemetry.sec.usace.army.mil')}
              >
                <ContentCopy fontSize='inherit' />
              </IconButton>
            </p>
            
          <span className='d-block font-italic'>Note that the model and serial number still need to be part of the path for requests to process successfully. Datalogger API keys do not need to be updated as part of this migration.</span>
          <span className='d-block mt-3 font-weight-bold'>Telemetry data collected during site downtime cannot be recorded by the API and should be collected locally as TOA5 files.
            <span className='font-weight-normal'>&nbsp;Data from local files should be subsequently uploaded when the site is online, after the migration is complete. To manually upload files using the equivalency table for the datalogger, navigate to the same page where the datalogger was created (go to Home &gt; Project &gt; Datalogger tab. Then select your datalogger from the dropdown and click the "Upload TOA5" button in the top right-hand corner).</span>
          </span>
          <span className='d-block mt-2 font-italic'>Please note that any duplicate entries will be handled by the application.</span>
        </div>
        <hr />
        <span className='d-block mt-2 p-2'>For any questions, please contact <a href='mailto:meghan.c.quinn@usace.army.mil'>meghan.c.quinn@usace.army.mil</a> or <a href='mailto:daniel.s.massa@usace.army.mil'>daniel.s.massa@usace.army.mil</a>.</span>
      </Modal.ModalBody>
      <Modal.ModalFooter
        showSaveButton={false}
        cancelText='Close'
        showCancelButton
      />
    </Modal.ModalContent>
  )
};

export default MovingBannerModal;
