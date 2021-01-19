import {
  composeBundles,
  createCacheBundle,
  createUrlBundle,
} from "redux-bundler";
import { createNestedUrlBundle } from "@corpsmap/corpsmap-bundles";
// Required change from @corpsmap/create-auth-bundle;
import createAuthBundle from "./create-auth-bundle";
// Required change from @corpsmap/create-jwt-api-bundle;
import createJwtApiBundle from "./create-jwt-api-bundle";
import cache from "../cache";
import pkg from "../../package.json";

import chartEditorBundle from "./chart-editor-bundle";
import chartsBundle from "./charts-bundle";
import collectionGroupBundle from "./collection-group-bundle";
import collectionGroupDetailBundle from "./collection-group-detail-bundle";
import domainsBundle from "./domains-bundle";
import exploreChartSyncBundle from "./explore-chart-sync-bundle";
import exploreDataBundle from "./explore-data-bundle";
import exploreMapBundle from "./explore-map-bundle";
import exploreMapInteractionBundle from "./explore-map-interaction-bundle";
import homeDataBundle from "./home-data-bundle";
import instrumentBundle from "./instrument-bundle";
import instrumentAlertsBundle from "./instrument-alerts-bundle";
import instrumentMapBundle from "./instrument-map-bundle";
import instrumentDrawBundle from "./instrument-draw-bundle";
import instrumentGroupBundle from "./instrument-group-bundle";
import instrumentGroupMapBundle from "./instrument-group-map-bundle";
import instrumentGroupInstrumentsBundle from "./instrument-group-instruments-bundle";
import instrumentNotesBundle from "./instrument-notes-bundle";
import instrumentStatusBundle from "./instrument-status-bundle";
import instrumentConstantsBundle from "./instrument-constants-bundle";
import mapsBundle from "./maps-bundle";
import modalBundle from "./modal-bundle";
import nestedUrlBundle from "./nested-url-bundle";
import notificationBundle from "./notification-bundle";
import profileAlertsBundle from "./profile-alerts-bundle";
import profileBundle from "./profile-bundle";
import projectionBundle from "./projection-bundle";
import projectsBundle from "./projects-bundle";
import rainfallBundle from "./rainfall-bundle";
import routesBundle from "./routes-bundle";
import timeseriesBundle from "./time-series-bundle";
import timeseriesMeasurementBundle from "./time-series-measurements-bundle";
import uploadBundle from "./upload-bundle";
import alertReadBundle from "./alert-read-bundle";
import alertUnreadBundle from "./alert-unread-bundle";
import profileAlertSubscriptionsBundle from "./profile-alert-subscriptions-bundle";
import alertSubscribeBundle from "./alert-subscribe-bundle";
import alertUnsubscribeBundle from "./alert-unsubscribe-bundle";
import instrumentAlertConfigsBundle from "./instrument-alert-configs-bundle";

// Mock Token User
const mockTokenUser =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwIiwibmFtZSI6IlVzZXIuVGVzdCIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoyMDAwMDAwMDAwLCJyb2xlcyI6WyJQVUJMSUMuVVNFUiIsIkJMVUUtV0FURVItREFNLUVYQU1QTEUtUFJPSkVDVC5NRU1CRVIiXX0.q_WcqtU48QoWaBLlTiIJ5JRbfiNbb7iJY1z8_u_AS24";

export default composeBundles(
  createAuthBundle({
    appId: "07f1223f-f208-4b71-aa43-5d5f27cd8ed9",
    redirectOnLogout: pkg.homepage,
    mock: process.env.NODE_ENV === "development" ? true : false,
    token: process.env.NODE_ENV === "development" ? mockTokenUser : null,
  }),
  createJwtApiBundle({
    root:
      process.env.NODE_ENV === "development"
        ? `http://localhost:80/instrumentation`
        : `https://api2.rsgis.dev/instrumentation`,
    tokenSelector: "selectAuthTokenRaw",
    unless: {
      // GET requests do not include token unless path starts with /my_
      // Need token to figure out who "me" is
      custom: ({ method, path }) => {
        if (method === "GET") {
          if (path.slice(0, 4) === "/my_") {
            return false;
          }
          return true;
        }
        return false;
      },
    },
  }),
  createCacheBundle({
    cacheFn: cache.set,
  }),
  createUrlBundle(),
  createNestedUrlBundle({
    pkg: pkg,
  }),
  alertReadBundle,
  alertSubscribeBundle,
  alertUnreadBundle,
  alertUnsubscribeBundle,
  chartEditorBundle,
  chartsBundle,
  collectionGroupBundle,
  collectionGroupDetailBundle,
  domainsBundle,
  exploreChartSyncBundle,
  exploreDataBundle,
  exploreMapBundle,
  exploreMapInteractionBundle,
  homeDataBundle,
  instrumentBundle,
  instrumentAlertConfigsBundle,
  instrumentAlertsBundle,
  instrumentMapBundle,
  instrumentDrawBundle,
  instrumentGroupBundle,
  instrumentGroupMapBundle,
  instrumentGroupInstrumentsBundle,
  instrumentNotesBundle,
  instrumentStatusBundle,
  instrumentConstantsBundle,
  mapsBundle,
  modalBundle,
  nestedUrlBundle,
  notificationBundle,
  profileAlertsBundle,
  profileAlertSubscriptionsBundle,
  profileBundle,
  projectsBundle,
  projectionBundle,
  rainfallBundle,
  routesBundle,
  timeseriesBundle,
  timeseriesMeasurementBundle,
  uploadBundle
);
