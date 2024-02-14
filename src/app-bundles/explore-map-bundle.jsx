import GeoJSON from 'ol/format/GeoJSON';
import { createNewExplorerLayer, defaultLayer } from './map-helpers';

const geoJSON = new GeoJSON();
const ignoreActions = ['APP_IDLE'];

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
      _domainsLoaded: false,
    };

    return (state = initialData, { type, payload }) => {
      if (import.meta.env.DEV) {
        if (!ignoreActions.includes(type))
          // eslint-disable-next-line no-console
          console.log(type, payload);
      };
      switch (type) {
        case 'INSTRUMENTS_FETCH_FINISHED':
          return {
            ...state,
            _instrumentsLoaded: true,
          };
        case 'INSTRUMENTGROUPS_FETCH_FINISHED':
          return {
            ...state,
            _groupsLoaded: true,
          };
        case 'DOMAINS_FETCH_FINISHED':
          return {
            ...state,
            _domainsLoaded: true,
          };
        case 'MAPS_INITIALIZED':
          if (Object.prototype.hasOwnProperty.call(payload, initialData._mapKey)) {
            return {
              ...state,
              _mapLoaded: true,
            };
          } else {
            return state;
          }
        case 'MAPS_SHUTDOWN':
          if (Object.prototype.hasOwnProperty.call(payload, initialData._mapKey)) {
            return {
              ...initialData
            };
          } else {
            return state;
          }
        case 'EXPLOREMAP_INITIALIZE_START':
        case 'EXPLOREMAP_INITIALIZE_FINISH':
        case 'EXPLOREMAP_ADD_DATA_START':
        case 'EXPLOREMAP_ADD_DATA_FINISH':
          return {
            ...state,
            ...payload,
          }
        default:
          return state;
      }
    };
  },

  doExploreMapInitialize: () => ({ dispatch }) => {
    dispatch({
      type: 'EXPLOREMAP_INITIALIZE_START',
      payload: {
        _shouldInitialize: false,
      },
    });

    dispatch({
      type: 'EXPLOREMAP_INITIALIZE_FINISH',
      payload: {
        layer: defaultLayer,
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

    const domains = store.selectDomainsItemsByGroup();
    const mapKey = store.selectExploreMapKey();
    const map = store.selectMapsObject()[mapKey];
    const geoProjection = store.selectMapsGeoProjection();
    const webProjection = store.selectMapsWebProjection();
  
    // Remove old layers
    const oldLyr = store.selectExploreMapLayer();
    const src = oldLyr.getSource();
      map.removeLayer(oldLyr);
      map.removeSource
      src.clear();

    //add new layers
    const newLyr = createNewExplorerLayer(domains);
    const newSrc = newLyr.getSource();
    const data = store.selectInstrumentsItemsGeoJSON();
    const features = geoJSON.readFeatures(data, {
      featureProjection: webProjection,
      dataProjection: geoProjection,
    });
    map.addLayer(newLyr);
    newSrc.addFeatures(features);
    
    const view = map.getView();
    if (features && features.length) {
      view.fit(newSrc.getExtent(), {
        padding: [50, 50, 50, 50],
        maxZoom: 16,
      });
    }

    dispatch({
      type: 'EXPLOREMAP_ADD_DATA_FINISH',
      payload: {
        layer: newLyr,
      }
    });
  },

  selectExploreMapKey: (state) => state.exploreMap._mapKey,
  selectExploreMapLayer: (state) => state.exploreMap.layer,

  reactExploreMapShouldInitialize: (state) => {
    if (state.exploreMap._shouldInitialize)
      return { actionCreator: 'doExploreMapInitialize' };
  },

  reactExploreMapShouldAddData: (state) => {
    if (
      state.exploreMap._instrumentsLoaded &&
      state.exploreMap._groupsLoaded &&
      state.exploreMap._mapLoaded &&
      state.exploreMap._domainsLoaded
    )
      return { actionCreator: 'doExploreMapAddData' };
  },
};

export default exploreMapBundle;
