import React, { useEffect } from "react";
import { connect } from "redux-bundler-react";

export default connect(
  "selectProjectsByRoute",
  "selectDomainsItemsByGroup",
  "selectUploadFieldMap",
  "doUploadSetFieldmap",
  "selectUploadJsonKeys",
  "selectUploadSelectedParser",
  ({
    projectsByRoute: project,
    domainsItemsByGroup: domains,
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
      fieldMap.project_id = project.id;
      doUploadSetFieldmap(fieldMap);
    }, [model, uploadFieldMap, doUploadSetFieldmap, project]);

    if (!uploadFieldMap) return null;

    return (
      <div>
        {Object.keys(model).map((key, i) => {
          if (model[key].hidden) return null;
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
                        {model[key].type === "boolean" ? (
                          <>
                            <option value={"all-true"}>Set all to True</option>
                            <option value={"all-false"}>
                              Set all to False
                            </option>
                          </>
                        ) : null}
                        {model[key].type === "domain" ? (
                          <>
                            {domains[model[key].domainGroup].map((d) => {
                              return (
                                <option key={d.id} value={`all-${d.value}`}>
                                  Set all to {d.value}
                                </option>
                              );
                            })}
                          </>
                        ) : null}
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