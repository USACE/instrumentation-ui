import React, { useState } from "react";
import Plot from "react-plotly.js";
import { AgGridReact } from "ag-grid-react";
import { classnames } from "../../utils";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import "ag-grid-community/dist/styles/ag-theme-balham-dark.css";
import "ag-grid-community/dist/styles/ag-theme-fresh.css";

export default ({ data, title }) => {
  if (!data) return null;
  const [showPlot, setShowPlot] = useState(true);

  const iconClass = classnames({
    mdi: true,
    "mdi-table-large": showPlot,
    "mdi-chart-line": !showPlot,
  });

  const { items } = data;
  if (!items || !items.length) return "no data to show";
  const chartData = [
    {
      x: [],
      y: [],
    },
  ];
  items
    .sort((a, b) => {
      if (a.time > b.time) return 1;
      if (a.time < b.time) return -1;
      return 0;
    })
    .forEach((item) => {
      chartData[0].x.push(new Date(item.time));
      chartData[0].y.push(item.value);
    });

  const keys = Object.keys(items[0]);
  const columnDefs = [
    { headerName: "", valueGetter: "node.rowIndex + 1", width: 40 },
    ...keys.map((key) => {
      return {
        headerName: key.toUpperCase(),
        field: key,
        resizable: true,
        sortable: false,
        filter: true,
        editable: false,
      };
    }),
  ];

  return (
    <div>
      <div className="level">
        <div className="level-left"></div>
        <div className="level-right">
          <button
            className="button is-info level-item"
            onClick={() => {
              setShowPlot(!showPlot);
            }}
          >
            <i className={iconClass}></i>
          </button>
        </div>
      </div>
      <div>
        {showPlot ? (
          <Plot
            data={chartData}
            layout={{
              autosize: true,
              showlegend: false,
              dragmode: "pan",
              shapes: [
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
              ],
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
        ) : (
          <div
            className="ag-theme-balham"
            style={{
              height: `500px`,
              width: "100%",
            }}
          >
            <AgGridReact
              columnDefs={columnDefs}
              rowData={items}
              enableCellChangeFlash={true}
            ></AgGridReact>
          </div>
        )}
      </div>
    </div>
  );
};
