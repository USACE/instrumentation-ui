import createRestBundle from './create-rest-bundle';
import { createSelector } from 'redux-bundler';

export default createRestBundle({
  name: 'instrumentTimeseries',
  uid: 'id',
  staleAfter: 10000,
  persist: false,
  routeParam: '',
  getTemplate: '/projects/:projectId/timeseries',
  putTemplate: '/timeseries/:item.id',
  postTemplate: '/timeseries',
  deleteTemplate: '/timeseries/:item.id',
  fetchActions: [],
  forceFetchActions: [
    'INSTRUMENTS_FETCH_FINISHED',
    'INSTRUMENTGROUPS_FETCH_FINISHED',
    'INSTRUMENTCONSTANTS_SAVE_FINISHED',
    'INSTRUMENTTIMESERIES_SAVE_FINISHED',
  ],
  urlParamSelectors: ['selectProjectsIdByRoute'],
  reduceFurther: (state, { type, payload }) => {
    if (type === 'INSTRUMENTTIMESERIES_SET_ACTIVE_ID') {
      return Object.assign({}, state, payload);
    } else {
      return state;
    }
  },
  addons: {
    doInstrumentTimeseriesSetActiveId: (id) => ({ dispatch }) => {
      dispatch({
        type: 'INSTRUMENTTIMESERIES_SET_ACTIVE_ID',
        payload: {
          _activeId: id,
        },
      });
    },

    selectInstrumentTimeseriesActiveId: (state) => state.instrumentTimeseries._activeId,

    selectInstrumentTimeseriesActiveIdParam: createSelector(
      'selectInstrumentTimeseriesActiveId',
      (id) => {
        if (!id) return null;
        return { timeseriesId: id };
      }
    ),
    selectInstrumentTimeseriesByInstrumentId: createSelector(
      'selectInstrumentTimeseriesItems',
      (timeseries) => {
        if (!timeseries || !timeseries.length) return {};
        const out = {};
        timeseries.forEach((ts) => {
          if (!out.hasOwnProperty(ts.instrument_id)) out[ts.instrument_id] = [];
          out[ts.instrument_id].push(ts);
        });
        return out;
      }
    ),
    selectNonComputedTimeseriesByInstrumentId: createSelector(
      'selectInstrumentTimeseriesByInstrumentId',
      (timeseries) => {
        if (!timeseries) return {};
        const clone = Object.assign({}, timeseries);

        Object.keys(timeseries).forEach(key => {
          clone[key] = clone[key].filter(ts => !ts.is_computed);
        });

        return clone;
      }
    ),
    selectInstrumentTimeseriesByProjectId: createSelector(
      'selectInstrumentTimeseriesItems',
      (timeseries) => {
        if (!timeseries || !timeseries.length) return {};
        const out = {};
        timeseries.forEach((ts) => {
          if (!out.hasOwnProperty(ts.project_id)) out[ts.project_id] = [];
          out[ts.project_id].push(ts);
        });
        return out;
      }
    ),
    selectInstrumentTimeseriesItemsByRoute: createSelector(
      'selectInstrumentsByRoute',
      'selectProjectsByRoute',
      'selectInstrumentTimeseriesByInstrumentId',
      'selectInstrumentTimeseriesByProjectId',
      (
        instrument,
        project,
        timeseriesByInstrumentId,
        timeseriesByProjectId
      ) => {
        // If on an instrument-specific page
        if (
          instrument &&
          instrument.id &&
          timeseriesByInstrumentId.hasOwnProperty(instrument.id)
        ) {
          return timeseriesByInstrumentId[instrument.id];
        } // If on a project page
        else if (
          project &&
          project.id &&
          timeseriesByProjectId.hasOwnProperty(project.id)
        ) {
          return timeseriesByProjectId[project.id];
        } else {
          return [];
        }
      }
    ),
    selectNonComputedTimeseriesItemsByRoute: createSelector(
      'selectInstrumentTimeseriesItemsByRoute',
      (timeseries) => {
        if (!timeseries) return [];

        const out = timeseries.filter(ts => !ts.is_computed);
        return out;
      },
    ),
  },
});
