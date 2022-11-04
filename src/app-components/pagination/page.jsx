import React from 'react';

import { classnames } from '../../utils';

const Page = ({ pageNo, isCurrent, onClick }) => {
  const pageClass = classnames({
    'page-item': true,
    active: isCurrent,
  });

  return (
    <li className={pageClass} onClick={onClick}>
      <a className='page-link' aria-label={`Goto page ${pageNo}`}>
        {pageNo + 1}
      </a>
    </li>
  );
};

export default Page;
