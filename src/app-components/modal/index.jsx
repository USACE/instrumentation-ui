import React from 'react';

export { default } from './modal';
export { default as ModalHeader } from './modalHeader';
export { default as ModalFooter } from './modalFooter';

export const ModalContent = ({ children, className = '', ...customProps }) => (
  <div className={`modal-content ${className}`} {...customProps}>
    {children}
  </div>
);

export const ModalBody = ({ children, className = '', ...customProps }) => (
  <section className={`modal-body ${className}`} {...customProps}>
    {children}
  </section>
);
