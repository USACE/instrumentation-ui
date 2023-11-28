import React from 'react';

const base = import.meta.env.VITE_URL_BASE_PATH ?? '';

const Link = ({ to, className, onClick, tabIndex, key, children }) => {
  return <a
    href={to}
    className={className}
    onClick={onClick}
    tabIndex={tabIndex}
    key={key}
  >
    {children}
  </a>;
}

export default Link;
