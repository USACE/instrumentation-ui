import { tUpdateError, tUpdateSuccess } from "../common/helpers/toast-helpers";

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

  doFetchDataLoggerEquivalency: ({ dataLoggerId, tableId }) => ({ dispatch, apiGet }) => {
    const uri = `/datalogger/${dataLoggerId}/tables/${tableId}/equivalency_table`;

    apiGet(uri, (err, body) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log('todo', err);
      } else {
        dispatch({
          type: 'UPDATE_DATA_LOGGER_EQUIVALENCY_TABLE',
          payload: body,
        });
      }
    });
  },

  doCreateEquivalencyByTableName: ({ dataLoggerId, tableName, newRows }) => ({ store, apiPost }) => {
    const uri = `/datalogger/${dataLoggerId}/equivalency_table`;

    const payload = {
      datalogger_id: dataLoggerId,
      datalogger_table_name: tableName,
      rows: newRows.map(row => ({
        field_name: row,
        display_name: row,
      })),
    };

    apiPost(uri, payload, (err, _body) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log('todo', err);
      } else {
        store.doFetchDataLoggersByProjectId();
      }
    });
  },

  doAutoMapDataLoggerEquivalency: ({ dataLoggerId, tableId, tableName, newRows = [], unusedRows = [], isDeleteChecked = false }) => ({ store, apiPut }) => {
    const uri = `/datalogger/${dataLoggerId}/tables/${tableId}/equivalency_table`;

    if (isDeleteChecked) {
      unusedRows.forEach(el => {
        const { id } = el;
        store.doDeleteDataLoggerEquivalencyRow({ dataLoggerId, id, refreshData: false });
      });
    }
    
    const payload = {
      datalogger_id: dataLoggerId,
      datalogger_table_id: tableId,
      datalogger_table_name: tableName,
      rows: newRows.map(row => ({
        field_name: row,
        display_name: row,
      })),
    };

    apiPut(uri, payload, (err, _body) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log('todo', err);
      } else {
        store.doFetchDataLoggerEquivalency({ dataLoggerId, tableId });
      }
    });
  },

  doUpdateSingleDataLoggerEquivalency: (data) => ({ store, apiPut }) => {
    const { dataLoggerId, tableId, id, fieldName, displayName, instrumentId, timeseriesId } = data;
    const uri = `/datalogger/${dataLoggerId}/tables/${tableId}/equivalency_table`;
    // const toastId = toast.loading('Updating Field Mapping...');

    const payload = {
      datalogger_id: dataLoggerId,
      datalogger_table_id: tableId,
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

    apiPut(uri, payload, (err, _body) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log('test err: ', JSON.stringify(err));
        // tUpdateError(toastId, 'Failed');
      } else {
        store.doFetchDataLoggerEquivalency({ dataLoggerId, tableId });
        // tUpdateSuccess(toastId, 'Successfully updated Field Mapping!');
      }
    });
  },

  // For use in auto-assigning only.
  doUpdateMultipleDataLoggerEquivalency: (dataLoggerId, tableId, rows, toastId) => ({ store, apiPut }) => {
    const uri = `/datalogger/${dataLoggerId}/tables/${tableId}/equivalency_table`;

    const payload = {
      datalogger_id: dataLoggerId,
      datalogger_table_id: tableId,
      rows,
    };

    apiPut(uri, payload, (err, _body) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log('test err: ', JSON.stringify(err));
        tUpdateError(toastId, 'Failed to assign timeseries to field names. Please try again later.');
      } else {
        tUpdateSuccess(toastId, 'Successfully assigned timeseries to field names!');
        store.doFetchDataLoggerEquivalency({ dataLoggerId, tableId });
      }
    });
  },

  doDeleteDataLoggerEquivalencyRow: ({ dataLoggerId, tableId, id, refreshData = true }) => ({ store, apiDelete }) => {
    const uri = `/datalogger/${dataLoggerId}/tables/${tableId}/equivalency_table/row/${id}`;

    apiDelete(uri, (err, _body) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log('todo', err);
      } else {
        if (refreshData) {
          store.doFetchDataLoggerEquivalency({ dataLoggerId, tableId });
        }
      }
    });
  },
};
