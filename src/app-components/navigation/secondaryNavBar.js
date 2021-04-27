import React from 'react';

import TabContainer from '../tab/tabContainer';

const SecondaryNavBar = ({
  navLinks = [],
}) => {
  const defaultTab = location.hash ? navLinks.findIndex(elem => elem.uri == location.hash) : 0;

  console.log('test defaultTab:', defaultTab);

  return (
    <div className='secondary-nav-container'>
      <div className='secondary-nav-heading' />
      <TabContainer
        tabs={navLinks}
        tabListClass='secondary-nav-tabs'
        contentClass='secondary-nav-page-content'
        onTabChange={(_, index) => location.hash = navLinks[index].uri}
        defaultTab={defaultTab}
      />
    </div>
  );
};
  

export default SecondaryNavBar;
