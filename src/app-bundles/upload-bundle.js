import neat from "neat-csv";
import { createSelector } from "redux-bundler";
import { formatBytes } from "../utils";
import instrumentParser from "../upload-parsers/instrument";

export default {
  name: "upload",

  getReducer: () => {
    const initialData = {
      csv: null,
      json: null,
      ignoreRows: "",
      parsers: [instrumentParser],
      selectedParser: null,
      fieldMap: null,
      _isParsing: false,
      _shouldParseCsv: false,
      _isUploading: false,
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case "UPLOAD_CLEAR":
        case "UPLOAD_QUEUE_CSV":
        case "UPLOAD_PARSE_CSV_START":
        case "UPLOAD_PARSE_CSV_FINISH":
        case "UPLOAD_SET_IGNORE_ROWS":
        case "UPLOAD_SET_PARSER":
        case "UPLOAD_POST_START":
        case "UPLOAD_POST_FINISH":
        case "UPLOAD_SET_FIELD_MAP":
          return Object.assign({}, state, payload);
        default:
          return state;
      }
    };
  },

  doUploadQueueCsv: (csv) => ({ dispatch }) => {
    dispatch({
      type: "UPLOAD_QUEUE_CSV",
      payload: {
        csv: csv,
        _shouldParseCsv: true,
      },
    });
  },

  doUploadParseCsv: () => async ({ dispatch, store }) => {
    dispatch({
      type: "UPLOAD_PARSE_CSV_START",
      payload: {
        _isParsing: true,
        _shouldParseCsv: false,
      },
    });

    const csv = store.selectUploadCsv();
    const text = await csv.text();
    const json = await neat(text);

    dispatch({
      type: "UPLOAD_PARSE_CSV_FINISH",
      payload: {
        _isParsing: false,
        json: json,
      },
    });
  },

  doUploadClear: () => ({ dispatch }) => {
    dispatch({
      type: "UPLOAD_CLEAR",
      payload: {
        csv: null,
        json: null,
        ignoreRows: "",
        selectedParser: null,
        fieldMap: null,
      },
    });
  },

  doUploadSetIgnoreRows: (rows) => ({ dispatch }) => {
    dispatch({
      type: "UPLOAD_SET_IGNORE_ROWS",
      payload: {
        ignoreRows: rows,
      },
    });
  },

  doUploadSetSelectedParser: (parser) => ({ dispatch }) => {
    dispatch({
      type: "UPLOAD_SET_PARSER",
      payload: {
        selectedParser: parser,
      },
    });
  },

  doUploadSetFieldmap: (fieldMap) => ({ dispatch }) => {
    dispatch({
      type: "UPLOAD_SET_FIELD_MAP",
      payload: {
        fieldMap: fieldMap,
      },
    });
  },

  doUploadSend: () => async ({ dispatch, store, apiPost }) => {
    dispatch({
      type: "UPLOAD_POST_START",
      payload: {
        _isUploading: true,
      },
    });

    const domains = store.selectDomainsItemsByGroup();
    const ignoreRows = store.selectUploadIgnoreRowsList();
    const selectedParser = store.selectUploadSelectedParser();
    const json = store.selectUploadJson();
    const fieldMap = store.selectUploadFieldMap();

    const parsed = await selectedParser.parser(
      json,
      fieldMap,
      ignoreRows,
      domains
    );

    apiPost("/instruments", parsed, (err, response, body) => {
      if (err || response.statusCode < 200 || response.statusCode >= 300) {
        console.log(err, response);
        // dispatch({
        //   type: actions.ERROR,
        //   payload: {
        //     _err: { err: err, response: response },
        //     notification: {
        //       statusCode: response.statusCode,
        //     },
        //     _isSaving: false,
        //   },
        // });
      } else {
        dispatch({
          type: "UPLOAD_POST_FINISH",
          payload: {
            csv: null,
            json: null,
            ignoreRows: "",
            parsers: [instrumentParser],
            selectedParser: null,
            fieldMap: null,
            _isParsing: false,
            _shouldParseCsv: false,
            _isUploading: false,
          },
        });
        store.doUpdateUrlWithHomepage("/manager");
      }
    });
  },

  selectUploadCsv: (state) => {
    return state.upload.csv;
  },

  selectUploadJson: (state) => {
    return state.upload.json;
  },

  selectUploadJsonKeys: createSelector("selectUploadJson", (json) => {
    if (!json || !json.length) return [];
    return Object.keys(json[0]);
  }),

  selectUploadIsParsing: (state) => {
    return state.upload._isParsing;
  },

  selectUploadFileName: createSelector("selectUploadCsv", (csv) => {
    if (!csv) return null;
    return csv.name;
  }),

  selectUploadFileType: createSelector("selectUploadCsv", (csv) => {
    if (!csv) return null;
    return csv.type;
  }),

  selectUploadFileSize: createSelector("selectUploadCsv", (csv) => {
    if (!csv) return null;
    return formatBytes(csv.size);
  }),

  selectUploadFileLastModified: createSelector("selectUploadCsv", (csv) => {
    if (!csv) return null;
    return new Date(csv.lastModified).toLocaleString();
  }),

  selectUploadFileData: createSelector(
    "selectUploadFileName",
    "selectUploadFileSize",
    "selectUploadFileType",
    "selectUploadFileLastModified",
    "selectUploadJson",
    (name, size, type, lastModified, json) => {
      return {
        name: name,
        type: type,
        size: size,
        lastModified: lastModified,
        totalRows: json ? json.length : 0,
      };
    }
  ),

  selectUploadHasFile: createSelector("selectUploadCsv", (csv) => {
    return !!csv;
  }),

  selectUploadIgnoreRows: (state) => {
    return state.upload.ignoreRows;
  },

  selectUploadIgnoreRowsList: createSelector(
    "selectUploadIgnoreRows",
    (rows) => {
      const rowNumbers = [];
      const rowItems = rows.replace(" ", "").split(",");
      rowItems.forEach((item) => {
        if (item !== "") {
          // if a user enters a range with a '-' split it and iterate through that range
          if (item.indexOf("-") !== -1) {
            const rangeFromTo = item.split("-");
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

  selectUploadParsers: (state) => {
    return state.upload.parsers;
  },

  selectUploadSelectedParser: (state) => {
    return state.upload.selectedParser;
  },

  selectUploadIsUploading: (state) => {
    return state.upload._isUploading;
  },

  selectUploadFieldMap: (state) => {
    return state.upload.fieldMap;
  },

  reactUploadShouldParseCsv: (state) => {
    if (state.upload._shouldParseCsv)
      return { actionCreator: "doUploadParseCsv" };
  },
};
