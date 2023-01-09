import React from 'react';

import Chart from '../../app-components/chart/chart';

const GroupTimeseriesChart = ({ data, title }) => {
  if (!data) return null;

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

  Object.keys(data).forEach(id => {
    const { items, style, name } = data[id];

    if (!items || !items.length) return 'no data to show';

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
      ...style,
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
