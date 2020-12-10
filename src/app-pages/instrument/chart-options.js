/* @TODO - What is this file, is it needed? */

import React from 'react';
import { connect } from 'redux-bundler-react';
import { ChromePicker } from 'react-color';

import Select from '../../app-components/select';

export default connect(
  'doChartUpdateType',
  'selectChartType',
  'selectChartColor',
  'doChartUpdateWidth',
  'doChartUpdateColor',
  ({ doChartUpdateType, doChartUpdateWidth, doChartUpdateColor, chartType, chartColor }) => {
    return (
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
                    onChange={value => doChartUpdateType(value)}
                    placeholderText='Chart Type'
                    options={[
                      { value: 'markers', text: 'Markers' },
                      { value: 'lines', text: 'Lines' },
                      { value: 'lines+markers', text: 'Line+Markers' },
                    ]}
                  />
                </div>
                <br />
                <br />
                {chartType !== 'markers' ? (
                  <div className='select'>
                    <Select
                      onChange={value => doChartUpdateWidth(value)}
                      placeholderText='Line Width'
                      options={[
                        { value: '1', text: '.5' },
                        { value: '2', text: '1' },
                        { value: '3', text: '2' },
                        { value: '4', text: '3' },
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
    );
  }
);

