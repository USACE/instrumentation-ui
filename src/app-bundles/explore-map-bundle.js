import Layer from 'ol/layer/Vector';
import Source from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import Style from 'ol/style/Style';
import Text from 'ol/style/Text';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Circle from 'ol/geom/Circle';

const geoJSON = new GeoJSON();

const statusColors = {
  active: '#43ac6a',
  inactive: 'grey',
  abandoned: 'grey',
  destroyed: '#f04124',
  lost: '#d08002',
};

const exploreMapBundle = {
  name: 'exploreMap',

  getReducer: () => {
    const initialData = {
      layer: null,
      _mapKey: 'exploreMap',
      _shouldInitialize: true,
      _shouldAddData: false,
      _mapLoaded: false,
      _instrumentsLoaded: false,
      _groupsLoaded: false,
    };

    return (state = initialData, { type, payload }) => {
      if (process.env.NODE_ENV === 'development') console.log(type, payload);
      switch (type) {
        case 'INSTRUMENTS_FETCH_FINISHED':
          return Object.assign({}, state, {
            _instrumentsLoaded: true,
          });
        case 'INSTRUMENTGROUPS_FETCH_FINISHED':
          return Object.assign({}, state, {
            _groupsLoaded: true,
          });
        case 'MAPS_INITIALIZED':
          if (payload.hasOwnProperty(initialData._mapKey)) {
            return Object.assign({}, state, {
              _mapLoaded: true,
            });
          } else {
            return state;
          }
        case 'MAPS_SHUTDOWN':
          if (payload.hasOwnProperty(initialData._mapKey)) {
            return Object.assign({}, state, {
              _mapLoaded: false,
            });
          } else {
            return state;
          }
        case 'EXPLOREMAP_INITIALIZE_START':
        case 'EXPLOREMAP_INITIALIZE_FINISH':
        case 'EXPLOREMAP_ADD_DATA_START':
        case 'EXPLOREMAP_ADD_DATA_FINISH':
          return Object.assign({}, state, payload);
        default:
          return state;
      }
    };
  },

  doExploreMapInitialize: () => ({ dispatch, store }) => {
    dispatch({
      type: 'EXPLOREMAP_INITIALIZE_START',
      payload: {
        _shouldInitialize: false,
      },
    });

    const lyr = new Layer({
      source: new Source(),
      declutter: false,
      style: (f, r) => {
        return new Style({
          geometry: new Circle(f.getGeometry().getCoordinates(), 5 * r),
          fill: new Fill({
            color: '#ffffff',
          }),
          stroke: new Stroke({
            color: statusColors[f.getProperties()['status']],
            width: 3,
          }),
          text: new Text({
            fill: new Fill({
              color: '#000000',
            }),
            font: '10px sans-serif',
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
      type: 'EXPLOREMAP_INITIALIZE_FINISH',
      payload: {
        layer: lyr,
      },
    });
  },

  doExploreMapAddData: () => ({ dispatch, store }) => {
    dispatch({
      type: 'EXPLOREMAP_ADD_DATA_START',
      payload: {
        _mapLoaded: false,
      },
    });
    const mapKey = store.selectExploreMapKey();
    const geoProjection = store.selectMapsGeoProjection();
    const webProjection = store.selectMapsWebProjection();
    const map = store.selectMapsObject()[mapKey];
    const lyr = store.selectExploreMapLayer();
    const src = lyr.getSource();
    const data = store.selectInstrumentsItemsGeoJSON();
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
      type: 'EXPLOREMAP_ADD_DATA_FINISH',
    });
  },

  selectExploreMapKey: (state) => {
    return state.exploreMap._mapKey;
  },

  selectExploreMapLayer: (state) => {
    return state.exploreMap.layer;
  },

  reactExploreMapShouldInitialize: (state) => {
    if (state.exploreMap._shouldInitialize)
      return { actionCreator: 'doExploreMapInitialize' };
  },

  reactExploreMapShouldAddData: (state) => {
    if (
      state.exploreMap._instrumentsLoaded &&
      state.exploreMap._groupsLoaded &&
      state.exploreMap._mapLoaded
    )
      return { actionCreator: 'doExploreMapAddData' };
  },
};

export default exploreMapBundle;
