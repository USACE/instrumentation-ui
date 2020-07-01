import React from "react";
import Plot from "react-plotly.js";

export default ({ data, title }) => {
  if (!data) return null;

  const chartData = [];

  Object.keys(data).forEach((id, i) => {
    const { items, style, name } = data[id];
    if (!items || !items.length) return "no data to show";
    const x = [];
    const y = [];
    items
      .sort((a, b) => {
        if (a.time > b.time) return 1;
        if (a.time < b.time) return -1;
        return 0;
      })
      .forEach((item) => {
        x.push(new Date(item.time));
        y.push(item.value);
      });
    chartData.push({
      name: name,
      x: x,
      y: y,
      ...style,
      showLegend: false,
    });
  });

  return (
    <div>
      <Plot
        data={chartData}
        layout={{
          autosize: true,
          showlegend: false,
          dragmode: "pan",
        }}
        showLegend={false}
        config={{
          responsive: true,
          displaylogo: false,
          displayModeBar: true,
          scrollZoom: true,
        }}
        style={{ width: "100%", height: "500px" }}
      />
    </div>
  );
};
