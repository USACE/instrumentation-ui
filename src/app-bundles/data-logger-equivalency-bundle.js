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

  doCreateDataLoggerEquivalency: (data) => ({ dispatch, store, apiPost }) => {
    const uri = `/datalogger/${data.dataLoggerId}/equivalency_table`;
    const body = {
      ...data,
    };

    apiPost(uri, body, (err, body) => {
      if (err) {
        console.log('todo', err);
      } else {
        store.doFetchDataLoggerEquivalency();
      }
    });
  },

  doUpdateDataLoggerEquivalency: (data) => ({ dispatch, store, apiPut }) => {
    const uri = `/datalogger/${data.dataLoggerId}/equivalency_table`;
    const body = {
      ...data,
    };

    apiPut(uri, body, (err, body) => {
      if (err) {
        console.log('todo', err);
      } else {
        store.doFetchDataLoggerEquivalency();
      }
    });
  },

  doDeleteDataLoggerEquivalency: ({ dataLoggerId }) => ({ dispatch, store, apiDelete }) => {
    const uri = `/datalogger/${dataLoggerId}/equivalency_table`;
  },

  doDeleteDataLoggerEquivalencyRow: ({ dataLoggerId }) => ({ dispatch, store, apiDelete }) => {
    const uri = `/datalogger/${dataLoggerId}/equivalency_table/row`;
  },
};
