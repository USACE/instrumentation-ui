import React, { useEffect } from 'react';
import { connect } from 'redux-bundler-react';

import FileDetails from './file-details';
import FilePreview from './file-preview';
import Navbar from '../../app-components/navbar';
import Notifications from '../../app-components/notifications';
import UploadSettings from './upload-settings';

export default connect('doUploadClear', ({ doUploadClear }) => {
  useEffect(() => () => doUploadClear());

  return (
    <div>
      <Navbar theme='primary' fixed />
      <section className='container-fluid' style={{ marginTop: '6rem' }}>
        <div className='row'>
          <div className='col-4'>
            <FileDetails />
            <UploadSettings />
          </div>
          <div className='col-8'>
            <FilePreview />
          </div>
        </div>
      </section>
      <Notifications />
    </div>
  );
});
