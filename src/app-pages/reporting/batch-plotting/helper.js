const getStyle = (_index) => ({
  type: 'scatter',
  mode: 'lines+markers',
  marker: {
    size: 8,
  },
  line: {
    width: 2,
  },
});

export const generateNewChartData = (measurements, chartSettings) => {
  const { show_comments, show_masked, show_nonvalidated } = chartSettings || {};

  console.log('test measurements: ', measurements);

  const data = measurements.map(el => el);
};

// TODO: the commented line is correct but causes errors in functionality below. Rework this entire function.
// export const generateNewChartData = () => {
//   const { show_comments, show_masked, show_nonvalidated } = chartSettings || {};

//   const data = measurements
//     .map((elem, i) => {
//       if (elem && instrumentTimeseriesItemsByRoute.length) {
//         const style = getStyle(i);
//         const { items, timeseries_id } = elem;
//         const {
//           instrument,
//           name,
//           unit,
//           parameter,
//         } = instrumentTimeseriesItemsByRoute.find(i => i.id === timeseries_id);

//         const filteredItems = (items || []).filter(el => {
//           if ((show_masked && el?.masked) || (show_nonvalidated && !el?.validated)) return true;
//           else if (!el?.masked || el?.validated) return true;
//           // else if (!el?.masked && el?.validated) return true;

//           return false;
//         });

//         const sortedItems = filteredItems
//           .slice()
//           .sort((a, b) => new Date(a.time) - new Date(b.time));

//         const { x, y, hovertext } = sortedItems.reduce(
//           (accum, item) => ({
//             x: [...accum.x, item.time],
//             y: [...accum.y, item.value],
//             hovertext: [...accum.hovertext, item.annotation],
//           }),
//           { x: [], y: [], hovertext: [] }
//         );

//         return parameter === 'precipitation'
//           ? {
//             x,
//             y,
//             type: 'bar',
//             yaxis: 'y2',
//             name: `${instrument} - ${name} (${unit})` || '',
//             hovertext: show_comments ? hovertext : [],
//             hoverinfo: 'x+y+text',
//             showlegend: true,
//           }
//           : {
//             ...style,
//             x,
//             y,
//             name: `${instrument} - ${name} (${unit})` || '',
//             showlegend: true,
//             hovertext: show_comments ? hovertext : [],
//             hoverinfo: 'x+y+text'
//           };
//       }
//     })
//     .filter(e => e);
  
//   const datedData = data;

//   // optimize
//   if (datedData[0] && datedData[0].x && datedData[0].y) {
//     setLifetimeDate(datedData[0].x[0]);
//     for (let i = 0; i < datedData[0].x.length; i++) {
//       const tempDate = new Date(datedData[0].x[i]);
//       if (tempDate > dateRange[1] || tempDate < dateRange[0]) {
//         datedData[0].x.splice(i, 1);
//         datedData[0].y.splice(i, 1);
//         i--;
//       }
//     }
//   }
//   setChartData(datedData);
// };
