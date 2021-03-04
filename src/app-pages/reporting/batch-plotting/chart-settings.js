import React, { useState, useEffect } from 'react';
import { connect } from 'redux-bundler-react';

import Button from '../../../app-components/button';
import DeleteButton from '../../../app-components/delete-confirm';
import MultiSelect from '../../../app-components/multi-select';
import Select from '../../../app-components/select';
import usePrevious from '../../../customHooks/usePrevious';

import '../reporting.scss';

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

const ChartSettings = connect(
  'selectInstrumentTimeseriesItemsByRoute',
  'selectBatchPlotConfigurationsItems',
  'selectProjectsIdByRoute',
  'selectBatchPlotConfigurationsActiveId',
  'doBatchPlotConfigurationsSave',
  'doBatchPlotConfigurationsDelete',
  'doBatchPlotConfigurationsSetActiveId',
  ({
    instrumentTimeseriesItemsByRoute: instrumentTimeseries,
    batchPlotConfigurationsItems,
    projectsIdByRoute: project,
    batchPlotConfigurationsActiveId,
    doBatchPlotConfigurationsSave,
    doBatchPlotConfigurationsDelete,
    doBatchPlotConfigurationsSetActiveId,
  }) => {
    const [selectedTimeseries, setSelectedTimeseries] = useState([]);
    const [newConfigName, setNewConfigName] = useState('');
    const [inputError, setInputError] = useState('');
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const timeseries = formatOptions(instrumentTimeseries);
    const previousConfigId = usePrevious(batchPlotConfigurationsActiveId);

    const configurations = batchPlotConfigurationsItems.map(config => ({
      text: config.name,
      value: config.id,
    }));

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
        setIsPanelOpen(false);
      }
    };

    const handleEditClick = () => {
      const currentItem = batchPlotConfigurationsItems.find(elem => elem.id === batchPlotConfigurationsActiveId);

      if (currentItem) {
        setIsEditMode(true);
        setNewConfigName(currentItem.name);
        setSelectedTimeseries(currentItem.timeseries_id);
        setIsPanelOpen(true);
      }
    };

    const handleDeleteClick = () => {
      const currentItem = batchPlotConfigurationsItems.find(elem => elem.id === batchPlotConfigurationsActiveId);

      if (currentItem) {
        doBatchPlotConfigurationsDelete(currentItem);
      }
    };

    const handleNewClick = () => {
      setIsEditMode(false);
      setIsPanelOpen(true);
    };

    const handleSelectChange = val => {
      if (val && val !== previousConfigId) {
        doBatchPlotConfigurationsSetActiveId(val);
      }
    };

    useEffect(() => {
      if (!isPanelOpen) {
        setNewConfigName('');
        setSelectedTimeseries([]);
        setInputError('');
      }
    }, [isPanelOpen, setNewConfigName, setSelectedTimeseries, setInputError]);

    return (
      <div className='d-flex justify-content-around'>
        <div className='left-panel'>
          <Select
            isDisabled={isPanelOpen}
            style={{ maxWidth: '350px' }}
            className='mr-2'
            placeholderText='Select a configuration...'
            options={configurations}
            onChange={handleSelectChange}
          />
          {batchPlotConfigurationsActiveId && (
            <>
              <Button
                isDisabled={isPanelOpen}
                isOutline
                size='small'
                variant='info'
                className='mr-2'
                title='Edit Selected Configuration'
                icon={<i className='mdi mdi-pencil' />}
                handleClick={() => handleEditClick()}
              />
              <DeleteButton
                isDisabled={isPanelOpen}
                isOutline
                size='small'
                className='mr-2'
                title='Delete Selected Configuration'
                deleteText=''
                deleteIcon={<i className='mdi mdi-trash-can' />}
                handleDelete={() => handleDeleteClick()}
              />
            </>
          )}
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
    );
  }
);

export default ChartSettings;
