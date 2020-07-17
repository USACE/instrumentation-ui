import React from "react";
import { connect } from "redux-bundler-react";
import Chart from "./chart";

export default connect(
  "selectChartEditorTimeseriesData",
  "selectChartEditorLayout",
  "selectChartEditorConfig",
  "selectChartEditorShowRainfall",
  "selectChartEditorShowToday",
  ({
    chartEditorTimeseriesData: data,
    chartEditorLayout: layout,
    chartEditorConfig: config,
    chartEditorShowRainfall: showRainfall,
    chartEditorShowToday: showToday,
  }) => {
    // if we want to show rainfall then create a multi-plot
    if (showRainfall) {
      layout.grid = {
        rows: 2,
        columns: 1,
        subplots: [["xy"], ["xy2"]],
        roworder: "bottom to top",
      };
    }
    if (showToday) {
      layout.shapes = [
        {
          type: "rect",
          xref: "x",
          yref: "paper",
          x0: new Date(),
          y0: 0,
          x1: new Date(),
          y1: 1,
          opacity: 0.7,
          line: {
            width: 2,
            color: "#fc032c",
          },
        },
      ];
    } else {
      layout.shapes = [];
    }
    return <Chart data={data} layout={layout} config={config} />;
  }
);
