import {
  composeBundles,
  createCacheBundle,
  createUrlBundle,
} from "redux-bundler";
import {
  createNestedUrlBundle,
  createOlMapBundle,
} from "@corpsmap/corpsmap-bundles";
import createAuthBundle from "@corpsmap/create-auth-bundle";
import createJwtApiBundle from "@corpsmap/create-jwt-api-bundle";
import cache from "../cache";
import pkg from "../../package.json";

import chartBundle from "./chart-bundle";
import domainsBundle from "./domains-bundle";
import routesBundle from "./routes-bundle";
import uploadBundle from "./upload-bundle";
import instrumentBundle from "./instrument-bundle";
import instrumentMapBundle from "./instrument-map-bundle";
import instrumentDrawBundle from "./instrument-draw-bundle";
import instrumentGroupBundle from "./instrument-group-bundle";
import instrumentGroupMapBundle from "./instrument-group-map-bundle";
import instrumentGroupInstrumentsBundle from "./instrument-group-instruments-bundle";
import instrumentNotesBundle from "./instrument-notes-bundle";
import instrumentStatusBundle from "./instrument-status-bundle";
import instrumentZBundle from "./instrument-z-bundle";
import keyvalBundle from "./key-value-bundle";
import mapsBundle from "./maps-bundle";
import mapInteractionBundle from "./map-interaction-bundle";
// import timeSeriesBundle from "./time-series-bundle";
import modalBundle from "./modal-bundle";
import nestedUrlBundle from "./nested-url-bundle";
import projectionBundle from "./projection-bundle";
import projectsBundle from "./projects-bundle";
import timeseriesBundle from "./time-series-bundle";
import timeseriesMeasurementBundle from "./time-series-measurements-bundle";

export default composeBundles(
  createAuthBundle({
    appId: "07f1223f-f208-4b71-aa43-5d5f27cd8ed9",
    redirectOnLogout: pkg.homepage,
  }),
  createJwtApiBundle({
    root:
      process.env.NODE_ENV === "development"
        ? `http://localhost:3030/instrumentation`
        : `https://api.rsgis.dev/development/instrumentation`,
    unless: {
      method: "GET",
    },
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
  chartBundle,
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
  instrumentNotesBundle,
  instrumentStatusBundle,
  instrumentZBundle,
  keyvalBundle,
  mapsBundle,
  mapInteractionBundle,
  modalBundle,
  nestedUrlBundle,
  projectsBundle,
  projectionBundle,
  timeseriesBundle,
  timeseriesMeasurementBundle
);
