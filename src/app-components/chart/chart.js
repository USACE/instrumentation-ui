import React, { useRef, useEffect } from 'react';
import isEqual from 'lodash.isequal';

import Plotly from './minify-plotly';
import createPlotlyComponent from 'react-plotly.js/factory';

const Plot = createPlotlyComponent(Plotly);

const Chart = ({
  data = [],
  layout = {},
  frames = [],
  config = {},
  onUpdate,
}) => {
  const updateState = (figure) => {
    if (
      !isEqual(figure.layout, layout) ||
      !isEqual(figure.frames, frames) ||
      !isEqual(figure.data, data)
    ) {
      if (onUpdate && typeof onUpdate === 'function') onUpdate(figure);
    }
  };

  // resizing to the container as it moves
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

  // pull any annotations from series and add to layout
  layout.annotations = [];
  if (data && data.length) {
    data.forEach((series) => {
      if (series.hasOwnProperty('annotations'))
        layout.annotations = [...layout.annotations, ...series.annotations];
    });
  }

  return (
    <div ref={containerRef} style={{ height: '100%' }}>
      <Plot
        ref={plotRef}
        data={data}
        layout={layout}
        config={config}
        frames={frames}
        useResizeHandler
        style={{ width: '100%', height: '100%' }}
        onInitialized={updateState}
        onUpdate={updateState}
        onClick={(e) => {
          console.log(e);
        }}
      />
    </div>
  );
};

export default Chart;
