import React from "react";
import { connect } from "redux-bundler-react";

import Button from '../../app-components/button';

export default connect(
  "doUploadSettingsClear",
  "doUploadSend",
  "selectUploadReadyToUpload",
  ({ doUploadSettingsClear, doUploadSend, uploadReadyToUpload }) => (
    <div className="clearfix">
      <div className="float-right">
        <Button
          variant='secondary'
          className='mr-2'
          text='Clear Settings'
          handleClick={doUploadSettingsClear}
        />
        <Button
          variant='success'
          isDisabled={!uploadReadyToUpload}
          text='Upload'
          handleClick={doUploadSend}
        />
      </div>
    </div>
  )
);
