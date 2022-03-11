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
}) => {

  const [fromTime, setFromTime] = useState(dateRange[0]);
  const [endTime, setEndTime] = useState(dateRange[0]);

  useEffect(() => {
    setDateRange([fromTime, endTime]);

  }, [fromTime, endTime]);

  const thirtyDay = () => {
    setEndTime(new Date());
    setFromTime(startOfDay(dateAgo(30)));
  };
  const sixtyDay = () => {
    setEndTime(new Date());
    setFromTime(startOfDay(dateAgo(60)));
  };
  const ninetyDay = () => {
    setEndTime(new Date());
    setFromTime(startOfDay(dateAgo(90)));
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
          dateFormat="yyyy-MM-d hh:mm 'GMT'XXXXX"
          selected={fromTime}
          onChange={(val) => setFromTime(val)}
        />
        <DatePicker
          dateFormat="yyyy-MM-d hh:mm 'GMT'XXXXX"
          selected={endTime}
          onChange={(val) => setEndTime(val)}
        />
        <Button
          isOutline
          text = '30 Day'
          variant = 'info'
          handleClick={() => thirtyDay()}
        />
        <Button
          isOutline
          text = '60 Day'
          variant = 'info'
          handleClick={() => sixtyDay()}
        />
        <Button
          isOutline
          text = '90 Day'
          variant = 'info'
          handleClick={() => ninetyDay()}
        />
        <Notifications />
      </div> 
    </div>
  );
};

export default BatchPlotChartSettings;
