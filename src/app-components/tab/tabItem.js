import React from 'react';

import './tab.scss';

const TabItem = ({ tab, changeTab, index, isActive }) => {
  const { title } = tab;

  return (
    <li className={'nav-item pointer'}>
      <span
        className={`nav-link${isActive ? ' active' : ''}`}
        onClick={() => changeTab(title, index)}
      >
        <b>{title}</b>
      </span>
    </li>
  );
};

export default TabItem;
