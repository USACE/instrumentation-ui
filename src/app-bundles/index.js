import {
  composeBundles,
  createCacheBundle,
  createUrlBundle
} from "redux-bundler";
import {
  createNestedUrlBundle,
  createOlBasemapBundle,
  createOlMapBundle
} from "@corpsmap/corpsmap-bundles";
import cache from "../cache";
import pkg from "../../package.json";

import routesBundle from "./routes-bundle";

export default composeBundles(
  createCacheBundle({
    cacheFn: cache.set
  }),
  createUrlBundle(),
  createNestedUrlBundle({
    pkg: pkg
  }),
  createOlBasemapBundle(),
  createOlMapBundle(),
  routesBundle
);
