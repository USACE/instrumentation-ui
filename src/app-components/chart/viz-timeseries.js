import React, { useState, useEffect } from 'react';
import { connect } from 'redux-bundler-react';
import Accordion from '../accordion';

import Chart from './chart';

export default connect(
  'selectChartEditorTimeseriesData',
  'selectChartEditorLayout',
  'selectChartEditorConfig',
  'selectChartEditorShowRainfall',
  'selectChartEditorShowToday',
  ({
    chartEditorTimeseriesData: data,
    chartEditorLayout: layout,
    chartEditorConfig: config,
    chartEditorShowRainfall: showRainfall,
    chartEditorShowToday: showToday,
  }) => {
    const [finalLayout, setFinalLayout] = useState(layout);

    useEffect(() => {
      const workingLayout = Object.assign({}, layout);

      if (showRainfall) {
        workingLayout.grid = {
          rows: 2,
          columns: 1,
          subplots: [['xy'], ['xy2']],
          roworder: 'bottom to top',
        };
      }
      if (showToday) {
        workingLayout.shapes = [
          {
            type: 'rect',
            xref: 'x',
            yref: 'paper',
            x0: new Date(),
            y0: 0,
            x1: new Date(),
            y1: 1,
            opacity: 0.7,
            line: {
              width: 2,
              color: '#fc032c',
            },
          },
        ];
      } else {
        workingLayout.shapes = [];
      }

      setFinalLayout(workingLayout);
    }, [showRainfall, showToday]);

    return (
      <Accordion.List className='m-2'>
        {data.length ? (
          data.map((x) => (
            <Accordion.Item headingText={x.domainName} key={x.id}>
              <div style={{ height: '600px' }}>
                <Chart data={x.data} layout={finalLayout} config={config} />
              </div>
            </Accordion.Item>
          ))
        ) : (
          <Chart data={null} layout={finalLayout} config={config} />
        )}
      </Accordion.List>
    );
  }
);
