import React, { useCallback, useEffect } from 'react';
import { connect } from 'redux-bundler-react';
import Select from 'react-select';

const generateOptions = (model, jsonKeys, domains, state) => {
  const ret = [];

  if (model.type === 'boolean') {
    ret.push(...[
      { value: 'all-true', label: 'Set all to True' },
      { value: 'all-false', label: 'Set all to False' },
    ]);
  } else if (model.type === 'domain') {
    ret.push(...domains[model.domainGroup].map(domain => (
      { value: `all-${domain.id}`, label: `Set all to ${domain.value}`}
    )));
  } else if (model.type === 'internal') {
    ret.push(...model.provider(state).map(item => (
      { value: item.value, label: item.text }
    )));
  }

  if (!model.hideCsvMappings) {
    ret.push(...jsonKeys.map(jsonKey => ({ value: jsonKey, label: jsonKey })));
  }
  return ret;
};

export default connect(
  'doUploadSetFieldmap',
  'selectDomainsItemsByGroup',
  'selectUploadFieldMap',
  'selectUploadJsonKeys',
  'selectUploadSelectedParser',
  'selectStateData',
  ({
    doUploadSetFieldmap,
    domainsItemsByGroup: domains,
    uploadFieldMap,
    uploadJsonKeys,
    uploadSelectedParser,
    stateData,
    activeTs,
  }) => {
    const { model } = uploadSelectedParser;
    const modelKeys = Object.keys(model);

    const updateFieldMap = useCallback((val, key) => {
      if (uploadFieldMap[key] !== val) {
        doUploadSetFieldmap({
          ...uploadFieldMap,
          ...{
            [key]: val,
            [val]: key,
          }
        });
      }
    }, [doUploadSetFieldmap, uploadFieldMap]);

    const getTsData = () => {
      const tsData = model['timeseries_id'].provider(stateData);
      const ts = tsData.find(el => el.value === activeTs);

      return ts;
    };

    const initTsField = key => {
      if (!activeTs) return;

      const data = getTsData();
      if (data) updateFieldMap(data.value, key);
    };

    useEffect(() => {
      initTsField('timeseries_id');
    }, []);

    return (
      <>
        {modelKeys.map(key => (
          <div key={key}>
            {model[key].hidden ? null : (
              <div className='form-group row'>
                <label className='col-3 col-form-label text-right'>
                  {model[key].label}
                </label>
                <div className='col-9'>
                  <Select
                    isClearable={model[key].useFilterComponent}
                    isSearchable={model[key].useFilterComponent}
                    placeholder='Select One...'
                    defaultValue={key === 'timeseries_id' && activeTs ? { value: activeTs, label: getTsData()?.text} : undefined}
                    onChange={newValue => updateFieldMap(newValue?.value, key)}
                    options={generateOptions(model[key], uploadJsonKeys, domains, stateData)}
                  />
                  {model[key] && model[key].helpText ? (
                    <small className='text-muted'>{model[key].helpText}</small>
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
