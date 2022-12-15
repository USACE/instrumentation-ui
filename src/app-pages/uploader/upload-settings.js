import React from 'react';
import { connect } from 'redux-bundler-react';

import Card from '../../app-components/card';
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
  ({ uploadHasFile, uploadJson, uploadSelectedParser, uploadFieldMap, activeTs }) => (
    <Card>
      <Card.Header text='Upload Settings' />
      <Card.Body>
        {uploadHasFile && uploadJson && uploadJson.length ? (
          <>
            <ParserSelector />
            { uploadSelectedParser && uploadFieldMap && (
              <>
                <FieldMapper activeTs={activeTs} />
                <IgnoreRows />
                <Toolbar />
              </>
            )}
          </>
        ) : (
          <Empty />
        )}
      </Card.Body>
    </Card>
  )
);
