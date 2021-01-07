import React from 'react';

const Panel = ({ children }) => {
  return (
    <div style={{ position: 'absolute', top: 0, right: 0, left: 0, bottom: 0 }}>
      {children}
    </div>
  );
};

export default Panel;
