import React from 'react';
import { Copyright } from '@mui/icons-material';

const Footer = () => (
  <footer className='footer mt-auto py-3'>
    <div className='text-center'>
      <p>
        <strong>
          <Copyright fontSize='inherit' />
        </strong>{' '}
          U.S. Army Corps of Engineers {new Date().getFullYear()}
      </p>
    </div>
  </footer>
);

export default Footer;
