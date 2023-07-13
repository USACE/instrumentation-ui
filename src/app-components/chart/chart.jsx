// @ts-nocheck
import React, { useRef, useEffect, useState } from 'react';
import isEqual from 'lodash.isequal';

import Plotly from './minify-plotly';
import createPlotlyComponent from 'react-plotly.js/factory';
import { classArray } from '../../common/helpers/utils';

const Overlay = () => {
  const [isEnabled, setIsEnabled] = useState(true);

  const classes = classArray([
    'chart-overlay',
    isEnabled && 'enabled',
  ]);

  return (
    <div className={classes} onClick={() => setIsEnabled(false)}>
      <span className='overlay-text'>Click to Enable Interactions</span>
    </div>
  );
};

const Plot = createPlotlyComponent(Plotly);

const Chart = ({
  data = [],
  layout = {},
  frames = [],
  config = {},
  onUpdate = (_figure) => {},
  withOverlay = false,
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
      plotRef?.current?.resizeHandler();
    });
    ro.observe(containerRef.current);

    return () => ro.disconnect();
  }, [containerRef, plotRef]);

  // pull any annotations from series and add to layout
  layout.annotations = [];
  if (data && data.length) {
    data.forEach((series) => {
      if (series && series.hasOwnProperty('annotations'))
        layout.annotations = [...layout.annotations, ...series.annotations];
    });
  }

  return (
    <div ref={containerRef} style={{ height: '100%', position: 'relative' }}>
      {withOverlay && <Overlay />}
      <Plot
        useResizeHandler
        ref={plotRef}
        data={data}
        layout={layout}
        config={config}
        frames={frames}
        style={{ width: '100%', height: '100%' }}
        onInitialized={updateState}
        onUpdate={updateState}
        onClick={(e) => console.log(e)}
      />
    </div>
  );
};

export default Chart;
