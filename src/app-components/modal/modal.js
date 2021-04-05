import React from 'react';
import { connect } from 'redux-bundler-react';

import { classArray } from '../../utils';


const Modal = connect(
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

    const modalCls = classArray([
      'modal-dialog',
      'modal-dialog-scrollable',
      'modal-dialog-centered',
      `modal-${modalSize}`,
    ]);

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

export default Modal;
