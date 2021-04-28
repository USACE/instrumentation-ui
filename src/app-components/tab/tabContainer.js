import React, { useState } from 'react';

import TabItem from './tabItem';

import './tab.scss';

/**
 * A component used to switch between large page contexts within a single page of the application.
 * @param {Array} tabs - THe list of tabs to be generated and the element to be displayed when active. Item structure = `{ title: string, content: Element, isHidden: boolean, paddingSmall: boolean }`
 * @param {Array} tabListClass - Class(es) to be applied to unordered list element that wraps the TabItems.
 * @param {Array} contentClass - Class(es) to be applied to the element that wraps the rendered content within the tab.
 * @param {Array} onTabChange - Callback function that is executed when the user selects a new tab. `callback(tab.title, index)`
 * @param {Array} theme - Sets the theme of the the tab container. One of `['default', 'navigation']`
 * @param {Number} defaultTab - Sets the tab, via the array index, that is open when initially rendered. Defaults to `0`
 * @returns TabContainer `React Element`
 */
const TabContainer = ({
  tabs = [],
  tabListClass = '',
  contentClass = '',
  onTabChange = () => {},
  theme = 'default',
  defaultTab = 0,
  ...customProps
}) => {
  const [tabIndex, setTabIndex] = useState(defaultTab);

  const changeTab = (title, index) => {
    onTabChange(title, index);
    setTabIndex(index);
  };

  return (
    <div {...customProps}>
      <ul className={`nav nav-tabs ${tabListClass}`}>
        {tabs.map((t, i) => (
          <TabItem changeTab={changeTab} tab={t} index={i} isActive={tabIndex === i} key={i} />
        ))}
      </ul>
      <section className={`section mt-3 ${contentClass}`}>
        {tabs[tabIndex] && tabs[tabIndex].content}
      </section>
    </div>
  );
};

export default TabContainer;
