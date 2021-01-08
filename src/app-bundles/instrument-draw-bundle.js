import Draw from 'ol/interaction/Draw';
import Modify from 'ol/interaction/Modify';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Fill, Stroke, Circle as CircleStyle } from 'ol/style';
import { toLonLat, fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
import debounce from 'lodash.debounce';

// need to initialize once but then add the layer to the map each time...
const instrumentDrawBundle = {
  name: 'instrumentDraw',

  getReducer: () => {
    const initialData = {
      map: null,
      layer: null,
      _shouldInitialize: true,
      _shouldAddToMap: false,
      _ready: false,
    };

    return (state = initialData, { type, payload }) => {
      if (type === 'MAPS_INITIALIZED' && payload.hasOwnProperty('inst-edit')) {
        return Object.assign({}, state, {
          map: payload['inst-edit'],
          _shouldAddToMap: true,
        });
      }

      switch (type) {
        case 'INSTRUMENT_DRAW_INITIALIZE_START':
        case 'INSTRUMENT_DRAW_INITIALIZE_FINISH':
        case 'INSTRUMENT_DRAW_ADD_TO_MAP_START':
        case 'INSTRUMENT_DRAW_ADD_TO_MAP_FINISH':
        case 'INSTRUMENT_DRAW_MAP_CLOSED':
        case 'INSTRUMENT_DRAW_CHANGED':
        case 'INSTRUMENT_DRAW_UPDATE_LOC':
          return Object.assign({}, state, payload);
        default:
          return state;
      }
    };
  },

  doInstrumentDrawInitialize: () => ({ dispatch, store }) => {
    dispatch({
      type: 'INSTRUMENT_DRAW_INITIALIZE_START',
      payload: {
        _shouldInitialize: false,
      },
    });

    const source = new VectorSource();

    source.on('changefeature', debounce(store.doInstrumentDrawChanged, 50));
    source.on('addfeature', store.doInstrumentDrawChanged);

    const layer = new VectorLayer({
      source: source,
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)',
        }),
        stroke: new Stroke({
          color: '#ffcc33',
          width: 2,
        }),
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: '#ffffff',
          }),
          stroke: new Stroke({
            color: '#ffcc33',
            width: 2,
          }),
        }),
      }),
    });
    var modify = new Modify({ source: source });
    const draw = new Draw({
      type: 'Point',
      source: source,
    });
    draw.on('drawstart', () => {
      source.clear();
    });

    dispatch({
      type: 'INSTRUMENT_DRAW_INITIALIZE_FINISH',
      payload: {
        layer: layer,
        draw: draw,
        modify: modify,
      },
    });
  },

  doInstrumentDrawAddToMap: () => ({ dispatch, store }) => {
    dispatch({
      type: 'INSTRUMENT_DRAW_ADD_TO_MAP_START',
      payload: {
        _shouldAddToMap: false,
      },
    });

    const map = store.selectInstrumentDrawMap();
    const draw = store.selectInstrumentDrawInteraction();
    const modify = store.selectInstrumentDrawModify();
    const layer = store.selectInstrumentDrawLayer();

    map.addInteraction(draw);
    map.addInteraction(modify);
    map.addLayer(layer);

    dispatch({
      type: 'INSTRUMENT_DRAW_ADD_TO_MAP_FINISH',
      payload: {
        _ready: true,
      },
    });
  },

  doInstrumentDrawOnMapClose: () => ({ dispatch, store }) => {
    const map = store.selectInstrumentDrawMap();
    const draw = store.selectInstrumentDrawInteraction();
    const modify = store.selectInstrumentDrawModify();
    const layer = store.selectInstrumentDrawLayer();
    const source = layer.getSource();
    source.clear();

    map.removeInteraction(draw);
    map.removeInteraction(modify);
    map.removeLayer(layer);

    dispatch({
      type: 'INSTRUMENT_DRAW_MAP_CLOSED',
      payload: {
        map: null,
        _ready: false,
      },
    });
  },

  doInstrumentDrawChanged: () => ({ dispatch, store }) => {
    const layer = store.selectInstrumentDrawLayer();
    if (!layer) return null;
    const source = layer.getSource();
    const features = source.getFeatures();
    if (!features.length) return null;
    const feature = features[0];
    const geom = feature.getGeometry();
    const coords = geom.getCoordinates();
    const lonLat = toLonLat(coords);
    dispatch({
      type: 'INSTRUMENT_DRAW_CHANGED',
      payload: {
        lon: lonLat[0],
        lat: lonLat[1],
      },
    });
  },

  doInstrumentDrawUpdateLoc: (updates) => ({ dispatch, store }) => {
    dispatch({
      type: 'INSTRUMENT_DRAW_UPDATE_LOC',
      payload: updates,
    });
    const lat = store.selectInstrumentDrawLat();
    const lon = store.selectInstrumentDrawLon();
    const lonLat = [lon, lat];
    const point = new Point(fromLonLat(lonLat));
    const feature = new Feature({ geometry: point });
    const layer = store.selectInstrumentDrawLayer();
    const source = layer.getSource();
    source.clear();
    source.addFeature(feature);
  },

  selectInstrumentDrawInteraction: (state) => {
    return state.instrumentDraw.draw;
  },

  selectInstrumentDrawModify: (state) => {
    return state.instrumentDraw.modify;
  },

  selectInstrumentDrawReady: (state) => {
    return state.instrumentDraw._ready;
  },

  selectInstrumentDrawMap: (state) => {
    return state.instrumentDraw.map;
  },

  selectInstrumentDrawLayer: (state) => {
    return state.instrumentDraw.layer;
  },

  selectInstrumentDrawLon: (state) => {
    return state.instrumentDraw.lon;
  },

  selectInstrumentDrawLat: (state) => {
    return state.instrumentDraw.lat;
  },

  reactInstrumentDrawShouldInitialize: (state) => {
    if (state.instrumentDraw._shouldInitialize)
      return { actionCreator: 'doInstrumentDrawInitialize' };
  },

  reactInstrumentDrawShouldAddToMap: (state) => {
    if (state.instrumentDraw._shouldAddToMap)
      return { actionCreator: 'doInstrumentDrawAddToMap' };
  },
};

export default instrumentDrawBundle;
