import Layer from 'ol/layer/Vector';
import Source from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import Style from 'ol/style/Style';
import Text from 'ol/style/Text';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Circle from 'ol/geom/Circle';

const geoJSON = new GeoJSON();

const batchPlotMapBundle = {
  name: 'batchPlotMap',
  getReducer: () => {
    const initialData = {
      layer: null,
      _shouldInitialize: true,
      _shouldAddData: false,
      _mapLoaded: false,
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case 'BATCHPLOTCONFIGURATIONS_SET_ACTIVE_ID':
          return Object.assign({}, state, {
            _shouldAddData: true,
          });
        case 'MAPS_INITIALIZED':
          if (payload.hasOwnProperty('batchPlotMap')) {
            return Object.assign({}, state, {
              _mapLoaded: true,
              _shouldAddData: true,
            });
          } else {
            return state;
          }
        case 'MAPS_SHUTDOWN':
          if (payload.hasOwnProperty('batchPlotMap')) {
            return Object.assign({}, state, {
              _mapLoaded: false,
            });
          } else {
            return state;
          }
        case 'BATCHPLOTMAP_INITIALIZE_START':
        case 'BATCHPLOTMAP_INITIALIZE_FINISH':
        case 'BATCHPLOTMAP_ADD_DATA_START':
        case 'BATCHPLOTMAP_ADD_DATA_FINISH':
          return Object.assign({}, state, payload);
        default:
          return state;
      }
    };
  },

  doBatchPlotMapInitialize: () => ({ dispatch, store }) => {
    dispatch({
      type: 'BATCHPLOTMAP_INITIALIZE_START',
      payload: {
        layer: new Layer({}),
        _shouldInitialize: false,
      },
    });

    const lyr = new Layer({
      source: new Source(),
      declutter: true,
      style: (f, r) => new Style({
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
      }),
    });

    dispatch({
      type: 'BATCHPLOTMAP_INITIALIZE_FINISH',
      payload: {
        layer: lyr,
      },
    });
  },

  doBatchPlotMapAddData: () => ({ dispatch, store }) => {
    dispatch({
      type: 'BATCHPLOTMAP_ADD_DATA_START',
      payload: {
        _shouldAddData: false,
      },
    });
    const geoProjection = store.selectMapsGeoProjection();
    const webProjection = store.selectMapsWebProjection();
    const map = store.selectMapsObject()['batchPlotMap'];
    const lyr = store.selectBatchPlotMapLayer();

    if (lyr && map) {
      const src = lyr.getSource();
      const data = store.selectInstrumentsByBatchPlotConfigurationsGeoJSON();
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
        type: 'BATCHPLOTMAP_ADD_DATA_FINISH',
      });
    } else {
      dispatch({
        type: 'BATCHPLOTMAP_NO_LAYER_READY',
      });
    }
  },

  selectBatchPlotMapLayer: (state) => state.batchPlotMap.layer,

  reactBatchPlotMapShouldInitialize: (state) => {
    if (state.batchPlotMap._shouldInitialize)
      return { actionCreator: 'doBatchPlotMapInitialize' };
  },

  reactBatchPlotMapShouldAddData: (state) => {
    if (state.batchPlotMap._mapLoaded && state.batchPlotMap._shouldAddData)
      return { actionCreator: 'doBatchPlotMapAddData' };
  },
};

export default batchPlotMapBundle;
