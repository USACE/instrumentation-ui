import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'redux-bundler-react';

import Button from '../../app-components/button';
import Chart from '../../app-components/chart/chart';
import MultiSelect from '../../app-components/multi-select';
import Navbar from '../../app-components/navbar';
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
  ({
    instrumentTimeseriesItemsByRoute: timeseries,
  }) => {
    const [selectedTimeseries, setSelectedTimeseries] = useState([]);
    const [newConfigName, setNewConfigName] = useState('');
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isInputError, setIsInputError] = useState(false);
    const options = formatOptions(timeseries);

    const handleSave = () => {
      if (!newConfigName) {
        setIsInputError(true);
      } else {
        // Go ahead and save configuration with current details
        console.log('save config!');
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

    // Pull from API
    const configurations = [];

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
            />
            <Button
              isOutline
              size='small'
              variant='success'
              text='+ Create New'
              isDisabled={isPanelOpen}
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
                    Please provide a valid configuration name.
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

const BatchPlotting = connect(
  // Add selectors here
  ({
    // reference selectors here
  }) => {
    const [currentValue, setCurrentValue] = useState(null);

    return (
      <>
        <Navbar theme='primary' fixed />
        <section className='container-fluid' style={{ marginTop: '6rem', position: 'relative' }}>
          <ChartSettings />
          <Chart />
        </section>
      </>
    );
  }
);

export default BatchPlotting;
