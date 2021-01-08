import React, { useState } from 'react';

const TabContainer = ({
  tabs = [],
  tabListClass = '',
  contentClass = '',
  onTabChange = () => {},
  ...customProps
}) => {
  const [tab, setTab] = useState(0);

  const changeTab = (title, index) => {
    onTabChange(title);
    setTab(index);
  };

  return (
    <div {...customProps}>
      <ul className={`nav nav-tabs ${tabListClass}`}>
        {tabs.map((t, i) => (
          <TabItem changeTab={changeTab} tab={t} index={i} isActive={tab === i} key={i} />
        ))}
      </ul>
      <section className={`section mt-3 ${contentClass}`}>
        {tabs[tab] && tabs[tab].content}
      </section>
    </div>
  );
};

const TabItem = ({ tab, changeTab, index, isActive }) => {
  const { title } = tab;

  return (
    <li className={`nav-item pointer`}>
      <span
        className={`nav-link${isActive ? ' active' : ''}`}
        onClick={() => changeTab(title, index)}
      >
        <b>{title}</b>
      </span>
    </li>
  );
};

const tabObject = {
  Container: TabContainer,
  Item: TabItem,
};

export default tabObject;
