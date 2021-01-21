import React from 'react';
import { connect } from 'redux-bundler-react';

export default connect(
  'doChartEditorSetLayout',
  'doChartEditorSetExactMatchesOnly',
  'doChartEditorSetCorrelationSeriesX',
  'doChartEditorSetCorrelationSeriesY',
  'selectChartEditorLayout',
  'selectChartEditorExactMatchesOnly',
  'selectChartEditorCorrelationSeriesX',
  'selectChartEditorCorrelationSeriesY',
  'selectExploreDataByInstrumentId',
  ({
    doChartEditorSetLayout,
    doChartEditorSetExactMatchesOnly,
    doChartEditorSetCorrelationSeriesX,
    doChartEditorSetCorrelationSeriesY,
    chartEditorLayout: layout,
    chartEditorExactMatchesOnly: exactMatchesOnly,
    chartEditorCorrelationSeriesX: correlationSeriesX,
    chartEditorCorrelationSeriesY: correlationSeriesY,
    exploreDataByInstrumentId,
  }) => {
    const timeseriesOptions = [];
    Object.keys(exploreDataByInstrumentId).forEach((instrumentId) => {
      const instrument = exploreDataByInstrumentId[instrumentId];
      instrument.timeseries.forEach((timeseries) => {
        timeseriesOptions.push({
          key: timeseries.id,
          title: `${timeseries.instrument} - ${timeseries.name}`,
          value: timeseries.id,
        });
      });
    });

    return (
      <div className='row'>
        <div className='col'>
          <div>Settings</div>
          <div className='form-group'>
            <label>Y Axis Title</label>

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
            <label>X Axis Title</label>

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
            <label className='checkbox label is-small'>
              <input
                style={{ marginRight: '.8em' }}
                type='checkbox'
                checked={exactMatchesOnly}
                onChange={(e) => {
                  doChartEditorSetExactMatchesOnly(e.target.checked);
                }}
              />{' '}
              Limit to exact temporal matches
            </label>
          </div>
        </div>
        <div className='col'>
          <div>Series</div>

          <div className='form-group'>
            <label>Y Series</label>
            <select
              className='form-control form-control-sm'
              value={correlationSeriesY}
              onChange={(e) => {
                doChartEditorSetCorrelationSeriesY(e.target.value);
                const title = e.target.selectedOptions[0].dataset.title;
                doChartEditorSetLayout({
                  ...layout,
                  yaxis: {
                    ...layout.yaxis,
                    ...{ title: { text: title } },
                  },
                });
              }}
            >
              <option value=''>Please Choose a Dataset...</option>
              {timeseriesOptions.map((opt) => (
                <option
                  key={opt.key}
                  data-title={opt.title}
                  value={opt.value}
                >
                  {opt.title}
                </option>
              ))}
            </select>
          </div>

          <div className='form-group'>
            <label>X Series</label>
            <select
              className='form-control form-control-sm'
              value={correlationSeriesX}
              onChange={(e) => {
                doChartEditorSetCorrelationSeriesX(e.target.value);
                const title = e.target.selectedOptions[0].dataset.title;
                doChartEditorSetLayout({
                  ...layout,
                  xaxis: {
                    ...layout.xaxis,
                    ...{ title: { text: title } },
                  },
                });
              }}
            >
              <option value=''>Please Choose a Dataset...</option>
              {timeseriesOptions.map((opt) => (
                <option
                  key={opt.key}
                  data-title={opt.title}
                  value={opt.value}
                >
                  {opt.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  }
);
