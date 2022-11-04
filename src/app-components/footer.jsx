import React from 'react';

import Icon from './icon';

const Footer = () => (
  <footer className='footer mt-auto py-3'>
    <div className='text-center'>
      <p>
        <strong>
          <Icon icon='copyright' />
        </strong>{' '}
          U.S. Army Corps of Engineers {new Date().getFullYear()}
      </p>
    </div>
  </footer>
);

export default Footer;
