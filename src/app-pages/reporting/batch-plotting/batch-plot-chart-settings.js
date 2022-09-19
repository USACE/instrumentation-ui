// @TODO: Work In Progress

import React from 'react';
import { subDays, startOfDay } from 'date-fns';

import PrintButton from './print-button';
import Button from '../../../app-components/button';
import DatePicker from 'react-datepicker';

const dateAgo = (days) => subDays(new Date(), days);

const BatchPlotChartSettings = ({
  dateRange = [],
  setDateRange,
  lifetimeDate,
}) => {
  const [fromTime, endTime] = dateRange;

  const alterRange = (daysAgo) => {
    setDateRange([startOfDay(dateAgo(daysAgo)), new Date()]);
  };

  const calcLifetime = () => {
    setDateRange([new Date(lifetimeDate), new Date()]);
  };

  return (
    <div className='m-2'>
      <PrintButton />
      <div className='date-picker-group'>
        <DatePicker
          selectsRange={true}
          startDate={fromTime}
          endDate={endTime}
          onChange={(update) => {
            setDateRange(update);
          }}
          showMonthDropdown
          showYearDropdown
          dateFormat='MMMM d, yyyy h:mm aa zzzz'
        />
        <Button
          isOutline
          text = 'Lifetime'
          variant = 'info'
          handleClick={() => calcLifetime()}
        />
        <Button
          isOutline
          text = '5 Years'
          variant = 'info'
          handleClick={() => alterRange(1825)}
        />
        <Button
          isOutline
          text = '1 Year'
          variant = 'info'
          handleClick={() => alterRange(365)}
        />
        <Button
          isOutline
          text = '1 Month'
          variant = 'info'
          handleClick={() => alterRange(30)}
        />
      </div> 
    </div>
  );
};

export default BatchPlotChartSettings;
