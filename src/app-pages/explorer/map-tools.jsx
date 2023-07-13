import React, { useState, useEffect } from 'react';
import { connect } from 'redux-bundler-react';
import { HighlightAlt, ZoomOutMap } from '@mui/icons-material';

import AboutButton from './about-button';
import Button from '../../app-components/button';

export default connect(
  'doExploreMapInteractionsReset',
  'doExploreMapInteractionsSelectMode',
  ({ doExploreMapInteractionsReset, doExploreMapInteractionsSelectMode }) => {
    const [selectMode, setSelectMode] = useState(false);

    useEffect(() => {
      if (selectMode) {
        if (typeof doExploreMapInteractionsSelectMode === 'function')
          doExploreMapInteractionsSelectMode();
      } else {
        if (typeof doExploreMapInteractionsReset === 'function')
          doExploreMapInteractionsReset();
      }
    }, [
      selectMode,
      doExploreMapInteractionsReset,
      doExploreMapInteractionsSelectMode,
    ]);

    return (
      <div style={{ position: 'absolute', left: 10, top: 10, right: 10 }}>
        <div className='btn-group'>
          <Button
            variant='info'
            className={`${!selectMode ? 'active' : ''}`}
            title='Pan / Zoom'
            handleClick={() => setSelectMode(false)}
            icon={<ZoomOutMap fontSize='small' />}
          />
          <Button
            variant='info'
            className={`${selectMode ? 'active' : ''} mr-2`}
            title='Select by box'
            handleClick={() => setSelectMode(true)}
            icon={<HighlightAlt fontSize='small' />}
          />
        </div>
        <AboutButton />
      </div>
    );
  }
);
