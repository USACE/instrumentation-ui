import React, { useCallback, useEffect } from 'react';
import { connect } from 'redux-bundler-react';

import { classArray } from '../../common/helpers/utils';

const Modal = connect(
  'doModalClose',
  'selectModalContent',
  'selectModalProps',
  'selectModalSize',
  ({
    doModalClose,
    modalContent: ModalContent,
    modalProps,
    modalSize,
    closeWithEscape = false,
  }) => {
    const modalCls = classArray([
      'modal-dialog',
      'modal-dialog-scrollable',
      'modal-dialog-centered',
      modalSize && `modal-${modalSize}`,
    ]);

    const closeModalWithEscape = useCallback((e) => {
      if (e.keyCode === 27) doModalClose();
    }, [doModalClose]);

    useEffect(() => {
      if (!!ModalContent && closeWithEscape) {
        document.addEventListener('keydown', closeModalWithEscape);
      }

      if (!ModalContent) {
        document.removeEventListener('keydown', closeModalWithEscape);
      }
    }, [ModalContent, closeModalWithEscape]);

    return (
      !!ModalContent && (
        <>
          <div
            onClick={doModalClose}
            className='modal fade show'
            style={{ display: 'block', backgroundColor: '#ccc', opacity: 0.5 }}
          />
          <div className='modal fade show' style={{ display: 'block' }}>
            <div className={modalCls}>
              <ModalContent {...modalProps} style={{ overflow: 'scroll' }} />
            </div>
          </div>
        </>
      )
    );
  }
);

export default Modal;
