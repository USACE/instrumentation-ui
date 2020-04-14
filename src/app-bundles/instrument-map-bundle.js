import Layer from "ol/layer/Vector";
import Source from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
// import { createSelector } from "redux-bundler";
import Style from "ol/style/Style";
import Text from "ol/style/Text";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Circle from "ol/geom/Circle";

const geoJSON = new GeoJSON();

export default {
  name: "instrumentMap",
  getReducer: () => {
    const initialData = {
      _dataLoaded: false,
      _mapLoaded: false,
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case "INSTRUMENTS_FETCH_FINISHED":
          return Object.assign({}, state, {
            _dataLoaded: true,
          });
        case "MAPS_INITIALIZED":
          if (payload.hasOwnProperty("instrumentMap")) {
            return Object.assign({}, state, {
              _mapLoaded: true,
            });
          } else {
            return state;
          }
        case "INSTRUMENTMAP_INITIALIZE_START":
          return Object.assign({}, state, payload);
        default:
          return state;
      }
    };
  },
  doInstrumentMapInitialize: () => ({ dispatch, store }) => {
    dispatch({
      type: "INSTRUMENTMAP_INITIALIZE_START",
      payload: {
        _dataLoaded: false,
        _mapLoaded: false,
      },
    });
    const geoProjection = store.selectMapGeoProjection();
    const webProjection = store.selectMapWebProjection();
    const map = store.selectMapsObject()["instrumentMap"];
    const lyr = new Layer({
      source: new Source(),
      declutter: true,
      style: (f, r) => {
        return new Style({
          geometry: new Circle(f.getGeometry().getCoordinates(), 5 * r),
          fill: new Fill({
            color: "#000000",
          }),
          stroke: new Stroke({
            color: "#ffffff",
            width: 1,
          }),
          text: new Text({
            fill: new Fill({
              color: "#000000",
            }),
            font: "18px blackops",
            offsetX: 12,
            offsetY: -12,
            padding: [2, 2, 2, 2],
            stroke: new Stroke({
              color: "#ffffff",
              width: 2,
            }),
            text: f.get("name"),
            textAlign: "left",
          }),
        });
      },
    });

    const src = lyr.getSource();
    const data = store.selectInstrumentsByRouteGeoJSON();

    src.addFeatures(
      geoJSON.readFeatures(data, {
        featureProjection: webProjection,
        dataProjection: geoProjection,
      })
    );

    map.addLayer(lyr);
    const view = map.getView();
    view.fit(src.getExtent(), {
      padding: [50, 50, 50, 50],
      maxZoom: 16,
    });
  },
  reactInstrumentMapShouldInitialize: (state) => {
    if (state.instrumentMap._dataLoaded && state.instrumentMap._mapLoaded)
      return { actionCreator: "doInstrumentMapInitialize" };
  },
};
