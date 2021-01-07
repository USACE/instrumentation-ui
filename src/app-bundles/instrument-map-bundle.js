import Layer from 'ol/layer/Vector';
import Source from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import Style from 'ol/style/Style';
import Text from 'ol/style/Text';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Circle from 'ol/geom/Circle';

const geoJSON = new GeoJSON();

const instrumentMapBundle = {
  name: 'instrumentMap',
  getReducer: () => {
    const initialData = {
      layer: null,
      _shouldInitialize: true,
      _shouldAddData: false,
      _mapLoaded: false,
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case 'INSTRUMENTS_FETCH_FINISHED':
          return Object.assign({}, state, {
            _shouldAddData: true,
          });
        case 'MAPS_INITIALIZED':
          if (payload.hasOwnProperty('instrumentMap')) {
            return Object.assign({}, state, {
              _mapLoaded: true,
              _shouldAddData: true,
            });
          } else {
            return state;
          }
        case 'MAPS_SHUTDOWN':
          if (payload.hasOwnProperty('instrumentMap')) {
            return Object.assign({}, state, {
              _mapLoaded: false,
            });
          } else {
            return state;
          }
        case 'INSTRUMENTMAP_INITIALIZE_START':
        case 'INSTRUMENTMAP_INITIALIZE_FINISH':
        case 'INSTRUMENTMAP_ADD_DATA_START':
        case 'INSTRUMENTMAP_ADD_DATA_FINISH':
          return Object.assign({}, state, payload);
        default:
          return state;
      }
    };
  },
  doInstrumentMapInitialize: () => ({ dispatch, store }) => {
    dispatch({
      type: 'INSTRUMENTMAP_INITIALIZE_START',
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
      type: 'INSTRUMENTMAP_INITIALIZE_FINISH',
      payload: {
        layer: lyr,
      },
    });
  },

  doInstrumentMapAddData: () => ({ dispatch, store }) => {
    dispatch({
      type: 'INSTRUMENTMAP_ADD_DATA_START',
      payload: {
        _shouldAddData: false,
      },
    });
    const geoProjection = store.selectMapsGeoProjection();
    const webProjection = store.selectMapsWebProjection();
    const map = store.selectMapsObject()['instrumentMap'];
    const lyr = store.selectInstrumentMapLayer();
    const src = lyr.getSource();
    const data = store.selectInstrumentsByRouteGeoJSON();
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
      type: 'INSTRUMENTMAP_ADD_DATA_FINISH',
    });
  },

  selectInstrumentMapLayer: (state) => {
    return state.instrumentMap.layer;
  },

  reactInstrumentMapShouldInitialize: (state) => {
    if (state.instrumentMap._shouldInitialize)
      return { actionCreator: 'doInstrumentMapInitialize' };
  },

  reactInstrumentMapShouldAddData: (state) => {
    if (state.instrumentMap._mapLoaded && state.instrumentMap._shouldAddData)
      return { actionCreator: 'doInstrumentMapAddData' };
  },
};

export default instrumentMapBundle;
