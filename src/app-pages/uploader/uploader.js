import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';

import FileDetails from './file-details';
import FilePreview from './file-preview';
import UploadSettings from './upload-settings';

export default connect(
  'doUploadClear',
  'doUploadSetSelectedParser',
  'selectUploadParsers',
  ({ 
    doUploadClear,
    doUploadSetSelectedParser,
    uploadParsers,
  }) => {
    const [activeTs, setActiveTs] = useState(null);

    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const type = urlParams.get('type');
      setActiveTs(urlParams.get('activeTs'));

      if (type) {
        const parser = uploadParsers.find(p => p.name === type);
        doUploadSetSelectedParser(parser);
      }

      return () => doUploadClear();
    });

    return (
      <>
        <section className='container-fluid'>
          <div className='row'>
            <div className='col-4'>
              <FileDetails />
              <UploadSettings activeTs={activeTs} />
            </div>
            <div className='col-8'>
              <FilePreview />
            </div>
          </div>
        </section>
      </>
    );
  }
);
