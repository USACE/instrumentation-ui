import React from 'react';
import { connect } from 'redux-bundler-react';
// import SeriesPicker from "./series-picker";

export default connect(
  'doChartEditorSetLayout',
  'doChartEditorSetShowToday',
  'doChartEditorSetShowRainfall',
  'selectChartEditorLayout',
  'selectChartEditorShowToday',
  'selectChartEditorShowRainfall',
  ({
    doChartEditorSetLayout,
    doChartEditorSetShowToday,
    doChartEditorSetShowRainfall,
    chartEditorLayout: layout,
    chartEditorShowToday: showToday,
    chartEditorShowRainfall: showRainfall,
  }) => (
      <div className='row'>
        <div className='col'>
          <div>Settings</div>
          <div className='form-group'>
            <label>
              <small>Y Axis Title</small>
            </label>
            <input
              value={layout.yaxis.title.text}
              onChange={(e) => {
                doChartEditorSetLayout({
                  ...layout,
                  yaxis: {
                    ...layout.yaxis,
                    ...{ title: { text: e.target.value } },
                  },
                });
              }}
              className='form-control form-control-sm'
              type='text'
              placeholder='Y Axis Title'
            />
          </div>

          <div className='form-group'>
            <label>
              <small>X Axis Title</small>
            </label>
            <input
              value={layout.xaxis.title.text}
              onChange={(e) => {
                doChartEditorSetLayout({
                  ...layout,
                  xaxis: {
                    ...layout.xaxis,
                    ...{ title: { text: e.target.value } },
                  },
                });
              }}
              className='form-control form-control-sm'
              type='text'
              placeholder='X Axis Title'
            />
          </div>

          <div className='form-group'>
            <p className='control'>
              <label className='checkbox'>
                <input
                  className='mr-1'
                  type='checkbox'
                  checked={showToday}
                  onChange={(e) => {
                    doChartEditorSetShowToday(e.target.checked);
                  }}
                />{' '}
                Show Today on the Chart
              </label>
            </p>
          </div>

          <div className='form-group'>
            <p className='control'>
              <label className='checkbox'>
                <input
                  className='mr-1'
                  type='checkbox'
                  checked={showRainfall}
                  onChange={(e) => {
                    doChartEditorSetShowRainfall(e.target.checked);
                  }}
                />{' '}
                Show Rainfall Series
              </label>
            </p>
          </div>
        </div>
        <div className='col'></div>
      </div>
    )
);
