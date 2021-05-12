import createRestBundle from './create-rest-bundle';
import { createSelector } from 'redux-bundler';

export default createRestBundle({
  name: 'alerts',
  uid: 'id',
  staleAfter: 0,
  persist: false,
  routeParam: 'id',
  getTemplate: '/projects/:projectId/instruments/:instrumentId/alerts',
  fetchActions: [
    'INSTRUMENTS_FETCH_FINISHED',
    'ALERTREAD_SAVE_FINISHED',
    'ALERTUNREAD_SAVE_FINISHED',
  ],
  urlParamSelectors: ['selectProjectsIdByRoute', 'selectInstrumentsIdByRoute'],
  addons: {
    selectAlertsByInstrumentId: createSelector(
      'selectAlertsItems',
      (alerts) => {
        if (!alerts || !alerts.length) return {};
        const out = {};
        alerts.forEach((a) => {
          if (!out.hasOwnProperty(a.instrument_id)) out[a.instrument_id] = [];
          out[a.instrument_id].push(a);
        });
        return out;
      }
    ),
    selectAlertsByRouteByInstrumentId: createSelector(
      'selectInstrumentsByRoute',
      'selectAlertsByInstrumentId',
      (instruments, alertsByInstrumentId) => {
        if (
          !instruments ||
          !alertsByInstrumentId.hasOwnProperty(instruments.id)
        )
          return [];
        return alertsByInstrumentId[instruments.id];
      }
    ),
  },
});
