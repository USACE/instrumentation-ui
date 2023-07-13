import React, { useState, useRef } from 'react';
import { connect } from 'redux-bundler-react';

import Button from './button';

export default connect(
  'doUploadQueueCsv',
  'doUploadSettingsClear',
  ({
    doUploadQueueCsv,
    doUploadSettingsClear,
    text = 'Choose File',
    icon = null,
    buttonClass = '',
    clearSettings = true,
  }) => {
    const inputEl = useRef(null);
    const [dirty, setDirty] = useState(false);

    const handleClick = (_e) => {
      inputEl.current.click();
    };

    const handleInputChange = (_e) => {
      if (clearSettings) doUploadSettingsClear();
      
      doUploadQueueCsv(inputEl.current.files[0], dirty);

      setDirty(true);
    };

    return (
      <>
        <Button
          className={buttonClass}
          handleClick={handleClick}
          variant='success'
          size='small'
          text={text}
          icon={icon}
        />
        <input
          accept='.csv'
          style={{ display: 'none' }}
          ref={inputEl}
          type='file'
          onChange={handleInputChange}
        />
      </>
    );
  },
);
