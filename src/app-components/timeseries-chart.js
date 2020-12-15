/** NOTE What is this file? is it needed? */

// import React, { useRef, useEffect, useState } from "react";
// import Plot from "react-plotly.js";
// import isEqual from "lodash.isequal";

// export default ({ series = [], overrides = {}, onChange }) => {
//   const [layout, setLayout] = useState({
//     autosize: true,
//     showlegend: false,
//     dragmode: "pan",
//     yaxis: {
//       title: {
//         text: "Ft. NGVD88",
//       },
//     },
//     xaxis: {
//       autorange: true,
//     },
//     shapes: [],
//   });

//   const [config, setConfig] = useState({
//     responsive: true,
//     displaylogo: false,
//     displayModeBar: true,
//     scrollZoom: true,
//   });

//   const updateState = (figure) => {
//     setLayout(figure.layout);
//     setConfig(figure.config);
//     if (
//       figure &&
//       figure.layout &&
//       figure.layout.xaxis &&
//       figure.layout.xaxis.range &&
//       figure.layout.xaxis.range.length
//     ) {
//       const min = figure.layout.xaxis.range[0];
//       const max = figure.layout.xaxis.range[1];
//       if (min && max) {
//         if (xmin !== min || xmax !== max) {
//           doExploreChartSyncState(figure.layout.xaxis);
//         }
//       }
//     }
//   };

//   // resizing to the container as it moves
//   const containerRef = useRef(null);
//   const plotRef = useRef(null);
//   useEffect(() => {
//     if (!containerRef || !plotRef) return undefined;
//     const ro = new ResizeObserver(() => {
//       plotRef.current.resizeHandler();
//     });
//     ro.observe(containerRef.current);
//     return () => {
//       ro.disconnect();
//     };
//   }, [containerRef, plotRef]);

//   return (
//     <div ref={containerRef}>
//       <Plot
//         ref={plotRef}
//         data={series}
//         layout={layout}
//         config={config}
//         useResizeHandler
//         style={{ width: "100%", height: "100%" }}
//         onInitialized={updateState}
//         onUpdate={updateState}
//       />
//     </div>
//   );
// };
