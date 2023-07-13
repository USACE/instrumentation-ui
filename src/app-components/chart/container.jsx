import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { connect } from 'redux-bundler-react';
import { subDays, differenceInDays, isSameDay } from 'date-fns';
import { Settings as SettingsIcon } from '@mui/icons-material';

import Button from '../button'
import Settings from './settings';
import VizCorrelation from './viz-correlation';
import VizTimeseries from './viz-timeseries';

import './chartStyles.scss';

export default connect(
  'doChartEditorSetShowSettings',
  'doChartEditorSetLayout',
  'doChartEditorSetCorrelationDates',
  'doExploreMapInteractionsIncrementVersion',
  'selectChartEditorShowSettings',
  'selectChartEditorChartType',
  'selectChartEditorLayout',
  'selectChartEditorCorrelationMinDate',
  'selectChartEditorCorrelationMaxDate',
  ({
    doChartEditorSetShowSettings,
    doChartEditorSetLayout,
    doChartEditorSetCorrelationDates,
    doExploreMapInteractionsIncrementVersion,
    chartEditorShowSettings: showSettings,
    chartEditorChartType: chartType,
    chartEditorLayout: layout,
    chartEditorCorrelationMinDate: minDate,
    chartEditorCorrelationMaxDate: maxDate,
  }) => {
    const [from, setFrom] = useState(minDate);
    const [to, setTo] = useState(maxDate);

    const updateChartDates = (f, t, autorange = true) => {
      if (chartType === 'timeseries') {
        doChartEditorSetLayout({
          ...layout,
          xaxis: {
            ...layout.xaxis,
            range: [f, t],
            autorange,
          },
        });
      } else {
        doChartEditorSetCorrelationDates(f, t);
      }
      doExploreMapInteractionsIncrementVersion();
    };

    const setLifetime = () => {
      if (chartType === 'timeseries') {
        setChartDates();
      } else {
        doChartEditorSetCorrelationDates(null, null);
      }
      doExploreMapInteractionsIncrementVersion();
    };

    const setChartDates = (daysAgo) => {
      const now = new Date();
      const backDate = daysAgo ? subDays(now, daysAgo) : new Date(0);

      setFrom(backDate.toISOString());
      setTo(now.toISOString());
    };

    const commonButtonStyles = (daysAgo) => {
      const toDate = to ? new Date(to) : null;
      const fromDate = from ? new Date(from) : null;

      const isActive = () => {
        if (!(toDate && fromDate)) return false;

        if (daysAgo == 0) {
          return (isSameDay(fromDate, new Date(0)) && isSameDay(toDate, new Date()));
        } else {
          return differenceInDays(toDate, fromDate) == daysAgo;
        }
      };

      return {
        variant: 'info',
        size: 'small',
        isOutline: true,
        isActive: isActive(),
      };
    };

    useEffect(() => {
      updateChartDates(from, to);
    }, [from, to]);

    return (
      <div className='chart-container'>
        <span
          className='pointer settings-icon-container'
          onClick={() => doChartEditorSetShowSettings(!showSettings)}
        >
          <SettingsIcon className={`settings-icon ${showSettings ? 'active' : ''}`} fontSize='medium' />
        </span>
        <div className='d-flex form-container'>
          <div className='form-group mr-2'>
            <label>
              <small>Date From</small>
            </label>
            <DatePicker
              className='form-control form-control-sm'
              selected={from ? new Date(from) : null}
              maxDate={to ? new Date(to) : null}
              onChange={val => setFrom(val.toISOString())}
            />
          </div>
          <div className='form-group mr-2'>
            <label>
              <small>Date To</small>
            </label>
            <DatePicker
              className='form-control form-control-sm'
              selected={to ? new Date(to) : null}
              minDate={from ? new Date(from) : null}
              onChange={val => setTo(val.toISOString())}
            />
          </div>
          <div className='form-group'>
            <label>
              <small>Presets</small>
            </label>
            <div className='d-flex'>
              <div className='btn-group'>
                <Button
                  {...commonButtonStyles(7)}
                  text='7 day'
                  handleClick={() => setChartDates(7)}
                />
                <Button
                  {...commonButtonStyles(30)}
                  text='30 day'
                  handleClick={() => setChartDates(30)}
                />
                <Button
                  {...commonButtonStyles(60)}
                  text='60 day'
                  handleClick={() => setChartDates(60)}
                />
                <Button
                  {...commonButtonStyles(90)}
                  text='90 day'
                  handleClick={() => setChartDates(90)}
                />
              </div>
              <Button
                {...commonButtonStyles(0)}
                className='ml-2'
                text='Lifetime'
                handleClick={() => setLifetime()}
              />
            </div>
          </div>
        </div>
        {showSettings ? (
          <Settings />
        ) : chartType === 'timeseries' ? (
          <VizTimeseries />
        ) : (
          <VizCorrelation />
        )}
      </div>
    );
  }
);
