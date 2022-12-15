import React, { useState } from 'react';
import { subDays, startOfDay } from 'date-fns';

import PrintButton from './print-button';
import Button from '../../../app-components/button';
import DatePicker from 'react-datepicker';

const dateAgo = (days) => subDays(new Date(), days);

const BatchPlotChartSettings = ({
  chartSettings,
  setChartSettings,
  dateRange = [],
  setDateRange,
}) => {
  const [fromTime, endTime] = dateRange;
  const [activeButton, setActiveButton] = useState('1 year');
  const { autorange, show_comments, show_masked, show_nonvalidated } = chartSettings;

  const alterRange = (daysAgo) => {
    setDateRange([startOfDay(dateAgo(daysAgo)), new Date()]);
  };

  const calcLifetime = () => {
    setDateRange([new Date(0), new Date()]);
  };

  const isDisplayAllActive = () => show_comments && show_masked && show_nonvalidated;
  
  const handleDateChangeRaw = (e) => {
    e.preventDefault();
  };

  return (
    <div className='m-2'>
      <b>Plot Settings:</b>
      <PrintButton />
      <div className='row mt-2'>
        <div className='col-md-6 col-xs-12' style={{ borderRight: '1px solid #eee' }}>
          <div className='btn-group'>
            <Button
              isOutline
              isActive={activeButton === 'Lifetime'}
              text='Lifetime'
              variant='info'
              handleClick={() => {
                setActiveButton('Lifetime');
                calcLifetime();
              }}
            />
            <Button
              isOutline
              isActive={activeButton === '5 years'}
              text='5 Years'
              variant='info'
              handleClick={() => {
                setActiveButton('5 years');
                alterRange(1825);
              }}
            />
            <Button
              isOutline
              isActive={activeButton === '1 year'}
              text='1 Year'
              variant='info'
              handleClick={() => {
                setActiveButton('1 year');
                alterRange(365);
              }}
            />
            <Button
              isOutline
              isActive={activeButton === '1 month'}
              text='1 Month'
              variant='info'
              handleClick={() => {
                setActiveButton('1 month');
                alterRange(30);
              }}
            />
            <Button
              isOutline
              isActive={activeButton === 'Custom'}
              text='Custom'
              variant='info'
              handleClick={() => setActiveButton('Custom')}
            />
          </div>
          {activeButton === 'Custom' && (
            <DatePicker
              className='form-control mt-2'
              selectsRange={true}
              startDate={fromTime}
              endDate={endTime}
              onChange={(update) => {
                setDateRange(update);
              }}
              onChangeRaw={handleDateChangeRaw}
              showMonthDropdown
              showYearDropdown
              dateFormat='MMMM d, yyyy'
            />
          )}
        </div>
        <div className='col-md-6 col-xs-12'>
          <label className='checkbox mt-1'>
            <input 
              className='mr-1'
              type='checkbox'
              checked={autorange}
              onClick={() => setChartSettings({ ...chartSettings, autorange: !autorange})}
              onChange={() => {}}
            />
            Auto-range
          </label>
          <hr />
          <label className='checkbox'>
            <input 
              className='mr-1'
              type='checkbox'
              checked={isDisplayAllActive()}
              onClick={() => setChartSettings({
                ...chartSettings,
                show_masked: !isDisplayAllActive(),
                show_nonvalidated: !isDisplayAllActive(),
                show_comments: !isDisplayAllActive(),
              })}
              onChange={() => {}}
            />
            Display All Data
          </label>
          <label className='checkbox d-block'>
            <input
              className='mr-1'
              type='checkbox'
              checked={show_masked}
              onClick={() => setChartSettings({
                ...chartSettings,
                show_masked: !show_masked
              })}
              onChange={() => {}}
            />
            Show Masked Data
          </label>
          <label className='checkbox d-block'>
            <input
              className='mr-1'
              type='checkbox'
              checked={show_nonvalidated}
              onClick={() => setChartSettings({
                ...chartSettings,
                show_nonvalidated: !show_nonvalidated
              })}
              onChange={() => {}}
            />
            Show Non-Validated
          </label>
          <label className='checkbox'>
            <input
              className='mr-1'
              type='checkbox'
              checked={show_comments}
              onClick={() => setChartSettings({
                ...chartSettings,
                show_comments: !show_comments
              })}
              onChange={() => {}}
            />
            Show Comments
          </label>
        </div>
      </div>
      <hr />
      <Button
        isOutline
        size='small'
        variant='success'
        text='Save Settings'
      />
    </div>
  );
};

export default BatchPlotChartSettings;
