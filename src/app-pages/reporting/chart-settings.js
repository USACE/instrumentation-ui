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

const ChartSettings = connect(
  'selectInstrumentTimeseriesItemsByRoute',
  'selectBatchPlotConfigurationsItems',
  'doBatchPlotConfigurationsSave',
  ({
    instrumentTimeseriesItemsByRoute: timeseries,
    batchPlotConfigurationsItems,
    doBatchPlotConfigurationsSave,
  }) => {
    const [selectedTimeseries, setSelectedTimeseries] = useState([]);
    const [selectedConfiguration, setSelectedConfiguration] = useState(null);
    const [newConfigName, setNewConfigName] = useState('');
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isInputError, setIsInputError] = useState(false);
    const options = formatOptions(timeseries);

    const configurations = batchPlotConfigurationsItems.map(config => ({
      text: config.name,
      value: config.id,
    }));

    const handleSave = () => {
      if (!newConfigName) {
        setIsInputError(true);
      } else {
        doBatchPlotConfigurationsSave({
          name: newConfigName,
          timeseries_id: selectedTimeseries
        });
        setIsPanelOpen(false);
      }
    };

    useEffect(() => {
      if (!isPanelOpen) {
        setNewConfigName('');
        setSelectedTimeseries([]);
        setIsInputError(false);
      }
    }, [isPanelOpen, setNewConfigName, setSelectedTimeseries, setIsInputError]);

    useEffect(() => {
      if (isInputError && newConfigName) {
        setIsInputError(false);
      }
    }, [isInputError, setIsInputError, newConfigName]);

    return (
      <div className='card w-100'>
        <div className='card-header'>
          <strong>Plot Configuration</strong>
        </div>
        <div className='d-flex justify-content-around'>
          <div className='left-panel'>
            <Select
              style={{ width: '350px' }}
              className='mr-2'
              placeholderText='Select a configuration...'
              options={configurations}
              onChange={val => setSelectedConfiguration(val)}
            />
            <Button
              isDisabled={!selectedConfiguration}
              isOutline
              size='small'
              variant='info'
              className='mr-2'
              title='Edit Selected Configuration'
              icon={<i className='mdi mdi-pencil' />}
              handleClick={() => {}}
            />
            <Button
              isDisabled={isPanelOpen}
              isOutline
              size='small'
              variant='success'
              text='+ Create New'
              handleClick={() => setIsPanelOpen(true)}
            />
          </div>
          {isPanelOpen && (
            <div className='right-panel'>
              <div className='input-container'>
                <input
                  type='text'
                  className={`form-control${isInputError ? ' is-invalid' : ''}`}
                  placeholder='Enter configuration name...'
                  value={newConfigName}
                  onChange={(e) => setNewConfigName(e.target.value)}
                />
                {isInputError && (
                  <div className='invalid-feedback'>
                    Please provide a configuration name.
                  </div>
                )}
              </div>
              <div>
                <MultiSelect
                  withSelectAllOption
                  menuClasses='dropdown-menu-right'
                  text={`Select Options (${selectedTimeseries.length} selected)`}
                  options={options}
                  onChange={val => setSelectedTimeseries(val)}
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
