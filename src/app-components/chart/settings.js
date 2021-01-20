import React from 'react';
import { connect } from 'redux-bundler-react';
import SettingsTimeseries from './settings-timeseries';
import SettingsCorrelation from './settings-correlation';

export default connect(
  'doChartEditorSetChartType',
  'doChartEditorSetLayout',
  'selectChartEditorChartType',
  'selectChartEditorLayout',
  ({
    doChartEditorSetChartType,
    doChartEditorSetLayout,
    chartEditorChartType: chartType,
    chartEditorLayout: layout,
  }) => (
      <div style={{ marginTop: '6em', padding: '10px' }}>
        <div className='mb-2'>
          <div className='row'>
            <div className='col'>
              <div className='form-group'>
                <label>
                  <small>Chart Type</small>
                </label>
                <div className='select is-small' style={{ width: '100%' }}>
                  <select
                    className='form-control form-control-sm'
                    style={{ width: '100%' }}
                    value={chartType}
                    onChange={(e) => {
                      doChartEditorSetChartType(e.target.value);
                      doChartEditorSetLayout({
                        ...layout,
                        xaxis: {
                          ...layout.xaxis,
                          ...{
                            type:
                              e.target.value === 'timeseries' ? 'date' : '-',
                          },
                        },
                      });
                    }}
                  >
                    <option value='timeseries'>Timeseries</option>
                    <option value='correlation'>Correlation Plot</option>
                  </select>
                </div>
              </div>
            </div>
            <div className='col'>
              <div className='form-group'>
                <label>
                  <small>Chart Title</small>
                </label>
                <input
                  value={layout.title.text}
                  onChange={(e) => {
                    doChartEditorSetLayout({
                      ...layout,
                      title: {
                        ...layout.title,
                        ...{ text: e.target.value },
                      },
                    });
                  }}
                  className='form-control form-control-sm'
                  type='text'
                  placeholder='Title'
                />
              </div>
            </div>
          </div>
        </div>
        {chartType === 'timeseries' ? (
          <SettingsTimeseries />
        ) : (
          <SettingsCorrelation />
        )}
      </div>
    )
);
