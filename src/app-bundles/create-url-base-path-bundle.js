import { createSelector } from "redux-bundler";

export default ({ base }) => {
  return {
    name: 'urlBasePath',

    selectRelativePathname: createSelector('selectPathname', pathname => pathname.replace(base, '')),

    doUpdateRelativeUrl: (url, opts) => ({ store }) => {
      store.doUpdateUrl(`${base}${url}`, opts)
    },
  }
};
