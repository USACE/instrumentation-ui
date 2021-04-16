import React from 'react';

const SecondaryNavBar = ({
  headingNode = null,
  navLinks = [],
}) => (
  <div className='secondary-nav-container'>
    {headingNode}
    <div>
      Test 2
    </div>
  </div>
);

export default SecondaryNavBar;
