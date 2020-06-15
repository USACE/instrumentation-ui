import React from "react";
import Plot from "react-plotly.js";

export default ({ data, title }) => {
  if (!data) return null;

  const chartData = [];

  Object.keys(data).forEach((id) => {
    const { items } = data[id];
    if (!items || !items.length) return "no data to show";
    const x = [];
    const y = [];
    items.forEach((item) => {
      x.push(new Date(item.time));
      y.push(item.value);
    });
    chartData.push({ x, y });
  });

  console.log(chartData);

  return (
    <div>
      <Plot
        data={chartData}
        layout={{ title: title, autosize: true }}
        config={{ responsive: true }}
        style={{ width: "100%", height: "500px" }}
      />
    </div>
  );
};
