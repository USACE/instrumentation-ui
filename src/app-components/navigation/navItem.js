import React from 'react';
import { connect } from 'redux-bundler-react';

import { classArray } from '../../utils';

const NavItem = connect(
  'selectPathname',
  ({ pathname, href, handler, children, hidden }) => {
    const cls = classArray([
      'pointer',
      'nav-item',
      pathname.indexOf(href) !== -1 && href !== '/' && 'active',
    ]);

    const handleClick = (e) => {
      if (handler && typeof handler === 'function') handler(e);
    };

    return !hidden ?
      handler ? (
        <li className={cls} onClick={handleClick}>
          <span className='nav-link'>{children}</span>
        </li>
      ) : (
        <li className={cls}>
          <a className='nav-link' href={href}>
            {children}
          </a>
        </li>
      ) : null;
  }
);

export default NavItem;
