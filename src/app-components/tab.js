import React, { useState } from 'react';

const TabContainer = ({
  tabs = [],
  ...customProps
}) => {
  const [tab, setTab] = useState(0);

  return (
    <div {...customProps}>
      <ul className='nav nav-tabs'>
        {tabs.map((t, i) => (
          <TabItem setTab={setTab} tab={t} index={i} isActive={tab === i} key={i} />
        ))}
      </ul>
      <section className='section mt-3'>
        {tabs[tab] && tabs[tab].content}
      </section>
    </div>
  );
};

const TabItem = ({ tab, setTab, index, isActive }) => {
  const { title } = tab;

  return (
    <li className={`nav-item pointer`}>
      <span
        className={`nav-link${isActive ? ' active' : ''}`}
        onClick={() => setTab(index)}
      >
        {title}
      </span>
    </li>
  );
};

export default {
  Container: TabContainer,
  Item: TabItem,
};
