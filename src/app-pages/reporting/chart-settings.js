import React, { useState, useEffect } from 'react';
import { connect } from 'redux-bundler-react';

import Button from '../../app-components/button';
import MultiSelect from '../../app-components/multi-select';
import Select from '../../app-components/select';

import './reporting.scss';

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
  console.log('Top of function');
  const found = currentConfigurations.find(elem => (
    newConfigName.trim() === elem.text.trim()
  ));

  console.log('found?: ', found);
  return !!found;
};

const ChartSettings = connect(
  'selectInstrumentTimeseriesItemsByRoute',
  'selectBatchPlotConfigurationsItems',
  'doBatchPlotConfigurationsSave',
  ({
    instrumentTimeseriesItemsByRoute: instrumentTimeseries,
    batchPlotConfigurationsItems,
    doBatchPlotConfigurationsSave,
  }) => {
    const [selectedTimeseries, setSelectedTimeseries] = useState([]);
    const [selectedConfiguration, setSelectedConfiguration] = useState(null);
    const [newConfigName, setNewConfigName] = useState('');
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [inputError, setInputError] = useState('');
    const timeseries = formatOptions(instrumentTimeseries);

    const configurations = batchPlotConfigurationsItems.map(config => ({
      text: config.name,
      value: config.name,
    }));

    const handleSave = () => {
      if (!newConfigName) {
        setInputError('Please provide a configuration name.');
      } else if (configNameExists(newConfigName, configurations)) {
        console.log('hmmm');
        setInputError('Configuration name already exists. Please use a different name.');
      } else {
        doBatchPlotConfigurationsSave({
          ...isEditMode && { id: selectedConfiguration },
          name: newConfigName.trim(),
          timeseries_id: selectedTimeseries
        });
        setIsPanelOpen(false);
      }
    };

    const handleEditClick = () => {
      const currentItem = batchPlotConfigurationsItems.find(elem => elem.name === selectedConfiguration);

      if (currentItem) {
        setIsEditMode(true);
        setNewConfigName(currentItem.name);
        setSelectedTimeseries(currentItem.timeseries_id);
        setIsPanelOpen(true);
      }
    };

    const handleNewClick = () => {
      setIsEditMode(false);
      setIsPanelOpen(true);
    };

    useEffect(() => {
      if (!isPanelOpen) {
        setNewConfigName('');
        setSelectedTimeseries([]);
        setInputError('');
      }
    }, [isPanelOpen, setNewConfigName, setSelectedTimeseries, setInputError]);

    return (
      <div className='card w-100'>
        <div className='card-header'>
          <strong>Plot Configuration</strong>
        </div>
        <div className='d-flex justify-content-around'>
          <div className='left-panel'>
            <Select
              disabled={isPanelOpen}
              style={{ maxWidth: '350px' }}
              className='mr-2'
              placeholderText='Select a configuration...'
              options={configurations}
              onChange={val => setSelectedConfiguration(val)}
            />
            <Button
              isDisabled={!selectedConfiguration || isPanelOpen}
              isOutline
              size='small'
              variant='info'
              className='mr-2'
              title='Edit Selected Configuration'
              icon={<i className='mdi mdi-pencil' />}
              handleClick={() => handleEditClick()}
            />
            <Button
              isDisabled={isPanelOpen}
              isOutline
              size='small'
              variant='success'
              text='+ Create New'
              handleClick={() => handleNewClick()}
            />
          </div>
          {isPanelOpen && (
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
                    handleClick={() => setIsPanelOpen(false)}
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
          )}
        </div>
      </div>
    );
  }
);

export default ChartSettings;
