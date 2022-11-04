import createRestBundle from './create-rest-bundle';
import { createSelector } from 'redux-bundler';

export default createRestBundle({
  name: 'home',
  uid: null,
  initialFetch: true,
  staleAfter: 45000,
  persist: true,
  routeParam: null,
  getTemplate: '/home',
  fetchActions: ['URL_UPDATED', 'AUTH_LOGGED_IN'],
  forceFetchActions: [],
  prefetch: (store) => {
    const url = store.selectUrlObject();

    return url.pathname === '/';
  },
  addons: {
    selectHomeData: createSelector('selectHomeItems', (items) => {
      const data = items && items.length ? items[0] : null;
      if (!data) return null;
      return {
        Instruments: data.instrument_count,
        'Instrument Groups': data.instrument_group_count,
        Projects: data.project_count,
        'Instruments Added this Week': data.new_instruments_7d,
        'Measurements Recorded in Past 2H': data.new_measurements_2h,
      };
    }),

    selectHashStripQuery: createSelector('selectHash', (hash) => {
      const queryRegex = /\?.*/g;
      return hash ? hash.replace(queryRegex, '') : null;
    }),

    selectHashQuery: createSelector('selectHash', (hash) => {
      if (!hash) return null;

      const [, query] = hash.split('?');
      if (!query) return null;

      const queryArray = query.split('&');

      return queryArray.reduce((accum, elem) => {
        const [key, value] = elem.split('=');
        return {
          ...accum,
          [key]: value,
        };
      }, {});
    }),
  },
});
