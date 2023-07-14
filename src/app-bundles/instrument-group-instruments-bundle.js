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
  postTemplate: '/instrument_groups/:groupId/instruments', // Add an instrument to the group
  deleteTemplate: '/instrument_groups/:groupId/instruments/{:item.id}', // Remove an instrument from the group
  fetchActions: ['INSTRUMENTGROUPS_FETCH_FINISHED'],
  forceFetchActions: [
    'INSTRUMENTS_SAVE_FINISHED',
    'INSTRUMENTGROUPINSTRUMENTS_SAVE_FINISHED',
    'INSTRUMENTGROUPINSTRUMENTS_DELETE_FINISHED',
  ],
  urlParamSelectors: ['selectInstrumentGroupsIdByRoute'],
  addons: {
    selectInstrumentGroupInstrumentsRaw: (state) => state.instrumentGroupInstruments,
    selectInstrumentGroupInstrumentsInstruments: (state) => {
      const raw = state.instrumentGroupInstruments;
      // eslint-disable-next-line no-unused-vars
      const { measurements, ...rest } = raw;

      const items = {};
      Object.keys(rest).forEach((key) => {
        if (key[0] !== '_') items[key] = rest[key];
      });

      return items;
    },
    selectInstrumentGroupInstrumentsMeasurements: (state) => state.instrumentGroupInstruments.measurements,

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

    doFetchInstrumentGroupTimeseriesMeasurements: ({ before, after }) => ({ dispatch, store, apiGet }) => {
      dispatch({ type: 'FETCH_INSTRUMENT_GROUP_TIMESERIES_MEASUREMENTS_START', payload: {} });
      
      const groupId = store.selectInstrumentGroupsIdByRoute().groupId;
      const url = `/instrument_groups/${groupId}/timeseries_measurements?before=${before}&after=${after}`;

      apiGet(url, (_err, body) => {
        dispatch({
          type: 'INSTSRUMENT_GROUP_UPDATE_TIMESERIES_MEASUREMENTS',
          payload: {
            measurements: body,
          },
        });
      });
    },
  },

  reduceFurther: (state, { type, payload }) => {
    switch (type) {
      case 'INSTSRUMENT_GROUP_UPDATE_TIMESERIES_MEASUREMENTS':
        return {
          ...state,
          ...payload,
        };
      default:
        return state;
    }
  },
});
