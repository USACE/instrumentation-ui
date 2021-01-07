import { get, transform, toLonLat, fromLonLat, transformExtent } from 'ol/proj';
import { register } from 'ol/proj/proj4';
import proj4 from 'proj4';

proj4.defs(
  'EPSG:2237',
  '+proj=tmerc +lat_0=24.33333333333333 +lon_0=-82 +k=0.999941177 +x_0=200000.0001016002 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs'
);

proj4.defs(
  'EPSG:26959',
  '+proj=tmerc +lat_0=24.33333333333333 +lon_0=-82 +k=0.999941177 +x_0=200000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
);

// NAD83(HARN) / Florida West (m)
proj4.defs(
  'EPSG:2778',
  '+proj=tmerc +lat_0=24.33333333333333 +lon_0=-82 +k=0.999941177 +x_0=200000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
);

// NAD83(HARN) / Florida West (ftUS)
proj4.defs(
  'EPSG:2882',
  '+proj=tmerc +lat_0=24.33333333333333 +lon_0=-82 +k=0.999941177 +x_0=200000.0001016002 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs'
);

// NAD83(HARN) / Florida East (ftUS)
proj4.defs(
  'EPSG:2881',
  '+proj=tmerc +lat_0=24.33333333333333 +lon_0=-81 +k=0.999941177 +x_0=200000.0001016002 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs'
);

register(proj4);

const projectionBundle = {
  name: 'proj',

  getReducer: () => {
    const initialData = {
      displayProjection: 'NAD83(HARN) / Florida East (ftUS)',
      options: {
        'WGS 84 (DD)': get('EPSG:4326'),
        'NAD83(HARN) / Florida West (ftUS)': get('EPSG:2882'),
        'NAD83(HARN) / Florida East (ftUS)': get('EPSG:2881'),
      },
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case 'PROJ_SET_DISPLAY_PROJECTION':
          return Object.assign({}, state, payload);
        default:
          return state;
      }
    };
  },

  doProjSetDisplayProjection: (projection) => ({ dispatch }) => {
    dispatch({
      type: 'PROJ_SET_DISPLAY_PROJECTION',
      payload: {
        displayProjection: projection,
      },
    });
  },

  doProjTransformFromLonLat: (coordinate, destination) => ({
    dispatch,
    store,
  }) => {
    return fromLonLat(coordinate, destination);
  },

  doProjTransformToLonLat: (coordinate, source) => ({ dispatch, store }) => {
    return toLonLat(coordinate, source);
  },

  doProjTransform: (coordinate, source, destination) => ({
    dispatch,
    store,
  }) => {
    return transform(coordinate, source, destination);
  },

  doProjTransformExtent: (extent, source, destination) => ({
    dispatch,
    store,
  }) => {
    return transformExtent(extent, source, destination);
  },

  selectProjOptions: (state) => {
    return state.proj.options;
  },

  selectProjDisplayProjection: (state) => {
    return state.proj.displayProjection;
  },
};

export default projectionBundle;
