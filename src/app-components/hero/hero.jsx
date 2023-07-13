import React from 'react';
import { Timeline } from '@mui/icons-material';

import bg1 from '../../img/bg-1.jpg';
import cwbiLogo from '../../img/cwbi-logo.png';
import ggmLogo from '../../img/GGM-Logo.png';

import './hero.scss';

const Hero = () => (
  <div
    className='hero'
    style={{ backgroundImage: `url(${bg1})` }}
  >
    <div className='logo-left'>
      <img
        src={cwbiLogo}
        title='CWBI Home'
        height='150px'
        className='pointer text-light'
        alt='CWBI Logo'
        onClick={() => window.open('https://cwbi.usace.army.mil/', '_blank')}
      />
    </div>
    <div className='d-flex justify-content-center align-items-center flex-column h-100'>
      <h1 className='text-light'>
        <Timeline sx={{ paddingRight: '5px', paddingBottom: '5px', fontSize: '40px' }} />
        MIDAS
      </h1>
      <h4 className='text-light'>
        Monitoring Instrumentation Data Acquisition System
      </h4>
    </div>
    <div className='logo-right'>
      <img
        src={ggmLogo}
        title='USACE KMP-GGM'
        height='175px'
        className='pointer text-light'
        alt='TEN GGM Logo'
        onClick={() => window.open('https://usace.dps.mil/sites/KMP-GGM', '_blank')}
      />
      <a
        className='mt-2 d-block pointer'
        title='Link to KMP-GGM IPM'
        href='https://usace.dps.mil/sites/KMP-GGM/SitePages/Instrumentation-and-Performance-Monitoring.aspx'
        target='_blank'
      >
        IPM SubCOP
      </a>
    </div>
  </div>
);

export default Hero;
