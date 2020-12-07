import React from 'react';
import { connect } from 'redux-bundler-react';

import Select from '../../app-components/select';

export default connect(
  'selectUploadParsers',
  'doUploadSetSelectedParser',
  ({ uploadParsers, doUploadSetSelectedParser }) => {
    const options = uploadParsers.map(o => ({ value: o.name }));

    const handleSelectParser = (v) => {
      const parser = uploadParsers.find((p) => p.name === v);

      if (parser) {
        doUploadSetSelectedParser(parser);
      }
    };

    return (
      <div className='form-group row' style={{ marginBottom: '0.75rem' }}>
        <label className='col-3 col-form-label text-right'>Import As</label>
        <div className='col-9'>
          <Select
            onChange={(v) => handleSelectParser(v)}
            options={options}
            placeholderText='Select One...'
          />
        </div>
      </div>
    );
  }
);
