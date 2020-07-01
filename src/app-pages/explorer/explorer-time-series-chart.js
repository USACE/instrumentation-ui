import React, { useRef, useEffect, useState } from "react";
import { connect } from "redux-bundler-react";
import Plot from "react-plotly.js";

export default connect(
  "doExploreChartSyncState",
  "selectExploreChartSyncXmin",
  "selectExploreChartSyncXmax",
  ({
    data,
    doExploreChartSyncState,
    exploreChartSyncXmin: xmin,
    exploreChartSyncXmax: xmax,
  }) => {
    if (!data) return null;

    const [layout, setLayout] = useState({
      autosize: true,
      showlegend: false,
      dragmode: "pan",
      yaxis: {
        title: {
          text: "Ft. NGVD88",
        },
      },
      xaxis: {
        autorange: true,
      },
      shapes: [],
    });

    const [config, setConfig] = useState({
      responsive: true,
      displaylogo: false,
      displayModeBar: true,
      scrollZoom: true,
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
            doExploreChartSyncState(figure.layout.xaxis);
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
      });
    });

    return (
      <div ref={containerRef}>
        <Plot
          displaylogo={false}
          data={chartData}
          layout={layout}
          config={config}
          ref={plotRef}
          useResizeHandler
          style={{ width: "100%", height: "500px" }}
          onInitialized={updateState}
          onUpdate={updateState}
        />
      </div>
    );
  }
);
