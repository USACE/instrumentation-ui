import React from 'react';
import DatePicker from 'react-datepicker';
import { connect } from 'redux-bundler-react';
import { subDays } from 'date-fns';

import Button from '../button';
import Icon from '../icon';
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
    const now = new Date();
    const from =
      chartType === 'timeseries'
        ? layout.xaxis.range[0]
          ? layout.xaxis.range[0]
          : minDate
        : minDate;

    const to =
      chartType === 'timeseries'
        ? layout.xaxis.range[1]
          ? layout.xaxis.range[1]
          : maxDate
        : maxDate;

    const updateChartDates = (f, t) => {
      if (chartType === 'timeseries') {
        doChartEditorSetLayout({
          ...layout,
          xaxis: {
            ...layout.xaxis,
            ...{ autorange: false, range: [f, t] },
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
      const backDate = daysAgo ? subDays(now, daysAgo) : new Date(0);
      updateChartDates(backDate.toISOString(), now.toISOString());
    };

    const commonButtonStyles = {
      variant: 'info',
      size: 'small',
      isOutline: true,
    };

    return (
      <div className='chart-container'>
        <span
          className='pointer settings-icon-container'
          onClick={() => doChartEditorSetShowSettings(!showSettings)}
        >
          <Icon
            icon='cog'
            className={`settings-icon ${showSettings ? 'active' : ''}`}
          />
        </span>
        <div className='d-flex form-container'>
          <div className='form-group mr-2'>
            <label>
              <small>Date From</small>
            </label>
            <DatePicker
              className='form-control form-control-sm'
              selected={from ? new Date(from) : null}
              onChange={(val) => {
                updateChartDates(val.toISOString(), to);
              }}
              maxDate={to ? new Date(to) : null}
            />
          </div>
          <div className='form-group mr-2'>
            <label>
              <small>Date To</small>
            </label>
            <DatePicker
              className='form-control form-control-sm'
              selected={to ? new Date(to) : null}
              onChange={(val) => {
                updateChartDates(from, val.toISOString());
              }}
              minDate={from ? new Date(from) : null}
            />
          </div>
          <div className='form-group'>
            <label>
              <small>Presets</small>
            </label>
            <div className='btn-group'>
              <Button
                {...commonButtonStyles}
                text='7 day'
                handleClick={() => setChartDates(7)}
              />
              <Button
                {...commonButtonStyles}
                text='30 day'
                handleClick={() => setChartDates(30)}
              />
              <Button
                {...commonButtonStyles}
                text='60 day'
                handleClick={() => setChartDates(60)}
              />
              <Button
                {...commonButtonStyles}
                text='90 day'
                handleClick={() => setChartDates(90)}
              />
              <Button
                {...commonButtonStyles}
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
