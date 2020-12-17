import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';

import Button from './button';
import { classnames } from '../utils';

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

export const ModalHeader = connect(
  'doModalClose',
  ({
    doModalClose,
    title = '',
  }) => (
    <header className='modal-header'>
      <h5 className='modal-title'>{title}</h5>
      <span className='close pointer text-primary' onClick={doModalClose}>&times;</span>
    </header>
  )
);

export const ModalFooter = connect(
  'doModalClose',
  ({
    doModalClose,
    onSave = null,
    onCancel = null,
    onDelete = null,
    saveIsSubmit = false,
    showCancelButton = false,
    saveText='Save',
    cancelText='Cancel',
    deleteText='Delete',
    customClosingLogic = false,
  }) => {
    const saveButtonProps = {
      className: 'mr-2',
      text: saveText,
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
          <Button {...saveButtonProps} />
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

export default connect(
  'doModalClose',
  'selectModalContent',
  'selectModalProps',
  'selectModalSize',
  ({ modalContent: ModalContent, doModalClose, modalProps, modalSize }) => {
    if (!ModalContent) {
      document.body.classList.remove('no-scroll');
      return null;
    }

    document.body.classList.add('no-scroll');

    const modalCls = classnames({
      'modal-dialog': true,
      'modal-dialog-scrollable': true,
      'modal-dialog-centered': true,
      'modal-sm': modalSize === 'sm',
      'modal-lg': modalSize === 'lg',
      'modal-xl': modalSize === 'xl',
    });
    return (
      <>
        <div
          onClick={doModalClose}
          className='modal fade show'
          style={{ display: 'block', backgroundColor: '#ccc', opacity: 0.5 }}
        ></div>
        <div className='modal fade show' style={{ display: 'block' }}>
          <div className={modalCls}>
            <ModalContent {...modalProps} />
          </div>
        </div>
      </>
    );
  }
);
