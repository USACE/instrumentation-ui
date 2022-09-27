/*
  @TODO - What is this file, is it needed?

  9/26 - Still unsure if needed. updated if it is though...
*/

import React from 'react';
import { connect } from 'redux-bundler-react';
import { ChromePicker } from 'react-color';
import Select from 'react-select';

export default connect(
  'doChartUpdateType',
  'selectChartType',
  'selectChartColor',
  'doChartUpdateWidth',
  'doChartUpdateColor',
  ({ doChartUpdateType, doChartUpdateWidth, doChartUpdateColor, chartType, chartColor }) => (
    <div className='panel'>
      <div
        className='panel-heading'
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        Chart Options
      </div>
      <div className='p-3'>
        <div className='columns'>
          <div className='column'>
            <div className='control'>
              <div className='select'>
                <Select
                  onChange={newValue => doChartUpdateType(newValue?.value)}
                  placeholder='Chart Type'
                  options={[
                    { value: 'markers', label: 'Markers' },
                    { value: 'lines', label: 'Lines' },
                    { value: 'lines+markers', label: 'Line+Markers' },
                  ]}
                />
              </div>
              <br />
              <br />
              {chartType !== 'markers' ? (
                <div className='select'>
                  <Select
                    onChange={newValue => doChartUpdateWidth(newValue?.value)}
                    placeholder='Line Width'
                    options={[
                      { value: '1', label: '.5' },
                      { value: '2', label: '1' },
                      { value: '3', label: '2' },
                      { value: '4', label: '3' },
                    ]}
                  />
                </div>
              ) : null}
            </div>
          </div>
          <div className='column'>
            <ChromePicker
              color={chartColor}
              onChange={doChartUpdateColor}
            />
          </div>
        </div>
      </div>
    </div>
  )
);

