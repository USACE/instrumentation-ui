// @TODO: Work In Progress

import React, { useEffect } from 'react';
import { subDays, startOfDay, endOfDay, isEqual } from 'date-fns';

import PrintButton from './print-button';
// import Button from '../../../app-components/button';
// import ToggleButton from '../../../app-components/toggle-button';

// const dateAgo = (days) => subDays(new Date(), days);

const BatchPlotChartSettings = ({
  dateRange = [],
  setDateRange,
  setWithPrecipitation,
}) => {
  const [from, to] = dateRange;

  useEffect(() => {
    // console.log('test from - to: ', from, ' - ', to);
  }, [dateRange]);

  return (
    <div className='m-2'>
      <PrintButton />
      {/* <ToggleButton handleChange={val => setWithPrecipitation(val)} />
      <div className='btn-group'>
        <Button
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
        />
      </div> */}
    </div>
  );
};

export default BatchPlotChartSettings;
