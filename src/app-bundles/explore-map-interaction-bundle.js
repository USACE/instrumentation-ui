import Select from 'ol/interaction/Select';
import DragBox from 'ol/interaction/DragBox';
import { defaults } from 'ol/interaction';
import debounce from 'lodash.debounce';

const exploreMapInteractionBundle = {
  name: 'exploreMapInteractions',

  getReducer: () => {
    const initialData = {
      version: 0,
      select: null,
      dragBox: null,
      _shouldInitialize: false,
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case 'EXPLOREMAPINTERACTIONS_INITIALIZE_START':
        case 'EXPLOREMAPINTERACTIONS_INITIALIZE_FINISH':
        case 'EXPLOREMAPINTERACTIONS_RESET_START':
        case 'EXPLOREMAPINTERACTIONS_SELECT_UPDATED':
          return Object.assign({}, state, payload);
        case 'MAPS_INITIALIZED':
          if (payload.hasOwnProperty('exploreMap')) {
            return Object.assign({}, state, {
              _shouldInitialize: true,
            });
          } else {
            return state;
          }
        default:
          return state;
      }
    };
  },

  doExploreMapInteractionsInitialize: () => ({ dispatch, store }) => {
    dispatch({
      type: 'EXPLOREMAPINTERACTIONS_INITIALIZE_START',
      payload: {
        _shouldInitialize: false,
      },
    });

    const mapKey = store.selectExploreMapKey();
    const map = store.selectMapsObject()[mapKey];

    const select = new Select();
    const handleSelectionChange = debounce(
      store.doExploreMapInteractionsIncrementVersion,
      200
    );
    const collection = select.getFeatures();
    collection.on('add', handleSelectionChange);
    collection.on('remove', handleSelectionChange);
    map.addInteraction(select);

    const dragBox = new DragBox();
    dragBox.on('boxend', store.doExploreMapInteractionsSelectByArea);
    dragBox.on('boxstart', () => {
      select.getFeatures().clear();
    });

    dispatch({
      type: 'EXPLOREMAPINTERACTIONS_INITIALIZE_FINISH',
      payload: {
        select,
        dragBox,
      },
    });
  },

  doExploreMapInteractionsIncrementVersion: () => ({ dispatch, store }) => {
    const version = store.selectExploreMapInteractionsVersion();
    dispatch({
      type: 'EXPLOREMAPINTERACTIONS_SELECT_UPDATED',
      payload: {
        version: version + 1,
      },
    });
  },

  doExploreMapInteractionsRemoveAll: () => ({ dispatch, store }) => {
    const mapKey = store.selectExploreMapKey();
    const map = store.selectMapsObject()[mapKey];
    const interactions = [...map.getInteractions().getArray()];
    const n = interactions.length;
    for (var i = 0; i < n; i++) {
      const interaction = interactions[i];
      map.removeInteraction(interaction);
    }
  },

  doExploreMapInteractionsReset: () => ({ dispatch, store }) => {
    const mapKey = store.selectExploreMapKey();
    const map = store.selectMapsObject()[mapKey];
    const defaultInteractions = defaults();
    const select = store.selectExploreMapInteractionsSelect();
    if (map && select) {
      store.doExploreMapInteractionsRemoveAll();
      map.addInteraction(select);
      defaultInteractions.forEach((interaction) => {
        map.addInteraction(interaction);
      });
    }
  },

  doExploreMapInteractionsSelectMode: () => ({ dispatch, store }) => {
    const dragBox = store.selectExploreMapInteractionsDragBox();
    const select = store.selectExploreMapInteractionsSelect();
    const mapKey = store.selectExploreMapKey();
    const map = store.selectMapsObject()[mapKey];
    if (map) {
      store.doExploreMapInteractionsRemoveAll();
      map.addInteraction(dragBox);
      map.addInteraction(select);
    }
  },

  doExploreMapInteractionsSelectByArea: (e) => ({ store }) => {
    /**
     * Based on openlayers example from https://openlayers.org/en/latest/examples/box-selection.html
     */
    // grab all the pieces we need from the store
    const mapKey = store.selectExploreMapKey();
    const map = store.selectMapsObject()[mapKey];
    const dragBox = store.selectExploreMapInteractionsDragBox();
    const select = store.selectExploreMapInteractionsSelect();
    const selectedFeatures = select.getFeatures();

    const lyr = store.selectExploreMapLayer();
    const src = lyr.getSource();

    // features that intersect the box geometry are added to the
    // collection of selected features

    // if the view is not obliquely rotated the box geometry and
    // its extent are equalivalent so intersecting features can
    // be added directly to the collection
    const rotation = map.getView().getRotation();
    const oblique = rotation % (Math.PI / 2) !== 0;
    const candidateFeatures = oblique ? [] : selectedFeatures;
    const extent = dragBox.getGeometry().getExtent();
    src.forEachFeatureIntersectingExtent(extent, function (feature) {
      candidateFeatures.push(feature);
    });

    // when the view is obliquely rotated the box extent will
    // exceed its geometry so both the box and the candidate
    // feature geometries are rotated around a common anchor
    // to confirm that, with the box geometry aligned with its
    // extent, the geometries intersect
    if (oblique) {
      const anchor = [0, 0];
      const geometry = dragBox.getGeometry().clone();
      geometry.rotate(-rotation, anchor);
      const extent$1 = geometry.getExtent();
      candidateFeatures.forEach(function (feature) {
        const geometry = feature.getGeometry().clone();
        geometry.rotate(-rotation, anchor);
        if (geometry.intersectsExtent(extent$1)) {
          selectedFeatures.push(feature);
        }
      });
    }
  },

  selectExploreMapInteractionsVersion: (state) => {
    return state.exploreMapInteractions.version;
  },

  selectExploreMapSelectedInstruments: (state) => {
    const select = state.exploreMapInteractions.select;
    if (select) {
      return select
        .getFeatures()
        .getArray()
        .map((f) => {
          return f.getProperties();
        });
    } else {
      return [];
    }
  },

  selectExploreMapInteractionsSelect: (state) => {
    return state.exploreMapInteractions.select;
  },

  selectExploreMapInteractionsDragBox: (state) => {
    return state.exploreMapInteractions.dragBox;
  },

  reactExploreMapInteractionsShouldInitialize: (state) => {
    if (state.exploreMapInteractions._shouldInitialize)
      return { actionCreator: 'doExploreMapInteractionsInitialize' };
  },
};

export default exploreMapInteractionBundle;
