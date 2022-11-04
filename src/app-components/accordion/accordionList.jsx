import React from 'react';

import './accordion.scss';

const AccordionList = ({ className, children }) => (
  <div className={`accordion ${className}`}>{children}</div>
);

export default AccordionList;
