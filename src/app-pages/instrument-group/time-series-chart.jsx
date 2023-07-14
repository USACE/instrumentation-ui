import React from 'react';

import Chart from '../../app-components/chart/chart';

const GroupTimeseriesChart = ({ data = [], activeTimeseries }) => {
  const chartData = [];
  const layout = {
    autosize: true,
    showlegend: false,
    dragmode: 'pan',
  };
  const config = {
    repsonsive: true,
    displaylogo: false,
    displayModeBar: true,
    scrollZoom: true,
  };

  data.forEach(datum => {
    const { items, name, timeseriesId } = datum;

    if (!activeTimeseries[timeseriesId]) return;

    const x = [];
    const y = [];

    items.sort((a, b) => {
      if (a.time > b.time) return 1;
      if (a.time < b.time) return -1;
      return 0;
    }).forEach((item) => {
      x.push(new Date(item.time));
      y.push(item.value);
    });

    chartData.push({
      name: name,
      x: x,
      y: y,
      showLegend: false,
    });
  });

  return (
    <Chart
      withOverlay
      data={chartData}
      layout={layout}
      config={config}
    />
  );
};

export default GroupTimeseriesChart;
