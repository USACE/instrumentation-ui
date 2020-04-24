import {
  composeBundles,
  createCacheBundle,
  createUrlBundle,
} from "redux-bundler";
import {
  createJwtApiBundle,
  createNestedUrlBundle,
  createOlMapBundle,
  createAuthBundle,
} from "@corpsmap/corpsmap-bundles";
import cache from "../cache";
import pkg from "../../package.json";

import domainsBundle from "./domains-bundle";
import routesBundle from "./routes-bundle";
import uploadBundle from "./upload-bundle";
import instrumentBundle from "./instrument-bundle";
import instrumentMapBundle from "./instrument-map-bundle";
import instrumentDrawBundle from "./instrument-draw-bundle";
import instrumentGroupBundle from "./instrument-group-bundle";
import instrumentGroupMapBundle from "./instrument-group-map-bundle";
import instrumentGroupInstrumentsBundle from "./instrument-group-instruments-bundle";
import mapsBundle from "./maps-bundle";
import mapInteractionBundle from "./map-interaction-bundle";
// import timeSeriesBundle from "./time-series-bundle";
import modalBundle from "./modal-bundle";
import nestedUrlBundle from "./nested-url-bundle";
import projectionBundle from "./projection-bundle";

export default composeBundles(
  createAuthBundle({
    appId: "25653bf0-d1c0-4e1c-8cb7-9380c0a83f89",
    redirectOnLogout: "/",
  }),
  createJwtApiBundle({
    root: process.env.NODE_ENV === "development" ? `http://localhost:3030` : ``,
  }),
  createCacheBundle({
    cacheFn: cache.set,
  }),
  createUrlBundle(),
  createNestedUrlBundle({
    pkg: pkg,
  }),
  createOlMapBundle({
    name: "map",
    center: [-80.79, 26.94],
    zoom: 10,
  }),
  createOlMapBundle({
    name: "groupMap",
  }),
  domainsBundle,
  routesBundle,
  uploadBundle,
  instrumentBundle,
  mapInteractionBundle,
  // timeSeriesBundle,
  instrumentMapBundle,
  instrumentDrawBundle,
  instrumentGroupBundle,
  instrumentGroupMapBundle,
  instrumentGroupInstrumentsBundle,
  mapsBundle,
  mapInteractionBundle,
  modalBundle,
  nestedUrlBundle,
  projectionBundle
);
