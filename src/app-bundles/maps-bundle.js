/* eslint-disable no-mixed-operators */
import { createSelector } from "redux-bundler";
import olMap from "ol/Map.js";
import View from "ol/View";

import ScaleBar from "ol/control/ScaleLine";
// import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
// import { OSM, Vector as VectorSource } from "ol/source";
import BasemapPicker from "../ol-controls/basemap-picker";

const actions = {
  MAPS_INITIALIZED: `MAPS_INITIALIZED`,
  MAPS_SHUTDOWN: `MAPS_SHUTDOWN`,
};

export default {
  name: "maps",

  getReducer: () => {
    const initialData = {};

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case actions.MAPS_INITIALIZED:
        case actions.MAPS_SHUTDOWN:
          return Object.assign({}, state, payload);
        default:
          return state;
      }
    };
  },

  doMapsInitialize: (key, el, options) => ({ dispatch, store }) => {
    const map = new olMap(
      Object.assign(
        {
          controls: [new ScaleBar({ units: "us" }), new BasemapPicker()],
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

  selectMapsState: (state) => {
    return state.maps;
  },

  selectMapsObject: createSelector("selectMapsState", (state) => {
    const items = {};
    Object.keys(state).forEach((key) => {
      if (key[0] !== "_") items[key] = state[key];
    });
    return items;
  }),

  selectMapsFlags: createSelector("selectMapsState", (state) => {
    const flags = {};
    Object.keys(state).forEach((key) => {
      if (key[0] === "_") flags[key] = state[key];
    });
    return flags;
  }),
};
