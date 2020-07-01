import React, { useRef, useEffect, useState } from "react";
import { connect } from "redux-bundler-react";
import Plot from "react-plotly.js";

export default connect(
  "doExploreChartSyncState",
  "selectExploreChartSyncXmin",
  "selectExploreChartSyncXmax",
  "selectApiRoot",
  ({
    doExploreChartSyncState,
    exploreChartSyncXmin: xmin,
    exploreChartSyncXmax: xmax,
    apiRoot,
  }) => {
    const [data, setData] = useState([]);
    useEffect(() => {
      if (data.length) return undefined;
      const tsId =
        process.env.NODE_ENV === "development"
          ? "05ddb512-b865-433d-b2db-81e75bb69b65"
          : "9a3864a8-8766-4bfa-bad1-0328b166f6a8";
      fetch(
        `${apiRoot}/timeseries/${tsId}/measurements?after=1900-01-01T00:00:00.00Z&before=2025-01-01T00:00:00.00Z`
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setData(data.items);
        });
    });

    const [layout, setLayout] = useState({
      title: "Rainfall",
      autosize: true,
      showlegend: false,
      dragmode: "pan",
      yaxis: {
        title: {
          text: "Inches",
        },
        autorange: "reversed",
        range: [100, 0],
      },
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
    });

    const [config, setConfig] = useState({
      responsive: true,
      displaylogo: false,
      displayModeBar: true,
    });

    const updateState = (figure) => {
      setLayout(figure.layout);
      setConfig(figure.config);
      if (
        figure &&
        figure.layout &&
        figure.layout.xaxis &&
        figure.layout.xaxis.range &&
        figure.layout.xaxis.range.length
      ) {
        const min = figure.layout.xaxis.range[0];
        const max = figure.layout.xaxis.range[1];
        if (min && max) {
          if (xmin !== min || xmax !== max) {
            //doExploreChartSyncState(figure.layout.xaxis);
          }
        }
      }
    };

    if (!layout.hasOwnProperty("xaxis")) layout.xaxis = {};
    if (!layout.xaxis.hasOwnProperty("range")) layout.range = [];
    layout.xaxis.range = [xmin, xmax];

    const containerRef = useRef(null);
    const plotRef = useRef(null);

    useEffect(() => {
      if (!containerRef || !plotRef) return undefined;
      const ro = new ResizeObserver(() => {
        plotRef.current.resizeHandler();
      });
      ro.observe(containerRef.current);
      return () => {
        ro.disconnect();
      };
    }, [containerRef, plotRef]);

    const chartData = [];

    if (data.length) {
      const series = {
        name: "Precip",
        type: "bar",
        x: [],
        y: [],
        line: {
          color: "#0062ff",
        },
      };
      data
        .sort((a, b) => {
          if (a.time > b.time) return 1;
          if (a.time < b.time) return -1;
          return 0;
        })
        .forEach((item) => {
          series.x.push(new Date(item.time));
          series.y.push(item.value);
        });
      chartData.push(series);
    }

    return (
      <div ref={containerRef}>
        <Plot
          title="Rainfall"
          data={chartData}
          layout={layout}
          config={config}
          ref={plotRef}
          useResizeHandler
          style={{ width: "100%", height: "300px" }}
          onInitialized={updateState}
          onUpdate={updateState}
        />
      </div>
    );
  }
);
