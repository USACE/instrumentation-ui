import { update } from "plotly.js";
import React, { useCallback } from "react";
import { connect } from "redux-bundler-react";

import Select from '../../app-components/select';

const generateOptions = (model, jsonKeys, domains) => {
  const ret = [];

  if (model.type === 'boolean') {
    ret.push(...[
      { value: 'all-true', text: 'Set all to True' },
      { value: 'all-false', text: 'Set all to False' },
    ]);
  } else if (model.type === 'domain') {
    ret.push(...domains[model.domainGroup].map(domain => (
      { value: `all-${domain.id}`, text: `Set all to ${domain.value}`}
    )));
  }

  ret.push(...jsonKeys.map(jsonKey => ({ value: jsonKey })));
  return ret;
};

export default connect(
  "selectDomainsItemsByGroup",
  "selectUploadFieldMap",
  "doUploadSetFieldmap",
  "selectUploadJsonKeys",
  "selectUploadSelectedParser",
  ({
    domainsItemsByGroup: domains,
    uploadFieldMap,
    doUploadSetFieldmap,
    uploadJsonKeys,
    uploadSelectedParser,
  }) => {
    const { model } = uploadSelectedParser;
    const modelKeys = Object.keys(model);

    const updateFieldMap = useCallback((val, key) => {
      if (val && uploadFieldMap[key] !== val) {
        doUploadSetFieldmap({
          ...uploadFieldMap,
          ...{
            [key]: val,
            [val]: key,
          }
        })
      }
    }, [doUploadSetFieldmap, uploadFieldMap]);

    return (
      <>
        {modelKeys.map(key => (
          <div key={key}>
            {model[key].hidden ? null : (
              <div className="form-group row">
                <label className="col-3 col-form-label text-right">
                  {model[key].label}
                </label>
                <div className="col-9">
                  <Select
                    onChange={(val) => updateFieldMap(val, key)}
                    placeholderText='Select One...'
                    options={generateOptions(model[key], uploadJsonKeys, domains)}
                  />
                  {model[key] && model[key].helpText ? (
                    <small className="text-muted">{model[key].helpText}</small>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        ))}
      </>
    );
  }
);
