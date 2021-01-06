import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';

import Button from '../../app-components/button';

export default connect(
  'doInstrumentGroupInstrumentsDelete',
  ({ doInstrumentGroupInstrumentsDelete, item }) => {
    const [isConfirming, setIsConfirming] = useState(false);

    const handleDelete = () => {
      setIsConfirming(false);
      doInstrumentGroupInstrumentsDelete(item);
    };

    return (
      <>
        {isConfirming ? (
          <div className='btn-group'>
            <Button
              variant='secondary'
              size='small'
              isOutline
              text='Cancel'
              handleClick={() => setIsConfirming(false)}
            />
            <Button
              variant='danger'
              size='small'
              isOutline
              text='Confirm'
              handleClick={handleDelete}
            />
          </div>
        ) : (
          <Button
            variant='danger'
            size='small'
            isOutline
            title='Remove from Group'
            handleClick={() => setIsConfirming(true)}
            icon={<i className='mdi mdi-delete' />}
          />
        )}
      </>
    );
  }
);
