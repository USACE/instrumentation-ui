import React from 'react';

const Panel = ({ children, className = '' }) => (
  <div className={className} style={{ position: 'absolute', top: 0, right: 0, left: 0, bottom: 0 }}>
    {children}
  </div>
);

export default Panel;
