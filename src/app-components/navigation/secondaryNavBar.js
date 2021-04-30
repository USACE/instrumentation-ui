import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';

import TabContainer from '../tab/tabContainer';

const SecondaryNavBar = connect(
  'selectHashStripQuery',
  ({
    hashStripQuery,
    navLinks = [],
  }) => {
    const getIndex = () => navLinks.findIndex(elem => elem.uri == `#${hashStripQuery}`);

    const defaultTab = hashStripQuery ? getIndex() : 0;
    const [navTab, setNavTab] = useState(defaultTab);
    const [forceUpdateIncrement, setForceUpdateIncrement] = useState(0);

    const onTabChange = (_, index) => {
      location.hash = navLinks[index].uri;
      setNavTab(index);
    };

    useEffect(() => {
      if (`#${hashStripQuery}` !== navLinks[navTab].uri) {
        setForceUpdateIncrement(forceUpdateIncrement + 1);
      }
    }, [navLinks, hashStripQuery, navTab, setForceUpdateIncrement]);

    return (
      <div className='secondary-nav-container'>
        <div className='secondary-nav-heading' />
        <TabContainer
          key={forceUpdateIncrement}
          tabs={navLinks}
          tabListClass='secondary-nav-tabs'
          contentClass='secondary-nav-page-content'
          onTabChange={onTabChange}
          defaultTab={defaultTab}
        />
      </div>
    );
  }
);

export default SecondaryNavBar;
