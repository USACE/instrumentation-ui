import createRestBundle from './create-rest-bundle';
import { createSelector } from 'redux-bundler';

export default createRestBundle({
  name: 'alertConfigs',
  uid: 'id',
  staleAfter: 10000,
  persist: false,
  routeParam: 'id',
  getTemplate: '/projects/:projectId/instruments/:instrumentId/alert_configs', // "/:" disables any accidental trigger of a fetch
  putTemplate:
    '/projects/:projectId/instruments/:instrumentId/alert_configs/:item.id',
  postTemplate: '/projects/:projectId/instruments/:instrumentId/alert_configs',
  deleteTemplate:
    '/projects/:projectId/instruments/:instrumentId/alert_configs/:item.id',
  fetchActions: ['INSTRUMENTS_FETCH_FINISHED'],
  urlParamSelectors: ['selectProjectsIdByRoute', 'selectInstrumentsIdByRoute'],
  addons: {
    selectAlertConfigsByInstrumentId: createSelector(
      'selectAlertConfigsItems',
      (alerts) => {
        if (!alerts || !alerts.length) return {};
        const out = {};
        alerts.forEach((a) => {
          if (!Object.prototype.hasOwnProperty.call(out, a.instrument_id))
            out[a.instrument_id] = [];
          out[a.instrument_id].push(a);
        });
        return out;
      }
    ),
    selectAlertConfigsByRouteByInstrumentId: createSelector(
      'selectInstrumentsByRoute',
      'selectAlertConfigsByInstrumentId',
      (instruments, alertsByInstrumentId) => {
        if (
          !instruments ||
          !Object.prototype.hasOwnProperty.call(
            alertsByInstrumentId,
            instruments.id
          )
        )
          return [];
        return alertsByInstrumentId[instruments.id];
      }
    ),
  },
});
