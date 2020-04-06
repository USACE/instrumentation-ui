import Select from "ol/interaction/Select";
import DragBox from "ol/interaction/DragBox";
import { defaults } from "ol/interaction";

export default {
  name: "mapInteractions",

  getReducer: () => {
    const initialData = {
      select: null,
      dragBox: null,
      defaultInteractions: [],
      _shouldInitialize: false
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case "MAP_INTERACTIONS_INITIALIZE_START":
        case "MAP_INTERACTIONS_INITIALIZE_FINISH":
        case "MAP_INTERACTIONS_RESET_START":
          return Object.assign({}, state, payload);
        case "MAP_INITIALIZED":
          return Object.assign({}, state, {
            _shouldInitialize: true
          });
        default:
          return state;
      }
    };
  },

  doMapInteractionsInitialize: () => ({ dispatch, store }) => {
    dispatch({
      type: "MAP_INTERACTIONS_INITIALIZE_START",
      payload: {
        _shouldInitialize: false
      }
    });

    const map = store.selectMap();

    const select = new Select();
    map.addInteraction(select);

    const dragBox = new DragBox();
    dragBox.on("boxend", store.doMapInteractionsSelectByArea);
    dragBox.on("boxstart", () => {
      select.getFeatures().clear();
    });

    dispatch({
      type: "MAP_INTERACTIONS_INITIALIZE_FINISH",
      payload: {
        select,
        dragBox
      }
    });
  },

  doMapInteractionsRemoveAll: () => ({ dispatch, store }) => {
    const map = store.selectMap();
    const interactions = [...map.getInteractions().getArray()];
    const n = interactions.length;
    for (var i = 0; i < n; i++) {
      const interaction = interactions[i];
      map.removeInteraction(interaction);
    }
  },

  doMapInteractionsReset: () => ({ dispatch, store }) => {
    store.doMapInteractionsRemoveAll();
    const map = store.selectMap();
    const defaultInteractions = defaults();
    const select = store.selectMapInteractionsSelect();
    map.addInteraction(select);
    defaultInteractions.forEach(interaction => {
      map.addInteraction(interaction);
    });
  },

  doMapInteractionsSelectMode: () => ({ dispatch, store }) => {
    store.doMapInteractionsRemoveAll();
    const dragBox = store.selectMapInteractionsDragBox();
    const select = store.selectMapInteractionsSelect();
    const map = store.selectMap();
    map.addInteraction(dragBox);
    map.addInteraction(select);
  },

  doMapInteractionsSelectByArea: e => ({ dispatch, store }) => {
    /**
     * Based on openlayers example from https://openlayers.org/en/latest/examples/box-selection.html
     */
    // grab all the pieces we need from the store
    const map = store.selectMap();
    const dragBox = store.selectMapInteractionsDragBox();
    const select = store.selectMapInteractionsSelect();
    const selectedFeatures = select.getFeatures();

    const lyr = store.selectInstrumentsLayer();
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
    src.forEachFeatureIntersectingExtent(extent, function(feature) {
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
      candidateFeatures.forEach(function(feature) {
        const geometry = feature.getGeometry().clone();
        geometry.rotate(-rotation, anchor);
        if (geometry.intersectsExtent(extent$1)) {
          selectedFeatures.push(feature);
        }
      });
    }
  },

  selectMapInteractionsDefaultInteractions: state =>
    state.mapInteractions.defaultInteractions,

  selectMapInteractionsSelect: state => state.mapInteractions.select,

  selectMapInteractionsDragBox: state => state.mapInteractions.dragBox,

  reactMapInteractionsShouldInitialize: state => {
    if (state.mapInteractions._shouldInitialize)
      return { actionCreator: "doMapInteractionsInitialize" };
  }
};
