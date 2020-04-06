import neat from "neat-csv";
import { createSelector } from "redux-bundler";
import { formatBytes } from "../utils";

export default {
  name: "upload",

  getReducer: () => {
    const initialData = {
      csv: null,
      json: null,
      _isParsing: false,
      _shouldParseCsv: false
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case "UPLOAD_CLEAR":
        case "UPLOAD_QUEUE_CSV":
        case "UPLOAD_PARSE_CSV_START":
        case "UPLOAD_PARSE_CSV_FINISH":
          return Object.assign({}, state, payload);
        default:
          return state;
      }
    };
  },

  doUploadQueueCsv: csv => ({ dispatch }) => {
    dispatch({
      type: "UPLOAD_QUEUE_CSV",
      payload: {
        csv: csv,
        _shouldParseCsv: true
      }
    });
  },

  doUploadParseCsv: () => async ({ dispatch, store }) => {
    dispatch({
      type: "UPLOAD_PARSE_CSV_START",
      payload: {
        _isParsing: true,
        _shouldParseCsv: false
      }
    });

    const csv = store.selectUploadCsv();
    const text = await csv.text();
    const json = await neat(text);

    dispatch({
      type: "UPLOAD_PARSE_CSV_FINISH",
      payload: {
        _isParsing: false,
        json: json
      }
    });
  },

  doUploadClear: () => ({ dispatch }) => {
    dispatch({
      type: "UPLOAD_CLEAR",
      payload: {
        csv: null,
        json: null
      }
    });
  },

  selectUploadCsv: state => {
    return state.upload.csv;
  },

  selectUploadJson: state => {
    return state.upload.json;
  },

  selectUploadIsParsing: state => {
    return state.upload._isParsing;
  },

  selectUploadFileName: createSelector("selectUploadCsv", csv => {
    if (!csv) return null;
    return csv.name;
  }),

  selectUploadFileType: createSelector("selectUploadCsv", csv => {
    if (!csv) return null;
    return csv.type;
  }),

  selectUploadFileSize: createSelector("selectUploadCsv", csv => {
    if (!csv) return null;
    return formatBytes(csv.size);
  }),

  selectUploadFileLastModified: createSelector("selectUploadCsv", csv => {
    if (!csv) return null;
    return new Date(csv.lastModified).toLocaleString();
  }),

  selectUploadFileData: createSelector(
    "selectUploadFileName",
    "selectUploadFileSize",
    "selectUploadFileType",
    "selectUploadFileLastModified",
    (name, size, type, lastModified) => {
      return {
        name: name,
        type: type,
        size: size,
        lastModified: lastModified
      };
    }
  ),

  selectUploadHasFile: createSelector("selectUploadCsv", csv => {
    return !!csv;
  }),

  reactUploadShouldParseCsv: state => {
    if (state.upload._shouldParseCsv)
      return { actionCreator: "doUploadParseCsv" };
  }
};
