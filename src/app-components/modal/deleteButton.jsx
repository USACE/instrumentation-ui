import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';

import Button from '../button';

const DeleteButton = connect(
  'doModalClose',
  ({
    doModalClose,
    deleteText,
    handleDelete,
    customClosingLogic,
  }) => {
    const [isConfirming, setIsConfirming] = useState(false);

    const onDelete = (e) => {
      setIsConfirming(false);
      handleDelete(e);
      if (!customClosingLogic) doModalClose();
    };

    return (
      isConfirming ? (
        <div className='btn-group'>
          <Button
            variant='danger'
            text='Confirm'
            handleClick={onDelete}
          />
          <Button
            variant='secondary'
            text='Cancel'
            handleClick={() => setIsConfirming(false)}
          />
        </div>
      ) : (
        <Button
          variant='danger'
          text={deleteText}
          handleClick={() => setIsConfirming(true)}
        />
      )
    );
  }
);

export default DeleteButton;
