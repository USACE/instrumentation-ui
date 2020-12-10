import React from 'react';
import { connect } from 'redux-bundler-react';

import FieldMapper from './field-mapper';
import IgnoreRows from './ignore-rows';
import ParserSelector from './parser-selector';
import Toolbar from './toolbar';

const Empty = () => <p>Select a file to preview and upload...</p>;

export default connect(
  'selectUploadHasFile',
  'selectUploadJson',
  'selectUploadSelectedParser',
  'selectUploadFieldMap',
  ({ uploadHasFile, uploadJson, uploadSelectedParser, uploadFieldMap }) => (
    <div className='card'>
      <p className='card-header'>
        <strong>Upload Settings</strong>
      </p>
      <div className='card-body'>
        {uploadHasFile && uploadJson && uploadJson.length ? (
          <>
            <ParserSelector />
            { uploadSelectedParser && uploadFieldMap && (
              <>
                <FieldMapper />
                <IgnoreRows />
                <Toolbar />
              </>
            )}
          </>
        ) : (
          <Empty />
        )}
      </div>
    </div>
  )
);
