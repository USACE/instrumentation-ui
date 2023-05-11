import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { DateTime } from 'luxon';
import { subDays, startOfDay } from 'date-fns';
import { Tooltip } from 'react-tooltip';
import { CSVLink } from 'react-csv';

import Button from '../../../app-components/button';
import Icon from '../../../app-components/icon';
import PrintButton from './print-button';

const dateAgo = days => subDays(new Date(), days);

const customDateFormat = (fromTime, endTime) => {
  const fromISO = fromTime.toISOString();
  const endISO = endTime.toISOString();
  const fromDate = DateTime.fromISO(fromISO).toFormat('MM/dd/yyyy');
  const endDate = DateTime.fromISO(endISO).toFormat('MM/dd/yyyy');

  return `${fromDate} - ${endDate}`;
};

const BatchPlotChartSettings = ({
  chartSettings,
  setChartSettings,
  dateRange = [],
  setDateRange,
  savePlotSettings,
  chartData,
}) => {
  const [fromTime, endTime] = dateRange;
  const [activeButton, setActiveButton] = useState('1 year');
  const { auto_range, show_comments, show_masked, show_nonvalidated } = chartSettings;

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
              onChange={(update) => setDateRange(update)}
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
              checked={auto_range}
              onClick={() => setChartSettings({ ...chartSettings, auto_range: !auto_range})}
              onChange={() => {}}
            />
            Auto-range
          </label>
          <Icon
            id='auto-range-help'
            className='pl-2 d-inline'
            icon='help-circle-outline'
            style={{
              fontSize: '18px',
            }}
          />
          <Tooltip
            anchorId='auto-range-help'
            effect='solid'
            place='right'
            content={
              <span>
                Selecting this option will allow the plot to <br/>attempt a 'best-fit' view for the data selected.
              </span>
            }
          />
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
        handleClick={() => savePlotSettings({
          ...chartSettings,
          date_range: activeButton === 'Custom' ? customDateFormat(fromTime, endTime) : activeButton,
        })}
      />
      <CSVLink
        data={chartData
          .map(({ name, x, y }) => x.map((time, index) => ({ [name + ' Time']: time, [name + ' Value']: y[index] })))
          .reduce((acc, curr) => [...acc, ...curr], [])
        }
        filename={chartSettings.name + '.csv'}
      >
        <Button
          isOutline
          size='small'
          variant='success'
          text='Download Plotted Data to .csv'
          isDisabled={!chartData || chartData.length === 0}
        />
      </CSVLink>
    </div>
  );
};

export default BatchPlotChartSettings;
