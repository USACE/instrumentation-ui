import React, { useState, useEffect } from 'react';
import { connect } from 'redux-bundler-react';

import AboutButton from './about-button';
import Button from '../../app-components/button';
import Icon from '../../app-components/icon';

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
            icon={<Icon icon='pan' />}
          />
          <Button
            variant='info'
            className={`${selectMode ? 'active' : ''} mr-2`}
            title='Select by box'
            handleClick={() => setSelectMode(true)}
            icon={<Icon icon='selection-drag' />}
          />
        </div>
        <AboutButton />
      </div>
    );
  }
);
