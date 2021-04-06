import React, { useCallback, useEffect } from 'react';
import { connect } from 'redux-bundler-react';

import { classArray } from '../../utils';

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
    if (!ModalContent) {
      document.body.classList.remove('no-scroll');
    }

    document.body.classList.add('no-scroll');

    const modalCls = classArray([
      'modal-dialog',
      'modal-dialog-scrollable',
      'modal-dialog-centered',
      `modal-${modalSize}`,
    ]);

    const closeModalWithEscape = useCallback((e) => {
      console.log(e.keyCode);
      if (e.keyCode === 27) doModalClose();
    }, [doModalClose]);

    useEffect(() => {
      if (closeWithEscape) {
        document.addEventListener('keydown', closeModalWithEscape);

        if (!ModalContent) {
          document.removeEventListener('keydown', closeModalWithEscape);
        }
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
              <ModalContent {...modalProps} />
            </div>
          </div>
        </>
      )
    );
  }
);

export default Modal;
