import {
  composeBundles,
  createCacheBundle,
  createUrlBundle,
} from 'redux-bundler';
// Required change from @corpsmap/create-auth-bundle;
import createAuthBundle from './create-auth-bundle';
// Required change from @corpsmap/create-jwt-api-bundle;
import createJwtApiBundle from './create-jwt-api-bundle';
import createUrlBasePathBundle from './create-url-base-path-bundle';
import cache from '../common/helpers/cache';

import alertReadBundle from './alert-read-bundle';
import alertSubscribeBundle from './alert-subscribe-bundle';
import alertUnreadBundle from './alert-unread-bundle';
import alertUnsubscribeBundle from './alert-unsubscribe-bundle';
import batchPlotConfigurationsBundle from './batch-plot-configurations-bundle';
import batchPlotMapBundle from './batch-plot-map-bundle';
import chartEditorBundle from './chart-editor-bundle';
import chartsBundle from './charts-bundle';
import collectionGroupBundle from './collection-group-bundle';
import collectionGroupDetailBundle from './collection-group-detail-bundle';
import dataLoggerBundle from './data-logger-bundle';
import dataLoggerEquivalencyBundle from './data-logger-equivalency-bundle';
import districtRollupBundle from './district-rollup-bundle';
import districtsBundle from './districts-bundle';
import domainsBundle from './domains-bundle';
import exploreChartSyncBundle from './explore-chart-sync-bundle';
import exploreDataBundle from './explore-data-bundle';
import exploreMapBundle from './explore-map-bundle';
import exploreMapInteractionBundle from './explore-map-interaction-bundle';
import homeDataBundle from './home-data-bundle';
import inclinometerMeasurements from './inclinometer-measurements';
import instrumentAlertConfigsBundle from './instrument-alert-configs-bundle';
import instrumentAlertsBundle from './instrument-alerts-bundle';
import instrumentBundle from './instrument-bundle';
import instrumentConstantsBundle from './instrument-constants-bundle';
import instrumentDrawBundle from './instrument-draw-bundle';
import instrumentFormulasBundle from './instrument-formulas-bundle';
import instrumentGroupBundle from './instrument-group-bundle';
import instrumentGroupInstrumentsBundle from './instrument-group-instruments-bundle';
import instrumentGroupMapBundle from './instrument-group-map-bundle';
import instrumentMapBundle from './instrument-map-bundle';
import instrumentNotesBundle from './instrument-notes-bundle';
import instrumentSensorsBundle from './instrument-sensors-bundle';
import instrumentStatusBundle from './instrument-status-bundle';
import mapsBundle from './maps-bundle';
import modalBundle from './modal-bundle';
import notificationBundle from './notification-bundle';
import printBundle from './print-bundle';
import profileAlertsBundle from './profile-alerts-bundle';
import profileAlertSubscriptionsBundle from './profile-alert-subscriptions-bundle';
import profileBundle from './profile-bundle';
import projectAlertConfigs from './project-alert-configs';
import projectMembersBundle from './project-members-bundle';
import projectionBundle from './projection-bundle';
import projectsBundle from './projects-bundle';
import qualityControl from './quality-control';
import rainfallBundle from './rainfall-bundle';
import routesBundle from './routes-bundle';
import submittalsBundle from './submittals-bundle';
import timeseriesBundle from './time-series-bundle';
import timeseriesMeasurementBundle from './time-series-measurements-bundle';
import uploadBundle from './upload-bundle';
import usersBundle from './users-bundle';

// Mock Token User
// const mockTokenPublic =
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwIiwibmFtZSI6IlVzZXIuVGVzdCIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoyMDAwMDAwMDAwLCJyb2xlcyI6W119._N-sAWgMhYsWhwIf44_SGSMGSgnnM8tntlswsBqjYDo';
const mockTokenApplicationAdmin =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwibmFtZSI6IlVzZXIuQXBwbGljYXRpb25BZG1pbiIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoyMDAwMDAwMDAwLCJyb2xlcyI6W119.aKaDNBnuhQyXI6zvzn-dAg8SxJSP3mQEx5FTSmJbYog';
// const mockTokenProjectAdmin =
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwibmFtZSI6IlVzZXIuUHJvamVjdEFkbWluIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjIwMDAwMDAwMDAsInJvbGVzIjpbXX0.P2Cb6s3Kq0hHsfXEczFcUvpQuR8TTV88U4RDvcPabMM';
// const mockTokenProjectMember =
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0IiwibmFtZSI6IlVzZXIuUHJvamVjdE1lbWJlciIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoyMDAwMDAwMDAwLCJyb2xlcyI6W119.ujBvw9bCksuSbXGJreIpdXZcVIHtb8GhgviBTvrO9AQ';

const jwtPaths = [
  '/members',
  '/datalogger',
];

export default composeBundles(
  createAuthBundle({
    appId: '07f1223f-f208-4b71-aa43-5d5f27cd8ed9',
    redirectOnLogout: '/',
    mock: import.meta.env.DEV ? true : false,
    token: import.meta.env.DEV ? mockTokenApplicationAdmin : null,
  }),
  createJwtApiBundle({
    root:
      import.meta.env.DEV
        ? 'http://localhost:8080'
        : import.meta.env.VITE_API_URL,
    tokenSelector: 'selectAuthTokenRaw',
    unless: {
      // GET requests do not include token unless path starts with /my_ or includes any path in the jwtPaths array.
      // Need token to figure out who "me" is
      custom: ({ method, path }) => {
        if (method === 'GET') {
          if (path.slice(0, 4) === '/my_' || jwtPaths.some(el => path.includes(el))) {
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
  createUrlBasePathBundle({ base: import.meta.env.VITE_URL_BASE_PATH ?? '' }),
  alertReadBundle,
  alertSubscribeBundle,
  alertUnreadBundle,
  alertUnsubscribeBundle,
  batchPlotConfigurationsBundle,
  batchPlotMapBundle,
  chartEditorBundle,
  chartsBundle,
  collectionGroupBundle,
  collectionGroupDetailBundle,
  dataLoggerBundle,
  dataLoggerEquivalencyBundle,
  districtRollupBundle,
  districtsBundle,
  domainsBundle,
  exploreChartSyncBundle,
  exploreDataBundle,
  exploreMapBundle,
  exploreMapInteractionBundle,
  homeDataBundle,
  inclinometerMeasurements,
  instrumentAlertConfigsBundle,
  instrumentAlertsBundle,
  instrumentBundle,
  instrumentConstantsBundle,
  instrumentDrawBundle,
  instrumentFormulasBundle,
  instrumentGroupBundle,
  instrumentGroupMapBundle,
  instrumentGroupInstrumentsBundle,
  instrumentMapBundle,
  instrumentNotesBundle,
  instrumentSensorsBundle,
  instrumentStatusBundle,
  mapsBundle,
  modalBundle,
  notificationBundle,
  printBundle,
  profileAlertsBundle,
  profileAlertSubscriptionsBundle,
  profileBundle,
  projectAlertConfigs,
  projectMembersBundle,
  projectionBundle,
  projectsBundle,
  qualityControl,
  rainfallBundle,
  routesBundle,
  submittalsBundle,
  timeseriesBundle,
  timeseriesMeasurementBundle,
  uploadBundle,
  usersBundle,
);
