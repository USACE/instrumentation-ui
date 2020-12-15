import React, { useCallback, useEffect } from 'react';
import { connect } from 'redux-bundler-react';

import Select from '../../app-components/select';

export default connect(
  'doUploadSetFieldmap',
  'selectProjectsByRoute',
  'selectUploadParsers',
  'selectUploadSelectedParser',
  'doUploadSetSelectedParser',
  ({
    doUploadSetFieldmap,
    projectsByRoute: project,
    uploadParsers,
    uploadSelectedParser,
    doUploadSetSelectedParser,
  }) => {
    const options = uploadParsers.map(o => ({ value: o.name }));

    const handleSelectParser = useCallback((val) => {
      const parser = uploadParsers.find((p) => p.name === val);

      if (parser) doUploadSetSelectedParser(parser);
    }, [doUploadSetSelectedParser, uploadParsers]);

    useEffect(() => {
      if (!!uploadSelectedParser) {
        const fieldMap = Object.keys(uploadSelectedParser.model).reduce((accum, current) => {
          accum[current] = uploadSelectedParser.model[current].template || '';
          return accum;
        }, {});
        fieldMap.project_id = project.id;

        doUploadSetFieldmap(fieldMap);
      }
    }, [uploadSelectedParser, doUploadSetFieldmap, project]);

    return (
      <div className='form-group row' style={{ marginBottom: '0.75rem' }}>
        <label className='col-3 col-form-label text-right'>Import As</label>
        <div className='col-9'>
          <Select
            defaultOption={uploadSelectedParser ? uploadSelectedParser.name : ''}
            onChange={handleSelectParser}
            options={options}
            placeholderText='Select One...'
            value={uploadSelectedParser ? uploadSelectedParser.name : ''}
          />
        </div>
      </div>
    );
  }
);
