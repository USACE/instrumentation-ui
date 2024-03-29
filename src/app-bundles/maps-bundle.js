/* eslint-disable no-mixed-operators */
import { createSelector } from 'redux-bundler';

import olMap from 'ol/Map.js';
import View from 'ol/View';
import ScaleBar from 'ol/control/ScaleLine';
import BasemapPicker from '../ol-controls/basemap-picker';

import 'ol/ol.css';

const actions = {
  MAPS_INITIALIZED: 'MAPS_INITIALIZED',
  MAPS_SHUTDOWN: 'MAPS_SHUTDOWN',
};

const MapsBundle = {
  name: 'maps',

  getReducer: () => {
    const initialData = {
      _geoProjection: 'EPSG:4326',
      _webProjection: 'EPSG:3857',
    };

    return (state = initialData, { type, payload }) => {
      const mapKeys = Object.keys(payload || {});
      const clone = { ...state };

      switch (type) {
        case actions.MAPS_INITIALIZED:
          return {
            ...state,
            ...payload,
          }
        case actions.MAPS_SHUTDOWN:    
          if (mapKeys?.length) {
            mapKeys.forEach(key => delete clone[key]);
            return clone;
          } else return state;
        default:
          return state;
      }
    };
  },

  doMapsInitialize: (key, el, options) => ({ dispatch }) => {
    const map = new olMap(
      Object.assign(
        {
          controls: [new ScaleBar({ units: 'us' }), new BasemapPicker()],
          target: el,
          view: new View({
            center: (options && options.center) || [-11000000, 4600000],
            zoom: (options && options.zoom) || 4,
          }),
          layers: [],
        },
        options
      )
    );
    dispatch({
      type: actions.MAPS_INITIALIZED,
      payload: {
        [key]: map,
      },
    });
  },

  doMapsShutdown: (key) => ({ dispatch }) => {
    dispatch({
      type: actions.MAPS_SHUTDOWN,
      payload: {
        [key]: null,
      },
    });
  },

  selectMapsState: (state) => state.maps,

  selectMapsObject: createSelector('selectMapsState', (state) => {
    const items = {};
    Object.keys(state).forEach((key) => {
      if (key[0] !== '_') items[key] = state[key];
    });
    return items;
  }),

  selectMapsFlags: createSelector('selectMapsState', (state) => {
    const flags = {};
    Object.keys(state).forEach((key) => {
      if (key[0] === '_') flags[key] = state[key];
    });
    return flags;
  }),

  selectMapsGeoProjection: (state) => state.maps._geoProjection,

  selectMapsWebProjection: (state) => state.maps._webProjection,
};

export default MapsBundle;
