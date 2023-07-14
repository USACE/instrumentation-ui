import React from 'react';
import { connect } from 'redux-bundler-react';

const ModalHeader = connect(
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

export default ModalHeader;
