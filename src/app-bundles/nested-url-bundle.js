import pkg from '../../package.json';
import Url from 'url-parse';
import { createSelector } from 'redux-bundler';

const nestedUrlBundle = {
  name: 'nestedUrl',

  doUpdateUrlWithHomepage: (path) => ({ store }) => {
    if (!pkg || !pkg.homepage) return store.doUpdateUrl(path);
    store.doUpdateUrl(`${pkg.homepage}${path}`);
  },

  selectHomepage: (state) => {
    if (!pkg || !pkg.homepage) return '';
    const url = new Url(pkg.homepage);
    return url.pathname;
  },

  selectPathnameMinusHomepage: createSelector(
    'selectPathname',
    'selectHomepage',
    (pathname, homepage) => {
      const matcher = new RegExp(homepage);
      return pathname.replace(matcher, '');
    }
  ),

  selectPublicFolder: createSelector('selectHomepage', (homepage) => {
    if (process.env.NODE_ENV !== 'production') return '';
    return `${homepage}/`;
  }),
};

export default nestedUrlBundle;
