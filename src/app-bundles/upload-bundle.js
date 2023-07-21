import { createSelector } from 'redux-bundler';
import { readString } from 'react-papaparse';

import inclinometerMeasurements from '../upload-parsers/inclinometer_measurements';
import instrumentParser from '../upload-parsers/instrument';
import timeseriesParser from '../upload-parsers/timeseries';
import timeseriesMeasurementsParser from '../upload-parsers/timeseries_measurements';
import { formatBytes } from '../common/helpers/utils';

const cellStyle = (params, key) => {
  const style = {};

  if (params.data.ignore) {
    style.color = 'grey';
    style.opacity = 0.5;
  }

  if (params.data.errors && params.data.errors.indexOf(key) !== -1) {
    style.color = '#d22a0e';
    style.backgroundColor = '#feeeec';
    style.borderColor = '#ea2f10';
  }

  return style;
};

const toa5JsonMap = json => {
  json.splice(0, 1);
  json.splice(1, 2);

  return json;
};

const uploadBundle = {
  name: 'upload',

  getReducer: () => {
    const initialData = {
      csv: null,
      json: null,
      ignoreRows: '',
      parsers: [
        inclinometerMeasurements,
        instrumentParser,
        timeseriesParser,
        timeseriesMeasurementsParser,
      ],
      selectedParser: null,
      fieldMap: null,
      _errors: [],
      _isParsing: false,
      _shouldParseCsv: false,
      _isUploading: false,
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case 'UPLOAD_CLEAR':
        case 'UPLOAD_SETTINGS_CLEAR':
        case 'UPLOAD_QUEUE_CSV':
        case 'UPLOAD_PARSE_CSV_START':
        case 'UPLOAD_PARSE_CSV_FINISH':
        case 'UPLOAD_SET_IGNORE_ROWS':
        case 'UPLOAD_SET_PARSER':
        case 'UPLOAD_POST_START':
        case 'UPLOAD_POST_HAS_ERRORS':
        case 'UPLOAD_SET_FIELD_MAP':
        case 'UPLOAD_SET_JSON':
          return Object.assign({}, state, payload);
        case 'UPLOAD_POST_FINISH':
          return Object.assign({}, initialData);
        default:
          return state;
      }
    };
  },

  doUploadQueueCsv: (csv, isDirty) => ({ dispatch }) => {
    dispatch({
      type: 'UPLOAD_QUEUE_CSV',
      payload: {
        csv: csv,
        ignoreRows: '',
        _shouldParseCsv: true,
        ...isDirty && {
          selectedParser: null,
          fieldMap: null,
          _errors: [],
        }
      },
    });
  },

  doUploadParseCsv: (hasHeaderRow = true, onComplete = () => {}) => async ({ dispatch, store }) => {
    dispatch({
      type: 'UPLOAD_PARSE_CSV_START',
      payload: {
        _isParsing: true,
        _shouldParseCsv: false,
      },
    });

    const csv = store.selectUploadCsv();
    const text = await csv.text();

    readString(text, {
      worker: true,
      header: hasHeaderRow,
      skipEmptyLines: true,
      complete: (results) => {
        dispatch({
          type: 'UPLOAD_PARSE_CSV_FINISH',
          payload: {
            _isParsing: false,
            json: results?.data,
          },
        });
        onComplete(results?.data);
      },
    });    
  },

  doUploadClear: () => ({ dispatch }) => {
    dispatch({
      type: 'UPLOAD_CLEAR',
      payload: {
        csv: null,
        json: null,
        ignoreRows: '',
        selectedParser: null,
        fieldMap: null,
        _errors: [],
      },
    });
  },

  doUploadSettingsClear: () => ({ dispatch }) => {
    dispatch({
      type: 'UPLOAD_SETTINGS_CLEAR',
      payload: {
        ignoreRows: '',
        selectedParser: null,
        fieldMap: null,
        _errors: [],
      },
    });
  },

  doUploadSetIgnoreRows: (rows) => ({ dispatch }) => {
    dispatch({
      type: 'UPLOAD_SET_IGNORE_ROWS',
      payload: {
        ignoreRows: rows,
      },
    });
  },

  doUploadSetSelectedParser: (parser) => ({ dispatch, store }) => {
    const { name } = parser;

    if (name === 'TOA5 Measurements') {
      store.doUploadParseCsv(
        false,
        (json) => {
          store.doUploadSetJsonManually(toa5JsonMap(json));
          dispatch({
            type: 'UPLOAD_SET_PARSER',
            payload: {
              selectedParser: parser,
            },
          });
        },
      );
    } else {
      dispatch({
        type: 'UPLOAD_SET_PARSER',
        payload: {
          selectedParser: parser,
        },
      });
    }
  },

  doUploadSetFieldmap: (fieldMap) => ({ dispatch }) => {
    dispatch({
      type: 'UPLOAD_SET_FIELD_MAP',
      payload: {
        fieldMap: fieldMap,
      },
    });
  },

  doUploadSend: () => async ({ dispatch, store, apiPost }) => {
    dispatch({
      type: 'UPLOAD_POST_START',
      payload: {
        _isUploading: true,
      },
    });

    const project = store.selectProjectsByRoute();
    const selectedParser = store.selectUploadSelectedParser();
    const parsedData = store.selectUploadDataParsed();

    let filteredData = parsedData
      .filter((row) => !row.ignore)
      .map((row) => {
        delete row.ignore;
        delete row.errors;
        row.project_id = project.id;
        return row;
      });

    if (
      selectedParser.prePostFilter &&
      typeof selectedParser.prePostFilter === 'function'
    ) {
      filteredData = selectedParser.prePostFilter(filteredData);
    }

    const postUrl = selectedParser.url.replace(':projectId', project.id);

    apiPost(`${postUrl}?dry_run=true`, filteredData, (err, body) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error(err.message);
        store.doNotificationFire({
          message: err
            ? `${err.name}: ${err.Detail}`
            : 'An unexpected error occured. Please try again later.',
          type: 'error',
          autoClose: false,
        });
      } else {
        const data = body;
        if (data.is_valid) {
          apiPost(postUrl, filteredData, (err, _body) => {
            if (err) {
              // @TODO add better error handling here
              // eslint-disable-next-line no-console
              console.error(err.message);
              store.doNotificationFire({
                message: 'An unexpected error occured. Please try again later.',
                type: 'error',
                autoClose: false,
              });
            } else {
              dispatch({
                type: 'UPLOAD_POST_FINISHED',
              });
              store.doNotificationFire({
                message: 'Data Uploaded Successfully',
                type: 'success',
                autoClose: 10000,
              });
            }
          });
        } else {
          // Safety meaasure until ?dry_run=true is complete on API for all uploaders
          if (Array.isArray(data) && data.length > 0) {
            dispatch({
              type: 'UPLOAD_POST_FINISHED',
            });
            store.doNotificationFire({
              message: 'Data Uploaded Successfully',
              type: 'success',
              autoClose: 10000,
            });
          } else {
            data.errors.forEach((error) => {
              store.doNotificationFire({
                message: error,
                type: 'error',
                autoClose: 20000,
              });
            });
          }
        }
      }
    });
  },

  doUploadIgnoreErrors: () => ({ dispatch, store }) => {
    const parsed = store.selectUploadDataParsed();
    const errRows = parsed
      .map((row, i) => {
        if (row.errors.length) return i + 1;
        return null;
      })
      .filter((row) => !!row)
      .join(',');
    dispatch({
      type: 'UPLOAD_SET_IGNORE_ROWS',
      payload: {
        ignoreRows: errRows,
      },
    });
  },

  doUploadSetJsonManually: (data) => ({ dispatch }) => {
    dispatch({
      type: 'UPLOAD_SET_JSON',
      payload: {
        json: data,
      },
    });
  },

  selectCurrentState: (state) => state,
  selectUploadIsParsing: (state) => state.upload._isParsing,
  selectUploadIsUploading: (state) => state.upload._isUploading,
  selectUploadParsers: (state) => state.upload.parsers,
  selectUploadSelectedParser: (state) => state.upload.selectedParser,
  selectUploadFieldMap: (state) => state.upload.fieldMap,
  selectUploadIgnoreRows: (state) => state.upload.ignoreRows,
  selectUploadErrors: (state) => state.upload._errors,
  selectUploadCsv: (state) => state.upload.csv,
  selectUploadJson: (state) => state.upload.json,

  selectUploadColumnDefsOriginal: createSelector('selectUploadJson', (json) => {
    if (!json || !json.length) return [];

    const keys = Object.keys(json[0]);
    return [
      { headerName: '', valueGetter: 'node.rowIndex + 1', width: 60 },
      ...keys.map((key) => ({
        headerName: key.toUpperCase(),
        field: key,
        resizable: true,
        sortable: true,
        filter: false,
        editable: false,
        cellStyle: (params) => cellStyle(params, key),
      })),
    ];
  }),

  selectUploadDataOriginal: createSelector(
    'selectUploadJson',
    'selectUploadIgnoreRowsList',
    (json, ignore) => {
      if (!json || !json.length) return [];
      return json.map((row, i) => {
        if (ignore.indexOf(i + 1) !== -1) {
          row.ignore = true;
        } else {
          row.ignore = false;
        }
        return row;
      });
    }
  ),

  selectUploadColumnDefsParsed: createSelector(
    'selectUploadSelectedParser',
    (parser) => {
      if (!parser || !parser.model) return [];
      const keys = Object.keys(parser.model);
      return [
        { headerName: '', valueGetter: 'node.rowIndex + 1', width: 60 },
        ...keys.map((key) => ({
          headerName: key.toUpperCase(),
          field: key,
          resizable: true,
          sortable: true,
          filter: false,
          editable: false,
          cellStyle: (params) => cellStyle(params, key),
        })),
      ];
    }
  ),

  selectUploadDataParsed: createSelector(
    'selectCurrentState',
    'selectUploadJson',
    'selectUploadFieldMap',
    'selectUploadSelectedParser',
    'selectUploadIgnoreRowsList',
    'selectDomainsItemsByGroup',
    (state, json, fieldMap, parser, ignore, domains) => {
      if (!json || !fieldMap || !parser || !parser.model) return [];
      let rows = json.map((row, i) => {
        const parsedRow = { errors: [], ignore: false };
        Object.keys(parser.model).forEach((key) => {
          const config = parser.model[key];
          const sourceKey = fieldMap[key];
          if (!config.hidden) {
            // check to see if we should just set all rows to a certain value
            const allTest = /all-(.+)/gi;
            const setAllTo = allTest.exec(sourceKey);
            if (setAllTo) {
              parsedRow[key] =
                config.type === 'boolean'
                  ? setAllTo[1] === 'true'
                  : setAllTo[1];
            } else {
              // If field not mapped, set to null; if required field, push error
              const data = row[sourceKey] || fieldMap[key];
              if (!data) {
                parsedRow[key] = null;
                if (config.required) parsedRow.errors.push(key);
              } else {
                // If field is a domain, set value to primary key of domain
                if (config.type === 'domain') {
                  const foundDomainItem = domains[config.domainGroup].filter(
                    (d) => d.value.toUpperCase() === data.toUpperCase()
                  );
                  if (foundDomainItem[0]) {
                    parsedRow[key] = foundDomainItem[0].id;
                  } else {
                    parsedRow[key] = null;
                    if (config.required) parsedRow.errors.push(key);
                  }
                  // If not a domain and not unmapped (i.e. anything else)
                } else {
                  if (config.parse && typeof config.parse === 'function') {
                    parsedRow[key] = config.parse(data, state, parsedRow);
                  } else {
                    parsedRow[key] = data;
                  }
                  // Validation
                  if (
                    config.validate &&
                    typeof config.validate === 'function'
                  ) {
                    if (!config.validate(parsedRow[key], state, parsedRow)) {
                      parsedRow.errors.push(key);
                    }
                  }
                }
              }
            }
          }
        });

        if (ignore.indexOf(i + 1) !== -1) parsedRow.ignore = true;
        return parsedRow;
      });
      if (parser.postProcess && typeof parser.postProcess === 'function')
        rows = parser.postProcess(rows);
      return rows;
    }
  ),

  selectUploadReadyToUpload: createSelector(
    'selectUploadFieldMap',
    'selectUploadSelectedParser',
    (fieldMap, parser) => {
      let ready = true;
      if (fieldMap) {
        const keys = Object.keys(parser.model || {});
        for (let i = 0; i < keys.length; i++) {
          const field = parser.model[keys[i]];
          if (field.required && fieldMap[keys[i]] === '') {
            ready = false;
            break;
          }
        }
      } else {
        ready = false;
      }
      return ready;
    }
  ),

  selectUploadJsonKeys: createSelector('selectUploadJson', (json) => {
    if (!json || !json.length) return [];
    const keys = Object.keys(json[0]);
    const removeTheseKeys = ['ignore'];
    removeTheseKeys.forEach((removeKey) => {
      const idx = keys.indexOf(removeKey);
      if (idx !== -1) keys.splice(idx, 1);
    });
    return keys;
  }),

  selectUploadFileName: createSelector('selectUploadCsv', (csv) =>
    !csv ? null : csv.name
  ),

  selectUploadFileType: createSelector('selectUploadCsv', (csv) =>
    !csv ? null : csv.type
  ),

  selectUploadFileSize: createSelector('selectUploadCsv', (csv) =>
    !csv ? null : formatBytes(csv.size)
  ),

  selectUploadFileLastModified: createSelector('selectUploadCsv', (csv) =>
    !csv ? null : new Date(csv.lastModified).toLocaleString()
  ),

  selectUploadFileData: createSelector(
    'selectUploadFileName',
    'selectUploadFileSize',
    'selectUploadFileType',
    'selectUploadFileLastModified',
    'selectUploadJson',
    (name, size, type, lastModified, json) => ({
      name: name,
      type: type,
      size: size,
      lastModified: lastModified,
      totalRows: json ? json.length : 0,
    })
  ),

  selectUploadHasFile: createSelector('selectUploadCsv', (csv) => !!csv),

  selectUploadIgnoreRowsList: createSelector(
    'selectUploadIgnoreRows',
    (rows) => {
      const rowNumbers = [];
      const rowItems = rows.replace(' ', '').split(',');
      rowItems.forEach((item) => {
        if (item !== '') {
          // if a user enters a range with a '-' split it and iterate through that range
          if (item.indexOf('-') !== -1) {
            const rangeFromTo = item.split('-');
            const from = Number(rangeFromTo[0]);
            const to = Number(rangeFromTo[1]);
            if (!isNaN(from) && !isNaN(to)) {
              for (var i = from; i <= to; i++) {
                if (rowNumbers.indexOf(i) === -1) rowNumbers.push(i);
              }
            }
          } else {
            const rowNum = Number(item);
            if (!isNaN(rowNum)) {
              if (rowNumbers.indexOf(rowNum) === -1) rowNumbers.push(rowNum);
            }
          }
        }
      });
      return rowNumbers;
    }
  ),

  /** NOTE: Only add required data for mapping to minimize overhead. */
  selectStateData: (state) => ({
    instruments: state.instruments,
    instrumentTimeseries: state.instrumentTimeseries,
  }),

  reactUploadShouldParseCsv: (state) => {
    if (state.upload._shouldParseCsv)
      return { actionCreator: 'doUploadParseCsv' };
  },
};

export default uploadBundle;
