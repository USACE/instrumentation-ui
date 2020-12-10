import React from 'react';
import { connect } from 'redux-bundler-react';

import PreviewTable from './preview-table';
import Tab from '../../app-components/tab';

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
    if (!project) return null;

    const tabs = [{
      title: 'Original',
      content: <PreviewTable columnDefs={colDefsOriginal} data={dataOriginal} />,
    }, {
      title: 'Parsed',
      content: <PreviewTable columnDefs={colDefsParsed} data={dataParsed} />,
    }];

    return (
      <div className='card'>
        <Tab.Container tabs={tabs} tabListClass='card-header pb-0' contentClass='card-body' />
      </div>
    );
  }
);
