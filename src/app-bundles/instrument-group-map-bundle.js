import Layer from 'ol/layer/Vector';
import Source from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
// import { createSelector } from 'redux-bundler';
import Style from 'ol/style/Style';
import Text from 'ol/style/Text';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Circle from 'ol/geom/Circle';

const geoJSON = new GeoJSON();

const instrumentGroupMapBundle = {
  name: 'instrumentGroupMap',
  getReducer: () => {
    const initialData = {
      layer: null,
      _shouldInitialize: true,
      _shouldAddData: false,
      _mapLoaded: false,
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case 'INSTRUMENTGROUPINSTRUMENTS_FETCH_FINISHED':
          return Object.assign({}, state, {
            _shouldAddData: true,
          });
        case 'MAPS_INITIALIZED':
          if (payload.hasOwnProperty('groupMap')) {
            return Object.assign({}, state, {
              _mapLoaded: true,
            });
          } else {
            return state;
          }
        case 'MAPS_SHUTDOWN':
          if (payload.hasOwnProperty('groupMap')) {
            return Object.assign({}, state, {
              _mapLoaded: false,
            });
          } else {
            return state;
          }
        case 'INSTRUMENTGROUPMAP_INITIALIZE_START':
        case 'INSTRUMENTGROUPMAP_INITIALIZE_FINISH':
        case 'INSTRUMENTGROUPMAP_ADD_DATA_START':
        case 'INSTRUMENTGROUPMAP_ADD_DATA_FINISH':
          return Object.assign({}, state, payload);
        default:
          return state;
      }
    };
  },

  doInstrumentGroupMapInitialize: () => ({ dispatch, store }) => {
    dispatch({
      type: 'INSTRUMENTGROUPMAP_INITIALIZE_START',
      payload: {
        _shouldInitialize: false,
      },
    });

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

    dispatch({
      type: 'INSTRUMENTGROUPMAP_INITIALIZE_FINISH',
      payload: {
        layer: lyr,
      },
    });
  },

  doInstrumentGroupMapAddData: () => ({ dispatch, store }) => {
    dispatch({
      type: 'INSTRUMENTGROUPMAP_ADD_DATA_START',
      payload: {
        _shouldAddData: false,
      },
    });
    const geoProjection = store.selectMapsGeoProjection();
    const webProjection = store.selectMapsWebProjection();
    const map = store.selectMapsObject()['groupMap'];
    const lyr = store.selectInstrumentGroupMapLayer();
    const src = lyr.getSource();
    const data = store.selectInstrumentGroupInstrumentsItemsGeoJSON();
    map.removeLayer(lyr);
    src.clear();
    const features = geoJSON.readFeatures(data, {
      featureProjection: webProjection,
      dataProjection: geoProjection,
    });
    src.addFeatures(features);
    map.addLayer(lyr);
    const view = map.getView();
    if (features && features.length) {
      view.fit(src.getExtent(), {
        padding: [50, 50, 50, 50],
        maxZoom: 16,
      });
    }
    dispatch({
      type: 'INSTRUMENTGROUPMAP_ADD_DATA_FINISH',
    });
  },

  selectInstrumentGroupMapLayer: (state) => {
    return state.instrumentGroupMap.layer;
  },

  reactInstrumentGroupMapShouldInitialize: (state) => {
    if (state.instrumentGroupMap._shouldInitialize)
      return { actionCreator: 'doInstrumentGroupMapInitialize' };
  },

  reactInstrumentGroupMapShouldAddData: (state) => {
    if (
      state.instrumentGroupMap._shouldAddData &&
      state.instrumentGroupMap._mapLoaded
    )
      return { actionCreator: 'doInstrumentGroupMapAddData' };
  },
};

export default instrumentGroupMapBundle;
