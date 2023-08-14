import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { DateTime } from 'luxon';
import { subDays, startOfDay } from 'date-fns';
import { CSVLink } from 'react-csv';
import { Slider } from '@mui/material';
import { toast } from 'react-toastify';

import Button from '../../../../app-components/button';
import HelperTooltip from '../../../../app-components/helper-tooltip';
import PrintButton from './print-button';

const dateAgo = days => subDays(new Date(), days);

const customDateFormat = (fromTime, endTime) => {
  const fromISO = fromTime.toISOString();
  const endISO = endTime.toISOString();
  const fromDate = DateTime.fromISO(fromISO).toFormat('MM/dd/yyyy');
  const endDate = DateTime.fromISO(endISO).toFormat('MM/dd/yyyy');

  return `${fromDate} - ${endDate}`;
};

// @TODO - this function is atrocious. fix it.
const generatePlottedCSV = async (chartData = [], setCsvData) => {
  const res = await (
    chartData
      .map(({ name, x, y }) => x.map((time, index) => ({ Time:time, [name + ' Value']: y[index] })))
      .reduce((acc, curr) => [...acc, ...curr], [])
      .reduce((acc, {Time, ...rest}) => {
        const lookup = acc.reduce((lookup, { Time }, index) => {
          lookup[Time] = index;
          return lookup;
        }, {});

        if (lookup[Time]) {
          acc[lookup[Time]] = { ...acc[lookup[Time]], ...rest };
          return acc;
        } else {
          return [...acc, {Time, ...rest}];
        }
      }, [])
      // Remove characters from ISO 8601 strings for common spreadsheet software to recognize dates
      .sort((a, b) => new Date(a.Time).getTime() - new Date(b.Time).getTime())
      .map(({ Time, ...rest }) => ({ Time: Time.replace('T', ' ').replace('Z', ''), ...rest }))
  );

  setCsvData(res);
};

const BatchPlotChartSettings = ({
  chartSettings,
  setChartSettings,
  dateRange = [],
  setDateRange,
  threshold = 3000,
  setThreshold,
  savePlotSettings,
  chartData,
}) => {
  const [fromTime, endTime] = dateRange;
  const [csvData, setCsvData] = useState([]);
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
          <div className='mt-3' style={{ zIndex: 400 }}>
            <span>
              Display Point Threshold:
              <HelperTooltip
                id='threshold-help'
                className='pl-2 d-inline'
                content={(
                  <span>
                    The Display Point Threshold value determines the number of data points to downsample the plot to.<br />
                    The higher this value is, the more accurate the data will be to actual and similarly, the lower the <br />
                    this value is, the less accurate it will be to actual. To turn off downsampling and use all data points, <br />
                    set the Display Point Threshold to <b>0</b>. The number of data points will considerably change the<br/>
                    loading time of the plot, the lower the value the faster it will load. 
                    <br /><br />
                    <i><b>It is recommended</b> to only use a high value, or 0, if your date range is small or need extremely<br />
                    accurate data representation.</i>
                  </span>
                )}
              />
            </span>
            <Slider
              aria-label='threshold slider'
              valueLabelDisplay='auto'
              marks={[{ value: 1000 }, { value: 2000 }, { value: 3000 }, { value: 4000 }, { value: 5000 }, { value: 6000 }, { value: 7000 }, { value: 8000 }, { value: 9000 }]}
              min={0}
              max={10000}
              step={100}
              value={threshold}
              onChange={(_e, newVal) => setThreshold(newVal)}
            />
          </div>
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
          <HelperTooltip
            id='auto-range-help'
            place='right'
            content={
              <span>
                Selecting this option will allow the plot to <br/>
                attempt a 'best-fit' view for the data selected.
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
                threshold,
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
        asyncOnClick
        filename={chartSettings.name + '.csv'}
        data={csvData}
        onClick={(_e, done) => {
          toast.promise(
            Promise.resolve(generatePlottedCSV(chartData, setCsvData)),
            {
              pending: {
                render: () => 'Generating CSV file. Please wait...',
              },
              success: {
                render: () => {
                  done();
                  return 'Your file is ready!';
                }
              },
              error: {
                render: ({ data }) => {
                  done(false);
                  return `Failed to generate file... \n${data?.message}`;
                }
              },
            }
          )
        }}
      >
        <Button
          isOutline
          size='small'
          variant='info'
          text='Download Plotted Data to .csv'
          className='ml-2'
        />
      </CSVLink>
    </div>
  );
};

export default BatchPlotChartSettings;
