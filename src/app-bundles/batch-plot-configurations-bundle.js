import createRestBundle from './create-rest-bundle';
import { createSelector } from 'redux-bundler';

export default createRestBundle({
  name: 'batchPlotConfigurations',
  uid: 'id',
  persist: false,
  getTemplate: '/projects/:projectId/plot_configurations',
  putTemplate: '/projects/:projectId/plot_configurations/:item.id',
  postTemplate: '/projects/:projectId/plot_configurations',
  deleteTemplate: '/projects/:projectId/plot_configurations/:item.id',
  fetchActions: ['URL_UPDATED', 'PROJECTS_FETCH_FINISHED'],
  forceFetchActions: [],
  urlParamSelectors: ['selectProjectsIdByRoute'],
  prefetch: (store) => {
    const hash = store.selectHashStripQuery();
    const whiteList = ['dashboard', 'batch-plotting'];

    return whiteList.includes(hash);
  },
  addons: {
    doBatchPlotConfigurationsSetActiveId: (id) => ({ dispatch, store }) => {
      dispatch({
        type: 'BATCHPLOTCONFIGURATIONS_SET_ACTIVE_ID',
        payload: {
          _activeBatchPlotConfigurationId: id,
        },
      });
      store.doBatchPlotMapAddData();
    },

    selectBatchPlotConfigurationsRaw: state => state.batchPlotConfigurations,
    selectBatchPlotConfigurationsActiveId: state => state.batchPlotConfigurations._activeBatchPlotConfigurationId,

    selectInstrumentsByBatchPlotConfigurationsGeoJSON: createSelector(
      'selectInstrumentsItems',
      'selectBatchPlotConfigurationsItems',
      'selectInstrumentTimeseriesItemsByRoute',
      'selectBatchPlotConfigurationsActiveId',
      (instruments, batchPlotConfigurations, timeseries, activeId) => {
        const instrumentMap = {};

        if (instruments.length && batchPlotConfigurations.length && timeseries.length) {
          batchPlotConfigurations.forEach(config => {
            const activeTS = timeseries.filter(ts => (config.timeseries_id || []).includes(ts.id));
            instrumentMap[config.id] = instruments.filter(i => activeTS.some(ts => ts.instrument_id === i.id));
          });
        }

        return {
          type: 'FeatureCollection',
          features: activeId && instrumentMap[activeId] ? instrumentMap[activeId].map((item) => {
            const { geometry, ...rest } = item;
            const feature = {
              type: 'Feature',
              geometry: { ...geometry },
              properties: { ...rest },
            };
            return feature;
          }) : {},
        };
      }
    ),
  },
  reduceFurther: (state, { type, payload }) => {
    if (type === 'BATCHPLOTCONFIGURATIONS_SET_ACTIVE_ID') {
      return Object.assign({}, state, payload);
    } else {
      return state;
    }
  },
});
