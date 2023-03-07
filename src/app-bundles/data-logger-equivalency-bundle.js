// import { createSelector } from 'redux-bundler';

export default {
  name: 'dataLoggerEquivalency',
  getReducer: () => {
    const initialState = {
      table: {},
    };
    
    return (state = initialState, { type, payload }) => {
      switch (type) {
        case 'UPDATE_DATA_LOGGER_EQUIVALENCY_TABLE':
          return {
            ...state,
            table: payload,
          };
        default:
          return state;
      }
    };
  },

  selectDataLoggerEquivalencyRaw: state => state.dataLoggerEquivalency,
  selectDataLoggerEquivalencyTable: state => state.dataLoggerEquivalency.table,

  doFetchDataLoggerEquivalency: ({ dataLoggerId }) => ({ dispatch, store, apiGet }) => {
    const uri = `/datalogger/${dataLoggerId}/equivalency_table`;

    apiGet(uri, (err, body) => {
      if (err) {
        console.log('todo', err);
      } else {
        dispatch({
          type: 'UPDATE_DATA_LOGGER_EQUIVALENCY_TABLE',
          payload: body,
        });
      }
    });
  },

  doCreateDataLoggerEquivalency: ({ dataLoggerId, newRows = [], unusedRows = [], isDeleteChecked = false }) => ({ dispatch, store, apiPost }) => {
    const uri = `/datalogger/${dataLoggerId}/equivalency_table`;

    if (isDeleteChecked) {
      // TODO: delete old Rows
      console.log('test delete unusedRows: ', unusedRows);
    }
    
    const payload = {
      datalogger_id: dataLoggerId,
      rows: newRows.map(row => ({
        field_name: row,
        display_name: row,
      })),
    };

    apiPost(uri, payload, (err, body) => {
      if (err) {
        console.log('todo', err);
      } else {
        store.doFetchDataLoggerEquivalency({ dataLoggerId });
      }
    });
  },

  doUpdateDataLoggerEquivalency: (data) => ({ dispatch, store, apiPut }) => {
    const { dataLoggerId, id, fieldName, displayName, instrumentId, timeseriesId } = data;
    const uri = `/datalogger/${dataLoggerId}/equivalency_table`;

    const payload = {
      datalogger_id: dataLoggerId,
      rows: [
        {
          id,
          field_name: fieldName,
          display_name: displayName,
          instrument_id: instrumentId,
          timeseries_id: timeseriesId,
        },
      ],
    };

    apiPut(uri, payload, (err, body) => {
      if (err) {
        console.log('todo', err);
      } else {
        store.doFetchDataLoggerEquivalency({ dataLoggerId });
      }
    });
  },

  doDeleteDataLoggerEquivalency: ({ dataLoggerId }) => ({ dispatch, store, apiDelete }) => {
    const uri = `/datalogger/${dataLoggerId}/equivalency_table`;
  },

  doDeleteDataLoggerEquivalencyRow: ({ dataLoggerId, id }) => ({ dispatch, store, apiDelete }) => {
    const uri = `/datalogger/${dataLoggerId}/equivalency_table/row?id=${id}`;

    apiDelete(uri, (err, body) => {
      if (err) {
        console.log('todo', err);
      } else {
        store.doFetchDataLoggerEquivalency({ dataLoggerId });
      }
    });
  },
};
