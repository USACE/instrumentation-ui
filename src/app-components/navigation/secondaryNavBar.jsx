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

    const defaultTab = hashStripQuery ? getIndex() : () => {
      location.hash = navLinks[0].uri;
      return 0;
    };
    const [navTab, setNavTab] = useState(defaultTab);
    const [forceUpdateIncrement, setForceUpdateIncrement] = useState(0);

    const onTabChange = (_, index) => {
      location.hash = navLinks[index].uri;
      setNavTab(index);
    };

    useEffect(() => {
      if (navLinks[navTab]) {
        if (`#${hashStripQuery}` !== navLinks[navTab].uri) {
          setForceUpdateIncrement(forceUpdateIncrement + 1);
        }
      } else {
        location.assign('/not-found');
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
          changeTabDelay={350}
        />
      </div>
    );
  }
);

export default SecondaryNavBar;
