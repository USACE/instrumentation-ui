// @TODO: Work In Progress

import React, { useEffect, useState } from 'react';
import { subDays, startOfDay, endOfDay, isEqual, setDate } from 'date-fns';
import { parseISO, format } from 'date-fns';

import PrintButton from './print-button';
import Button from '../../../app-components/button';
import ToggleButton from '../../../app-components/toggle-button';
import DatePicker from 'react-datepicker';
import Notifications from '../../../app-components/notifications';

const dateAgo = (days) => subDays(new Date(), days);

const BatchPlotChartSettings = ({
  dateRange = [],
  setDateRange,
  setWithPrecipitation,
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
      {/*<ToggleButton handleChange={val => setWithPrecipitation(val)} />*/}
      <div className='date-picker-group'>
        {/*<Button
          isOutline
          text='30 Day'
          variant='info'
          isActive={isEqual(from, startOfDay(dateAgo(30))) && isEqual(to, endOfDay(new Date()))}
          handleClick={() => setDateRange([startOfDay(dateAgo(30)), endOfDay(new Date())])}
        />
        <Button
          isOutline
          text='60 Day'
          variant='info'
          isActive={isEqual(from, startOfDay(dateAgo(60))) && isEqual(to, endOfDay(new Date()))}
          handleClick={() => setDateRange([startOfDay(dateAgo(60)), endOfDay(new Date())])}
        />
        <Button
          isOutline
          text='90 Day'
          variant='info'
          isActive={isEqual(from, startOfDay(dateAgo(90))) && isEqual(to, endOfDay(new Date()))}
          handleClick={() => setDateRange([startOfDay(dateAgo(90)), endOfDay(new Date())])}
        />*/}
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
        <Notifications />
      </div> 
    </div>
  );
};

export default BatchPlotChartSettings;
