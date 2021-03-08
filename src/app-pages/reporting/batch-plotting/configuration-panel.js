import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'redux-bundler-react';

import Button from '../../../app-components/button';
import MultiSelect from '../../../app-components/multi-select';

// @TODO: Edit needs to pull current selected configuration details

// @TODO: Filter out unnecessary timeseries
const filterTimeseries = timeseries => {
  const validTypes = [];
  console.log('test timeseries: ', timeseries);

  return timeseries;
};

const formatOptions = timeseries => (
  timeseries.map(ts => ({
    text: `${ts.instrument} - ${ts.name}`,
    value: ts.id,
  })).sort((a, b) => (
    a.text < b.text
      ? -1
      : a.text > b.text
        ? 1
        : 0
  ))
);

const configNameExists = (newConfigName = '', currentConfigurations = []) => {
  const found = currentConfigurations.find(elem => (
    newConfigName.trim() === elem.text.trim()
  ));

  return !!found;
};

const ConfigurationPanel = connect(
  'doBatchPlotConfigurationsSave',
  'selectBatchPlotConfigurationsObject',
  'selectBatchPlotConfigurationsActiveId',
  'selectInstrumentTimeseriesItemsByRoute',
  'selectProjectsIdByRoute',
  ({
    doBatchPlotConfigurationsSave,
    batchPlotConfigurationsObject,
    batchPlotConfigurationsActiveId,
    instrumentTimeseriesItemsByRoute: instrumentTimeseries,
    projectsIdByRoute: project,
    isOpen,
    isEditMode,
    configurations,
    closePanel,
  }) => {
    if (!isOpen) return null;

    const currentItem = batchPlotConfigurationsObject[batchPlotConfigurationsActiveId];
    const timeseries = useMemo(() => formatOptions(filterTimeseries(instrumentTimeseries)), [instrumentTimeseries]);
    const [selectedTimeseries, setSelectedTimeseries] = useState((currentItem && isEditMode) && currentItem.timeseries_id || []);
    const [newConfigName, setNewConfigName] = useState((currentItem && isEditMode) && currentItem.name || []);
    const [inputError, setInputError] = useState();

    const handleSave = () => {
      if (!newConfigName || !newConfigName.trim()) {
        setInputError('Please provide a configuration name.');
      } else if (configNameExists(newConfigName, configurations) && !isEditMode) {
        setInputError('Configuration name already exists. Please use a different name.');
      } else {
        doBatchPlotConfigurationsSave({
          ...isEditMode && { id: batchPlotConfigurationsActiveId },
          name: newConfigName.trim(),
          timeseries_id: selectedTimeseries,
          project_id: project.projectId,
        });
        closePanel();
      }
    };

    useEffect(() => {
      if (!isOpen) {
        setNewConfigName('');
        setSelectedTimeseries([]);
        setInputError('');
      }
    }, [isOpen, setNewConfigName, setSelectedTimeseries, setInputError]);

    return (
      <div className='right-panel'>
        <div className='input-container'>
          <input
            type='text'
            className={`form-control${inputError ? ' is-invalid' : ''}`}
            placeholder='Enter configuration name...'
            value={newConfigName}
            onChange={(e) => {
              if (inputError) setInputError('');
              setNewConfigName(e.target.value);
            }}
          />
          {inputError && (
            <div className='invalid-feedback'>
              {inputError}
            </div>
          )}
        </div>
        <div>
          <MultiSelect
            withSelectAllOption
            menuClasses='dropdown-menu-right'
            text={`Select Options (${(selectedTimeseries || []).length} selected)`}
            options={timeseries}
            onChange={val => setSelectedTimeseries(val)}
            initialValues={selectedTimeseries}
          />
          <div className='panel-actions'>
            <Button
              variant='secondary'
              size='small'
              text='Cancel'
              className='mr-2'
              handleClick={() => closePanel()}
            />
            <Button
              variant='success'
              size='small'
              text='Save'
              handleClick={handleSave}
            />
          </div>
        </div>
      </div>
    );
  }
);

export default ConfigurationPanel;
