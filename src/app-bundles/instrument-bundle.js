import createRestBundle from './create-rest-bundle';
import Layer from 'ol/layer/Vector';
import Source from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { createSelector } from 'redux-bundler';
import Style from 'ol/style/Style';
import Text from 'ol/style/Text';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Circle from 'ol/geom/Circle';

const geoJSON = new GeoJSON();

export default createRestBundle({
  name: 'instruments',
  uid: 'slug',
  prefetch: true,
  staleAfter: 10000,
  persist: false,
  sortBy: 'name',
  routeParam: 'instrumentSlug',
  getTemplate: '/projects/:projectId/instruments',
  putTemplate: '/projects/:projectId/instruments/:item.id',
  postTemplate: '/projects/:projectId/instruments',
  deleteTemplate: '/projects/:projectId/instruments/:item.id',
  fetchActions: ['URL_UPDATED', 'AUTH_LOGGED_IN', 'PROJECTS_FETCH_FINISHED'],
  forceFetchActions: [
    'INSTRUMENTS_SAVE_FINISHED',
    'INSTRUMENTS_DELETE_FINISHED',
    'INSTRUMENTSTATUS_SAVE_FINISHED',
    'INSTRUMENTZ_SAVE_FINISHED',
  ],
  urlParamSelectors: ['selectProjectsIdByRoute'],
  addons: {
    doInstrumentsInitializeLayer: () => ({ dispatch, store }) => {
      dispatch({
        type: 'INSTRUMENTS_INITIALIZE_LAYER_START',
        payload: {
          _shouldInitializeLayer: false,
        },
      });

      const map = store.selectMap();
      const lyr = new Layer({
        source: new Source(),
        declutter: true,
        style: (f, r) => {
          return new Style({
            geometry: new Circle(f.getGeometry().getCoordinates(), 5 * r),
            fill: new Fill({
              color: '#000000',
            }),
            stroke: new Stroke({
              color: '#ffffff',
              width: 1,
            }),
            text: new Text({
              fill: new Fill({
                color: '#000000',
              }),
              font: '16px sans-serif',
              offsetX: 12,
              offsetY: -12,
              padding: [2, 2, 2, 2],
              stroke: new Stroke({
                color: '#ffffff',
                width: 2,
              }),
              text: f.get('name'),
              textAlign: 'left',
            }),
          });
        },
      });
      map.addLayer(lyr);

      dispatch({
        type: 'INSTRUMENTS_INITIALIZE_LAYER_FINISH',
        payload: {
          _layer: lyr,
          _shouldLoadData: true,
        },
      });
    },

    doInstrumentsLoadData: () => ({ dispatch, store }) => {
      dispatch({
        type: 'INSTRUMENTS_LOAD_DATA_START',
        payload: {
          _shouldLoadData: false,
        },
      });

      const geoProjection = store.selectMapsGeoProjection();
      const webProjection = store.selectMapsWebProjection();
      const lyr = store.selectInstrumentsLayer();
      const src = lyr.getSource();
      const data = store.selectInstrumentsItemsGeoJSON();

      src.addFeatures(
        geoJSON.readFeatures(data, {
          featureProjection: webProjection,
          dataProjection: geoProjection,
        })
      );
    },

    selectInstrumentsItemsObjectById: createSelector(
      'selectInstrumentsItems',
      (items) => {
        return items.reduce((out, instrument) => {
          out[instrument.id] = instrument;
          return out;
        }, {});
      }
    ),

    selectInstrumentsLayer: (state) => state.instruments._layer,

    selectInstrumentsItemsGeoJSON: createSelector(
      'selectInstrumentsItems',
      (items) => {
        return {
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
        };
      }
    ),

    selectInstrumentsByRouteGeoJSON: createSelector(
      'selectInstrumentsByRoute',
      (item) => {
        if (!item) return null;

        const feature = {
          type: 'Feature',
          geometry: { ...item.geometry },
          properties: { ...item },
        };

        delete feature.properties.geometry;

        return {
          type: 'FeatureCollection',
          features: [feature],
        };
      }
    ),

    selectInstrumentsIdByRoute: createSelector(
      'selectInstrumentsByRoute',
      (instrument) => {
        if (instrument && instrument.id) return { instrumentId: instrument.id };
        return null;
      }
    ),

    selectInstrumentsNames: createSelector(
      'selectInstrumentsItems',
      (items) => {
        return items.map((item) => {
          return item.name;
        });
      }
    ),

    reactInstrumentsShouldInitializeLayer: (state) => {
      if (state.instruments._shouldInitializeLayer)
        return { actionCreator: 'doInstrumentsInitializeLayer' };
    },

    reactInstrumentsShouldLoadData: (state) => {
      if (state.instruments._shouldLoadData)
        return { actionCreator: 'doInstrumentsLoadData' };
    },
  },
  reduceFurther: (state, { type, payload }) => {
    switch (type) {
      case 'MAP_INITIALIZED':
        return Object.assign({}, state, {
          _shouldInitializeLayer: true,
        });
      case 'INSTRUMENTS_INITIALIZE_LAYER_START':
      case 'INSTRUMENTS_INITIALIZE_LAYER_FINISH':
      case 'INSTRUMENTS_LOAD_DATA_START':
      case 'INSTRUMENTS_LOAD_DATA_FINISH':
        return Object.assign({}, state, payload);
      default:
        return state;
    }
  },
});
