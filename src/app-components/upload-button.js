import React, { useRef } from 'react';
import { connect } from 'redux-bundler-react';

export default connect(
  'doUploadQueueCsv',
  'doUploadSettingsClear',
  ({ doUploadQueueCsv, doUploadSettingsClear, size = 'sm', text = 'Choose File', type = 'success', icon = 'mdi-cloud-upload', buttonClass = '' }) => {
    const inputEl = useRef(null);

    const handleClick = (e) => {
      inputEl.current.click();
    };

    const handleInputChange = (e) => {
      doUploadSettingsClear();
      doUploadQueueCsv(inputEl.current.files[0]);
    };

    const btnClassNames = [
      'btn',
      `btn-${size}`,
      `btn-${type}`,
      buttonClass,
    ].join(' ');

    const iconClassNames = [
      'mdi',
      `${icon}`,
      'pr-2',
    ].join(' ');

    return (
      <>
        <button className={btnClassNames} onClick={handleClick} title={text}>
          <i className={iconClassNames}></i>{text}
        </button>
        <input
          accept='.csv'
          style={{ display: 'none' }}
          ref={inputEl}
          type='file'
          onChange={handleInputChange}
        ></input>
      </>
    );
  },
);
