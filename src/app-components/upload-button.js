import React, { useRef } from 'react';
import { connect } from 'redux-bundler-react';

import Button from './button';
import Icon from './icon';

export default connect(
  'doUploadQueueCsv',
  'doUploadSettingsClear',
  ({
    doUploadQueueCsv,
    doUploadSettingsClear,
    text = 'Choose File',
    icon = 'cloud-upload',
    buttonClass = '',
    clearSettings = true,
  }) => {
    const inputEl = useRef(null);

    const handleClick = (_e) => {
      inputEl.current.click();
    };

    const handleInputChange = (_e) => {
      if (clearSettings) doUploadSettingsClear();
      
      doUploadQueueCsv(inputEl.current.files[0]);
    };

    return (
      <>
        <Button
          className={buttonClass}
          handleClick={handleClick}
          variant='success'
          size='small'
          text={text}
          icon={<Icon icon={icon} className='pr-2' />}
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
