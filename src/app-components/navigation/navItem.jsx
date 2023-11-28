import React from 'react';
import { connect } from 'redux-bundler-react';

import Link from '../link';
import { classArray } from '../../common/helpers/utils';

const NavItem = connect(
  'selectRelativePathname',
  ({ relativePathname: pathname, href, handler, children, hidden }) => {
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
          <Link className='nav-link' to={href}>
            {children}
          </Link>
        </li>
      ) : null;
  }
);

export default NavItem;
