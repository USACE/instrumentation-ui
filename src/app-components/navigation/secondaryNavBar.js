import React from 'react';

// import { TabItem } from '../tab';
import TabContainer from '../tab/tabContainer';

const SecondaryNavBar = ({
  headingNode = null,
  navLinks = [],
}) => (
  <div className='secondary-nav-container'>
    <div className='secondary-nav-heading'>
      {headingNode}
    </div>
    <div />
    <TabContainer
      tabs={navLinks}
      tabListClass='secondary-nav-tabs'
      contentClass='secondary-nav-page-content'
    />
  </div>
);

export default SecondaryNavBar;
