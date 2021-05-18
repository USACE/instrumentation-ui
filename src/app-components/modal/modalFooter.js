import React from 'react';
import { connect } from 'redux-bundler-react';

import Button from '../button';
import DeleteButton from './deleteButton';

const ModalFooter = connect(
  'doModalClose',
  ({
    doModalClose,
    onSave = null,
    onCancel = null,
    onDelete = null,
    saveIsSubmit = false,
    saveIsDisabled = false,
    showSaveButton = true,
    showCancelButton = false,
    saveText='Save',
    cancelText='Cancel',
    deleteText='Delete',
    customClosingLogic = false,
  }) => {
    const saveButtonProps = {
      className: 'mr-2',
      text: saveText,
      isDisabled: saveIsDisabled,
      ...saveIsSubmit ? {
        type: 'submit'
      } : {
        handleClick: (e) => {
          if (onSave) onSave(e);
          if (!customClosingLogic) doModalClose();
        },
      },
    };

    return (
      <footer className='modal-footer'>
        <div>
          {showSaveButton && <Button {...saveButtonProps} />}
          {(showCancelButton || onCancel) && (
            <Button
              variant='secondary'
              text={cancelText}
              handleClick={(e) => {
                if (onCancel) onCancel(e);
                if (!customClosingLogic) doModalClose();
              }}
            />
          )}
        </div>
        {onDelete && (
          <DeleteButton
            deleteText={deleteText}
            handleDelete={onDelete}
            customClosingLogic={customClosingLogic}
          />
        )}
      </footer>
    );
  }
);

export default ModalFooter;
