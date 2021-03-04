import React from 'react';

import Icon from './icon';
import bg1 from '../img/bg-1.jpg';

const Hero = () => (
  <div
    style={{
      height: '400px',
      marginTop: '-80px',
      paddingTop: '90px',
      backgroundImage: `url(${bg1})`,
      backgroundSize: 'cover',
      backgroundPosition: 'top',
    }}
  >
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
  </div>
);

export default Hero;
