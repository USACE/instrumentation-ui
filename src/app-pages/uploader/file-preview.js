import React from 'react';
import { connect } from 'redux-bundler-react';

import Card from '../../app-components/card';
import PreviewTable from './preview-table';
import TabContainer from '../../app-components/tab';

export default connect(
  'selectUploadColumnDefsOriginal',
  'selectUploadDataOriginal',
  'selectUploadColumnDefsParsed',
  'selectUploadDataParsed',
  'selectProjectsByRoute',
  ({
    uploadColumnDefsOriginal: colDefsOriginal,
    uploadDataOriginal: dataOriginal,
    uploadColumnDefsParsed: colDefsParsed,
    uploadDataParsed: dataParsed,
    projectsByRoute: project,
  }) => {
    console.log('test dataParsed: ', dataParsed);
    console.log('test dataOriginal: ', dataOriginal);
    const tabs = [{
      title: 'Original',
      content: <PreviewTable columnDefs={colDefsOriginal} data={dataOriginal} />,
    }, {
      title: 'Parsed',
      content: <PreviewTable columnDefs={colDefsParsed} data={dataParsed} />,
    }];

    return (
      project && (
        <Card>
          <TabContainer tabs={tabs} tabListClass='card-header pb-0' contentClass='card-body' />
        </Card>
      )
    );
  }
);
