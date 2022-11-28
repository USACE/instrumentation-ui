import React from 'react';

import Icon from './icon';
import bg1 from '../img/bg-1.jpg';
import cwbiLogo from '../img/cwbi-logo.png';

const Hero = () => (
  <div
    style={{
      height: '400px',
      marginTop: '-95px',
      backgroundImage: `url(${bg1})`,
      backgroundSize: 'cover',
      backgroundPosition: 'top',
      display: 'flex',
      justifyContent: 'space-between',
    }}
  >
    <div style={{ marginTop: '95px', marginLeft: '15px' }}>
      <img
        src={cwbiLogo}
        title='Redirect to CWBI Home'
        height='50px'
        className='pointer text-white'
        alt='CWBI Logo'
        onClick={() => window.open('https://cwbi.usace.army.mil/', '_blank')}
      />
    </div>
    <div
      className='d-flex justify-content-center align-items-center flex-column'
      style={{ height: '100%' }}
    >
      <div>
        <h1 className='text-light'>
          <Icon icon='pulse' className='pr-2' />MIDAS
        </h1>
      </div>

      <div>
        <h4 className='text-light'>
          Monitoring Instrumentation Data Acquisition System
        </h4>
      </div>
    </div>
    <div style={{ marginTop: '95px', marginRight: '25px', textAlign: 'right' }}>
      <img
        // src={cwbiLogo}
        title='Redirect to TEN-GGM'
        height='50px'
        className='pointer text-white'
        alt='GG&M Logo'
        onClick={() => window.open('https://usace.dps.mil/sites/TEN-GGM', '_blank')}
      />
      <a
        className='mt-2 d-block pointer'
        title='Link to TEN-GGM IPM'
        href='https://usace.dps.mil/sites/TEN-GGM/SitePages/Instrumentation-and-Performance-Monitoring.aspx'
      >
        IPM SubCOP
      </a>
    </div>
  </div>
);

export default Hero;
