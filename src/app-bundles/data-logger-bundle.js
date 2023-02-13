// import { createSelector } from 'redux-bundler';

export default {
  name: 'dataLoggers',
  getReducer: () => {
    const initialState = {
      dataLoggerDetails: {},
      dataLoggerPreview: {},
      projectDataLoggers: [],
      apiKey: '',
    };
    
    return (state = initialState, { type, payload }) => {
      switch (type) {
        case 'UPDATE_DATA_LOGGER_DETAILS':
          return {
            ...state,
            dataLoggerDetails: payload,
          };
        case 'UPDATE_PROJECT_DATA_PREVIEW':
          return {
            ...state,
            dataLoggerPreview: payload,
          };
        case 'UPDATE_PROJECT_DATA_LOGGERS':
          return {
            ...state,
            projectDataLoggers: payload,
          };
        case 'UPDATE_API_KEY':
          return {
            ...state,
            apiKey: payload,
          };
        default:
          return state;
      }
    };
  },

  selectDataLoggersRaw: state => state.dataLoggers,
  selectDataLoggerDetails: state => state.dataLoggers.dataLoggerDetails,
  selectDataLoggerPreview: state => state.dataLoggers.dataLoggerPreview,
  selectProjectDataLoggers: state => state.dataLoggers.projectDataLoggers,
  selectDataLoggerAPIKey: state => state.dataLoggers.apiKey,

  doFetchDataLoggersByProjectId: () => ({ dispatch, store, apiGet }) => {
    const projectId = store.selectProjectsIdByRoute()?.projectId;
    const uri = `/dataloggers?project_id=${projectId}`;

    apiGet(uri, (err, body) => {
      if (err) {
        console.log('todo', err);
      } else {
        dispatch({
          type: 'UPDATE_PROJECT_DATA_LOGGERS',
          payload: body,
        });
      }
    });
  },

  doFetchDataLoggerById: ({ dataLoggerId }) => ({ dispatch, store, apiGet }) => {
    const uri = `/datalogger/${dataLoggerId}`;

    apiGet(uri, (err, body) => {
      if (err) {
        console.log('todo', err);
      } else {
        dispatch({
          type: 'UPDATE_DATA_LOGGER_DETAILS',
          payload: body,
        });
      }
    });
  },

  doFetchDataLoggerPreview: ({ dataLoggerId }) => ({ dispatch, store, apiGet }) => {
    const uri = `/datalogger/${dataLoggerId}/preview`;

    apiGet(uri, (err, body) => {
      if (err) {
        console.log('todo', err);
      } else {
        dispatch({
          type: 'UPDATE_DATA_LOGGER_DETAILS',
          payload: body,
        });
      }
    });
  },

  doCreateNewDataLogger: (data) => ({ dispatch, store, apiPost }) => {
    const projectId = store.selectProjectsIdByRoute()?.projectId;
    const uri = '/datalogger';
    const body = {
      ...data,
      project_id: projectId,
    };

    apiPost(uri, body, (err, body) => {
      if (err) {
        console.log('todo', err);
      } else {
        store.doFetchDataLoggersByProjectId();

        dispatch({
          type: 'UPDATE_API_KEY',
          payload: body?.key,
        });
      }
    });
  },

  doUpdateNewDataLogger: (data) => ({ dispatch, store, apiPut }) => {
    const { dataLoggerId, name } = data;

    const uri = `/datalogger/${dataLoggerId}`;
    const body = {
      id: dataLoggerId,
      name,
    };

    apiPut(uri, body, (err, body) => {
      if (err) {
        console.log('todo', err);
      } else {
        store.doFetchDataLoggersByProjectId();
      }
    });
  },

  doCycleDataLoggerKey: ({ dataLoggerId }) => ({ dispatch, store, apiPut }) => {
    const uri = `/datalogger/${dataLoggerId}/key`;
  },

  doClearDataLoggerKey: () => ({ dispatch }) => {
    dispatch({ type: 'UPDATE_API_KEY', payload: '' });
  },

  doDeleteDataLogger: ({ dataLoggerId }) => ({ dispatch, store, apiDelete }) => {
    const uri = `/datalogger/${dataLoggerId}`;
  },
};
