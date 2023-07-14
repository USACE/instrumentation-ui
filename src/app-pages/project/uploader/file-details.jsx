import React from 'react';
import { connect } from 'redux-bundler-react';
import { CloudUpload, Difference } from '@mui/icons-material';

import Card from '../../../app-components/card';
import UploadButton from '../../../app-components/upload-button';

export default connect(
  'selectUploadFileData',
  'selectUploadHasFile',
  ({ uploadFileData, uploadHasFile }) => {
    const { name, size, type, lastModified } = uploadFileData;

    return (
      <Card className='mb-3'>
        <Card.Header text='File Info' />
        <Card.Body>
          <>
            {uploadHasFile ? (
              <div className='text-italic'>
                <UploadButton text='Change File' icon={<Difference fontSize='inherit' sx={{ marginRight: '4px' }} />} buttonClass='float-right' />
                <p><strong>{name}</strong></p>
                <div className='d-flex justify-content-between pt-2'>
                  <span>
                    <small className='text-muted'>{'file size: '}</small>
                    {size}
                  </span>
                  <span>
                    <small className='text-muted'>{'type: '}</small>
                    {type}
                  </span>
                  <span>
                    <small className='text-muted'>{'last modified: '}</small>
                    {lastModified}
                  </span>
                </div>
              </div>
            ) : (
              <UploadButton icon={<CloudUpload fontSize='inherit' sx={{ marginRight: '4px' }} />} clearSettings={false} />
            )}
          </>
        </Card.Body>
      </Card>
    );
  }
);
