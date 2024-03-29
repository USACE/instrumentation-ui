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
      data.length ? (
        <Accordion.List className='m-2'>
          {data.map(x => (
            <Accordion.Item headingText={`${x.domainName} (in ${x.unitName})`} key={x.id}>
              <div style={{ height: x.data[0].isInclinometer ? '800px' : '600px' }}>
                {x.data[0].isInclinometer
                  ? <Chart data={x.data} config={config} />
                  : <Chart data={x.data} layout={finalLayout} config={config} />
                }
              </div>
            </Accordion.Item>
          ))}
        </Accordion.List>
      ) : (
        <i className='mt-2 ml-3'>
          No data to be shown for selected instrument(s).
        </i>
      )
    );
  }
);
