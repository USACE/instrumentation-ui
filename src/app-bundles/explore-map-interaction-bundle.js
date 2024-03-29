import Select from 'ol/interaction/Select';
import DragBox from 'ol/interaction/DragBox';
import { defaults } from 'ol/interaction';
import debounce from 'lodash.debounce';
import { createIconStyle } from './map-helpers';

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
        case 'EXPLOREMAP_ADD_DATA_START':
          return {
            ...state,
            select: null,
            dragBox: null,
          };
        case 'EXPLOREMAP_ADD_DATA_FINISH':
          return {
            ...state,
            _shouldInitialize: true,
          };
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

    const domains = store.selectDomainsItemsByGroup();
    const instrumentTypes = domains['instrument_type'] || {};

    const version = store.selectExploreMapInteractionsVersion();
    const mapKey = store.selectExploreMapKey();
    const map = store.selectMapsObject()[mapKey];

    const blue = '#0000FF';

    const select = new Select({
      style: (feature, _r) => createIconStyle({
        feature,
        instrumentTypes,
        imageOpts: {
          status: 'selected',
        },
        textOpts: {
          color: blue,
        }
      })
    });
    const handleSelectionChange = debounce(
      () => store.doExploreMapInteractionsIncrementVersion(),
      200
    );
    const collection = select.getFeatures();
    collection.on('add', handleSelectionChange);
    collection.on('remove', handleSelectionChange);
    map.addInteraction(select);

    const dragBox = new DragBox();
    dragBox.on('boxend', () => store.doExploreMapInteractionsSelectByArea());
    dragBox.on('boxstart', () => {
      select.getFeatures().clear();
    });

    dispatch({
      type: 'EXPLOREMAPINTERACTIONS_INITIALIZE_FINISH',
      payload: {
        select,
        dragBox,
        version: version + 1,
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

  doExploreMapInteractionsRemoveAll: () => ({ store }) => {
    const mapKey = store.selectExploreMapKey();
    const map = store.selectMapsObject()[mapKey];
    const interactions = [...map.getInteractions().getArray()];
    const n = interactions.length;
    for (var i = 0; i < n; i++) {
      const interaction = interactions[i];
      map.removeInteraction(interaction);
    }
  },

  doExploreMapInteractionsReset: () => ({ store }) => {
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

  doExploreMapInteractionsSelectMode: () => ({ store }) => {
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

  doExploreMapInteractionsSelectByArea: () => ({ store }) => {
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
    src.forEachFeatureIntersectingExtent(extent, (feature) => {
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
      candidateFeatures.forEach((feature) => {
        const geometry = feature.getGeometry().clone();
        geometry.rotate(-rotation, anchor);
        if (geometry.intersectsExtent(extent$1)) {
          selectedFeatures.push(feature);
        }
      });
    }
  },

  selectExploreMapSelectedInstruments: (state) => {
    const select = state.exploreMapInteractions.select;
    if (select) {
      return select
        .getFeatures()
        .getArray()
        .map((f) => f.getProperties());
    } else {
      return [];
    }
  },

  selectExploreMapInteractionsSelect: state => state.exploreMapInteractions.select,
  selectExploreMapInteractionsDragBox: state => state.exploreMapInteractions.dragBox,
  selectExploreMapInteractionsVersion: state => state.exploreMapInteractions.version,

  reactExploreMapInteractionsShouldInitialize: (state) => {
    if (state.exploreMapInteractions._shouldInitialize)
      return { actionCreator: 'doExploreMapInteractionsInitialize' };
  },
};

export default exploreMapInteractionBundle;
