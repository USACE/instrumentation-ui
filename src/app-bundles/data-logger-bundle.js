import CopyApiKeyModal from '../app-pages/project/data-loggers/modals/copyApiKeyModal';

export default {
  name: 'dataLoggers',
  getReducer: () => {
    const initialState = {
      dataLoggerPreview: {},
      projectDataLoggers: [],
      apiKey: '',
    };
    
    return (state = initialState, { type, payload }) => {
      switch (type) {
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
        case 'UPDATE_DATA_LOGGER_API_KEY':
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
  selectDataLoggerPreview: state => state.dataLoggers.dataLoggerPreview,
  selectProjectDataLoggers: state => state.dataLoggers.projectDataLoggers,
  selectDataLoggerAPIKey: state => state.dataLoggers.apiKey,

  doFetchDataLoggersByProjectId: () => ({ dispatch, store, apiGet }) => {
    const projectId = store.selectProjectsIdByRoute()?.projectId;
    const uri = `/dataloggers?project_id=${projectId}`;

    apiGet(uri, (err, body) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log('todo', err);
      } else {
        dispatch({
          type: 'UPDATE_PROJECT_DATA_LOGGERS',
          payload: body,
        });
      }
    });
  },

  doFetchDataLoggerPreview: ({ dataLoggerId, tableId }) => ({ dispatch, apiGet }) => {
    const uri = `/datalogger/${dataLoggerId}/table/${tableId}/preview`;

    apiGet(uri, (err, body) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log('todo', err);
      } else {
        dispatch({
          type: 'UPDATE_PROJECT_DATA_PREVIEW',
          payload: body,
        });
      }
    });
  },

  doCreateNewDataLogger: (data) => ({ store, apiPost }) => {
    const projectId = store.selectProjectsIdByRoute()?.projectId;
    const uri = '/datalogger';
    const body = {
      ...data,
      project_id: projectId,
    };

    apiPost(uri, body, (err, body) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log('todo', err);
      } else {
        store.doFetchDataLoggersByProjectId();
        store.doModalOpen(CopyApiKeyModal, { apiKey: body?.key } );
      }
    });
  },

  doUpdateDataLogger: (data) => ({ store, apiPut }) => {
    const { dataLoggerId, name } = data;

    const uri = `/datalogger/${dataLoggerId}`;
    const body = {
      id: dataLoggerId,
      name,
    };

    apiPut(uri, body, (err, _body) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log('todo', err);
      } else {
        store.doFetchDataLoggersByProjectId();
      }
    });
  },

  doCycleDataLoggerKey: ({ dataLoggerId }) => ({ dispatch, apiPut }) => {
    const uri = `/datalogger/${dataLoggerId}/key`;

    apiPut(uri, {}, (err, body) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log('test err:', err);
      } else {
        dispatch({
          type: 'UPDATE_DATA_LOGGER_API_KEY',
          payload: body?.key,
        });
      }
    });
  },

  doClearDataLoggerKey: () => ({ dispatch }) => {
    dispatch({ type: 'UPDATE_DATA_LOGGER_API_KEY', payload: '' });
  },

  doDeleteDataLogger: ({ dataLoggerId }) => ({ store, apiDelete }) => {
    const uri = `/datalogger/${dataLoggerId}`;

    apiDelete(uri, (err, _body) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log('todo', err);
      } else {
        store.doFetchDataLoggersByProjectId();
      }
    });
  },
};
