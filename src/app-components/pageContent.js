import React from 'react';
import { connect } from 'redux-bundler-react';

import { classArray } from '../common/helpers/utils';

const hasDevBanner = process.env.REACT_APP_DEVELOPMENT_BANNER;
const blacklist = ['/', '/help'];

const PageContent = connect(
  'selectPathname',
  ({
    pathname,
    children,
  }) => {
    const pageClasses = classArray([
      blacklist.includes(pathname) ? '' : 'page-margin',
      hasDevBanner && 'banner',
    ]);

    return (
      <div className={pageClasses}>
        {children}
      </div>
    );
  }
);

export default PageContent;
