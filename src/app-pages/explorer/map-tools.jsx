import React, { useState, useEffect } from 'react';
import { connect } from 'redux-bundler-react';
import { HighlightAlt, ZoomOutMap } from '@mui/icons-material';

import AboutButton from './about-button';
import Button from '../../app-components/button';

export default connect(
  'doExploreMapInteractionsReset',
  'doExploreMapInteractionsSelectMode',
  'selectExploreMapInteractionsVersion',
  ({
    doExploreMapInteractionsReset,
    doExploreMapInteractionsSelectMode,
    exploreMapInteractionsVersion,
  }) => {
    const [selectMode, setSelectMode] = useState(false);

    useEffect(() => {
      if (selectMode) {
        if (typeof doExploreMapInteractionsSelectMode === 'function')
          doExploreMapInteractionsSelectMode();
      } else {
        if (typeof doExploreMapInteractionsReset === 'function')
          doExploreMapInteractionsReset();
      }
      console.log('test new version', exploreMapInteractionsVersion);
    }, [
      selectMode,
      doExploreMapInteractionsReset,
      doExploreMapInteractionsSelectMode,
      exploreMapInteractionsVersion,
    ]);

    return (
      <div style={{ position: 'absolute', left: 7, top: 7 }}>
        <div className='btn-group'>
          <Button
            size='small'
            variant='info'
            className={`${!selectMode ? 'active' : ''}`}
            title='Pan / Zoom'
            handleClick={() => setSelectMode(false)}
            icon={<ZoomOutMap fontSize='small' />}
          />
          <Button
            size='small'
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
