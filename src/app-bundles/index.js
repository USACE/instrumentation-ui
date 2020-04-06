import {
  composeBundles,
  createCacheBundle,
  createUrlBundle
} from "redux-bundler";
import {
  createJwtApiBundle,
  createNestedUrlBundle,
  createOlBasemapBundle,
  createOlMapBundle,
  createAuthBundle
} from "@corpsmap/corpsmap-bundles";
import cache from "../cache";
import pkg from "../../package.json";

import routesBundle from "./routes-bundle";
import uploadBundle from "./upload-bundle";
import instrumentBundle from "./instrument-bundle";
import mapInteractionBundle from "./map-interaction-bundle";

export default composeBundles(
  createAuthBundle({
    appId: "25653bf0-d1c0-4e1c-8cb7-9380c0a83f89",
    redirectOnLogout: "/"
  }),
  createJwtApiBundle({
    root: `http://localhost:3030`
  }),
  createCacheBundle({
    cacheFn: cache.set
  }),
  createUrlBundle(),
  createNestedUrlBundle({
    pkg: pkg
  }),
  createOlBasemapBundle(),
  createOlMapBundle({
    center: [-80.79, 26.94],
    zoom: 10
  }),
  routesBundle,
  uploadBundle,
  instrumentBundle,
  mapInteractionBundle
);
