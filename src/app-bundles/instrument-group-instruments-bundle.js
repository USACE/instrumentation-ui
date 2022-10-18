import createRestBundle from './create-rest-bundle';
import { createSelector } from 'redux-bundler';

export default createRestBundle({
  name: 'instrumentGroupInstruments',
  uid: 'id',
  staleAfter: 10000,
  persist: false,
  routeParam: 'groupId',
  getTemplate: '/instrument_groups/:groupId/instruments',
  putTemplate: '',
  postTemplate: '/instrument_groups/:groupId/instruments', // Add an instrument
  deleteTemplate: '/instrument_groups/:groupId/instruments/{:item.id}', // Remove an instrument
  fetchActions: [
    'INSTRUMENTGROUPS_FETCH_FINISHED',
  ],
  forceFetchActions: [
    'INSTRUMENTS_SAVE_FINISHED',
    'INSTRUMENTGROUPINSTRUMENTS_SAVE_FINISHED',
    'INSTRUMENTGROUPINSTRUMENTS_DELETE_FINISHED',
  ],
  urlParamSelectors: ['selectInstrumentGroupsIdByRoute'],
  addons: {
    selectInstrumentGroupInstrumentsItemsGeoJSON: createSelector(
      'selectInstrumentGroupInstrumentsItems',
      (items) => ({
        type: 'FeatureCollection',
        features: items.map((item) => {
          const feature = {
            type: 'Feature',
            geometry: { ...item.geometry },
            properties: { ...item },
          };
          delete feature.properties.geometry;
          return feature;
        }),
      })
    ),
  },
});
