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

export const generateNewChartData = (measurements, timeseries, chartSettings) => {
  const { show_comments, show_masked, show_nonvalidated } = chartSettings || {};

  if (measurements.length && timeseries.length) {
    const data = measurements.map((elem, index) => {
      if (elem && timeseries.length) {
        const { items, timeseries_id } = elem;
        const {
          instrument,
          name,
          unit,
          parameter,
        } = timeseries.find(t => t.id === timeseries_id);

        const filteredItems = items.filter(item => {
          const { masked, validated } = item;

          if (show_masked && show_nonvalidated) return true;
          if (show_masked && !validated) return false;
          else if (show_masked && validated) return true;

          if (show_nonvalidated && masked) return false;
          else if (show_nonvalidated && !masked) return true;

          if (masked || !validated) return false;
          return true;
        }).sort((a, b) => new Date(a.time) - new Date(b.time));

        const { x, y, hovertext } = filteredItems.reduce(
          (accum, item) => ({
            x: [...accum.x, item.time],
            y: [...accum.y, item.value],
            hovertext: [...accum.hovertext, item.annotation],
          }),
          { x: [], y: [], hovertext: [] }
        );

        return parameter === 'precipitation'
          ? {
            x: x,
            y: y,
            type: 'bar',
            yaxis: 'y2',
            name: `${instrument} - ${name} (${unit})` || '',
            hovertext: show_comments ? hovertext : [],
            hoverinfo: 'x+y+text',
            showlegend: true,
          }
          : {
            ...getStyle(index),
            x: x,
            y: y,
            name: `${instrument} - ${name} (${unit})` || '',
            showlegend: true,
            hovertext: show_comments ? hovertext : [],
            hoverinfo: 'x+y+text'
          };
      }
    }).filter(e => e);

    return data;
  }

  return [];
};


/*

Could instead check for first date that is above the lower range and splice out all lower
and check for first data lower than upper range and splice all higher

assumption: sorted by dates

*/
export const limitDatabyDateRange = (datedData = [], dateRange) => {
  if (datedData[0] && datedData[0].x && datedData[0].y) {
    for (let i = 0; i < datedData[0].x.length; i++) {
      const tempDate = new Date(datedData[0].x[i]);
      if (tempDate > dateRange[1] || tempDate < dateRange[0]) {
        datedData[0].x.splice(i, 1);
        datedData[0].y.splice(i, 1);
        i--;
      }
    }
  }

  return datedData;
};
