import React, { useEffect } from "react";
import { connect } from "redux-bundler-react";

export default connect(
  "selectUploadFieldMap",
  "doUploadSetFieldmap",
  "selectUploadJsonKeys",
  "selectUploadSelectedParser",
  ({
    uploadFieldMap,
    doUploadSetFieldmap,
    uploadJsonKeys,
    uploadSelectedParser,
  }) => {
    if (!uploadSelectedParser) return null;
    const { model } = uploadSelectedParser;

    const updateFieldMap = (e) => {
      const key = e.target.dataset.key;
      const value = e.target.value;
      doUploadSetFieldmap(
        Object.assign({}, uploadFieldMap, {
          [key]: value,
        })
      );
    };

    useEffect(() => {
      if (uploadFieldMap) return undefined;
      const fieldMap = {};
      Object.keys(model).forEach((key) => {
        fieldMap[key] = model[key].template || "";
      });
      doUploadSetFieldmap(fieldMap);
    }, [model, uploadFieldMap, doUploadSetFieldmap]);

    if (!uploadFieldMap) return null;

    return (
      <div>
        {Object.keys(model).map((key, i) => {
          return (
            <div key={i} className="field is-horizontal">
              <div className="field-label is-normal">
                <label className="label">{model[key].label}</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <div className="control">
                    <div className="select is-fullwidth">
                      <select
                        onChange={updateFieldMap}
                        data-key={key}
                        value={uploadFieldMap[key]}
                      >
                        <option value={""}>Select One...</option>
                        {uploadJsonKeys.map((jsonKey, i) => {
                          return (
                            <option key={i} value={jsonKey}>
                              {jsonKey}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                  {model[key] && model[key].helpText ? (
                    <p className="help">{model[key].helpText}</p>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);
