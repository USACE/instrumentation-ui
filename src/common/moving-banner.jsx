import React, { useState } from 'react';
import { Close } from '@mui/icons-material';
import { connect } from 'redux-bundler-react';
import { DateTime } from 'luxon';
import { IconButton, Link } from '@mui/material';

import MovingBannerModal from './moving-banner-modal';

const MovingBanner = connect(
  'doModalOpen',
  ({
    doModalOpen,
  }) => {
    const [isOpen, setIsOpen] = useState(true);
    const migrationDate = DateTime.fromISO('2024-02-02T10:00:00.000-05:00');
    const resolutionDate = DateTime.fromISO('2024-02-05T10:00:00.000-05:00');

    return (
      isOpen ? (
        <div className='moving-banner row'>
          <div className='col-10'>
            This site will be migrating to <a href='https://midas.sec.usace.army.mil/midas' target='_blank' rel='noreferrer'>https://midas.sec.usace.army.mil/midas</a>
            &nbsp;on <b>{migrationDate.toLocaleString(DateTime.DATETIME_SHORT)}</b>, after which this site will be unavailable. You can continue to use this site as normal until that time.
            The migration is planned to be resolved and the new site functional by <b>{resolutionDate.toLocaleString(DateTime.DATE_SHORT)}</b>.
            <br />
            <b>Important:</b> Telemetry users will need to follow additional steps. For more information on main site and Telemetry API migration,
            &nbsp;click <Link className='banner-link' onClick={() => { setIsOpen(false); doModalOpen(MovingBannerModal, { migrationDate }, 'lg'); }}>here</Link>.
          </div>
          <div className='col-2 my-auto'>
            <IconButton
              className='float-right'
              onClick={() => setIsOpen(false)}
            >
              <Close />
            </IconButton>
          </div>
        </div>
      ) : null
    );
  },
);

export default MovingBanner;
