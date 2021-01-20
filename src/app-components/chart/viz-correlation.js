import React from 'react';
import { connect } from 'redux-bundler-react';
import Chart from './chart';

export default connect(
  'doChartEditorSetLayout',
  'doChartEditorSetData',
  'doChartEditorSetFrames',
  'selectChartEditorCorrelationData',
  'selectChartEditorLayout',
  'selectChartEditorFrames',
  'selectChartEditorConfig',
  ({
    doChartEditorSetLayout,
    doChartEditorSetData,
    doChartEditorSetFrames,
    chartEditorCorrelationData: data,
    chartEditorLayout: layout,
    chartEditorFrames: frames,
    chartEditorConfig: config,
  }) => {
    const handleUpdate = (figure) => {
      doChartEditorSetLayout(figure.layout);
      doChartEditorSetData(figure.data);
      doChartEditorSetFrames(figure.frames);
    };

    // don't try and show multiple plots for correlation
    layout.grid = {};

    return (
      <Chart
        data={data}
        layout={layout}
        frames={frames}
        config={config}
        onUpdate={handleUpdate}
      />
    );
  }
);
