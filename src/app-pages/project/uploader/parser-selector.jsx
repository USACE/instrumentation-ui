import React, { useCallback, useEffect } from 'react';
import { connect } from 'redux-bundler-react';
import Select from 'react-select';

export default connect(
  'doUploadSetFieldmap',
  'doUploadSetSelectedParser',
  'selectProjectsByRoute',
  'selectUploadParsers',
  'selectUploadSelectedParser',
  'selectUploadJson',
  ({
    doUploadSetFieldmap,
    doUploadSetSelectedParser,
    projectsByRoute: project,
    uploadParsers,
    uploadSelectedParser,
    uploadJson,
  }) => {
    const options = uploadParsers.map(o => ({ value: o.name, label: o.name }));

    const handleSelectParser = useCallback((val) => {
      const parser = uploadParsers.find((p) => p.name === val);

      if (parser) doUploadSetSelectedParser(parser);
    }, [doUploadSetSelectedParser, uploadParsers]);

    useEffect(() => {
      if (uploadSelectedParser) {
        let fieldMap = {};

        if (!uploadSelectedParser.model && uploadSelectedParser.dynamic) {
          fieldMap = uploadSelectedParser.dynamic(uploadJson);
        } else {
          fieldMap = Object.keys(uploadSelectedParser.model || {}).reduce((accum, current) => {
            accum[current] = uploadSelectedParser.model[current]?.template || '';
            return accum;
          }, {});
        }

        fieldMap.project_id = project.id;

        doUploadSetFieldmap(fieldMap);
      }
    }, [uploadSelectedParser, doUploadSetFieldmap, project]);

    return (
      <div className='form-group row' style={{ marginBottom: '0.75rem' }}>
        <label className='col-3 col-form-label text-right'>Import As</label>
        <div className='col-9'>
          <Select
            key={uploadSelectedParser?.name || 'select-parser'}
            defaultValue={uploadSelectedParser ? { name: uploadSelectedParser.name, label: uploadSelectedParser.name } : undefined}
            onChange={newVal => handleSelectParser(newVal?.value)}
            options={options}
            placeholder='Select One...'
          />
        </div>
      </div>
    );
  }
);
