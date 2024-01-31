import { createSelector } from 'redux-bundler';

import createRestBundle from './create-rest-bundle';
import { tLoading, tUpdateError, tUpdateManual } from '../common/helpers/toast-helpers';

export default createRestBundle({
  name: 'instrumentTimeseries',
  uid: 'id',
  staleAfter: 10000,
  persist: false,
  routeParam: '',
  getTemplate: '/projects/:projectId/timeseries',
  putTemplate: '/timeseries/{:item.id}',
  postTemplate: '/timeseries',
  deleteTemplate: '/timeseries/{:item.id}',
  fetchActions: [],
  forceFetchActions: [
    'INSTRUMENTS_FETCH_FINISHED',
    'INSTRUMENTGROUPS_FETCH_FINISHED',
    'INSTRUMENTCONSTANTS_SAVE_FINISHED',
    'INSTRUMENTTIMESERIES_SAVE_FINISHED',
    'CREATED_NEW_TIMESERIES_FOR_FIELD_NAMES',
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
    doSaveFieldNamesToTimeseries: (newObject, instrumentId, dataLoggerId, tableId) => ({ dispatch, store, apiPost }) => {
      dispatch({ type: 'ASSIGN_FIELD_NAMES_TO_TIMESERIES_START' });
      const toastId = tLoading('Creating new timeseries...');
      const { newTs, existingTs } = newObject;

      const uri = '/timeseries';
      const formData = [];

      newTs.forEach(item => formData.push({
        instrument_id: instrumentId,
        name: item?.field_name,
      }));

      apiPost(uri, formData, (err, body) => {
        if (err) {
          tUpdateError(toastId, 'Failed to create new timeseries. Please try again later.');
          // eslint-disable-next-line no-console
          console.error(err);
        } else {
          dispatch({ type: 'CREATED_NEW_TIMESERIES_FOR_FIELD_NAMES' });
          tUpdateManual(toastId, 'Assigning timeseries to field names...', { isLoading: true });
          const rows = [];

          rows.push(...newTs.map(el => ({
            ...el,
            instrument_id: instrumentId,
            timeseries_id: body.find(item => item.name === el.field_name)?.id,
          })));

          rows.push(...existingTs.map(el => {
            const { field, timeseries } = el;

            return {
              ...field,
              instrument_id: instrumentId,
              timeseries_id: timeseries?.id,
            };
          }));

          store.doUpdateMultipleDataLoggerEquivalency(dataLoggerId, tableId, rows, toastId);
        }
      });

      dispatch({ type: 'ASSIGN_FIELD_NAMES_TO_TIMESERIES_FINISHED' });
    },

    doInstrumentTimeseriesSetActiveId: (id) => ({ dispatch }) => {
      dispatch({
        type: 'INSTRUMENTTIMESERIES_SET_ACTIVE_ID',
        payload: {
          _activeId: id,
        },
      });
    },

    selectInstrumentTimeseriesActiveId: (state) =>
      state.instrumentTimeseries._activeId,

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
          if (!Object.prototype.hasOwnProperty.call(out, ts.instrument_id)) out[ts.instrument_id] = [];
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

        Object.keys(timeseries).forEach((key) => {
          clone[key] = clone[key].filter((ts) => !ts.is_computed);
        });

        return clone;
      }
    ),
    
    selectInstrumentTimeseriesItemsByRoute: createSelector(
      'selectInstrumentsByRoute',
      'selectInstrumentTimeseriesByInstrumentId',
      (
        instrument,
        timeseriesByInstrumentId,
      ) => {
        // If on an instrument-specific page
        if (
          instrument &&
          instrument.id &&
          Object.prototype.hasOwnProperty.call(timeseriesByInstrumentId, instrument.id)
        ) {
          return timeseriesByInstrumentId[instrument.id];
        } else {
          return [];
        }
      }
    ),
    selectNonComputedTimeseriesItemsByRoute: createSelector(
      'selectInstrumentTimeseriesItemsByRoute',
      (timeseries) => {
        if (!timeseries) return [];

        const out = timeseries.filter((ts) => !ts.is_computed);
        return out;
      }
    ),
  },
});
