import React, { useEffect, useState } from 'react';
import { Slider } from '@mui/material';

import Chart from '../../../../app-components/chart/chart';
import testDepthChartData from './testDepthChartData';

const formatData = (data = [], displayedTime, isMetric = false) => {
  const constant = isMetric ? 25000 : 20000;
  const wheelspan = isMetric ? 500 : 24;

  const depthIncrements = data.map(datum => {
    const { time, values } = datum;

    const valueDisplacement = values.map(val => {
      const { a0, a180, b0, b180, depth } = val;
      const nDepth = Number(depth);
      // const aChecksum = a0 + a180;
      // const aChecksum = b0 + b180;
      const aCombined = (a0 - a180)/2;
      const bCombined = (b0 - b180)/2;
      const aIncrement = (aCombined / constant) * wheelspan;
      const bIncrement = (bCombined / constant) * wheelspan;

      return { nDepth, aIncrement, bIncrement };
    });

    return { time, valueDisplacement };
  });

  const atCurrentTimeIncrements = depthIncrements.find(el => el.time === displayedTime);
  const { valueDisplacement } = atCurrentTimeIncrements;
  const orderByDepth = valueDisplacement.sort((a, b) => b.nDepth - a.nDepth);

  const dataArray = orderByDepth.reduce((accum, current, ind) => {
    const { nDepth, aIncrement, bIncrement } = current;

    if (ind === 0) {
      accum.nDepth.push(nDepth);
      accum.aIncrement.push(aIncrement);
      accum.bIncrement.push(bIncrement);
    } else {
      accum.nDepth.push(nDepth);
      accum.aIncrement.push(accum.aIncrement[ind - 1] + aIncrement);
      accum.bIncrement.push(accum.bIncrement[ind - 1] + bIncrement);
    }
    
    return accum;
  }, {
    nDepth: [],
    aIncrement: [],
    bIncrement: [],
  });

  return { depthIncrements, dataArray };
};

const build3dTraces = (data, unit) => (
  [{
    x: data.aIncrement,
    y: data.bIncrement,
    z: data.nDepth,
    mode: 'markers+lines',
    marker: { size: 5, color: 'blue' },
    type: 'scatter3d',
    name: `Cumulative Displacement (in ${unit})`,
  }, {
    x: data.aIncrement,
    y: new Array(data.bIncrement.length).fill(0),
    z: data.nDepth,
    mode: 'markers+lines',
    marker: { size: 5, color: 'green' },
    type: 'scatter3d',
    name: `A Displacement (in ${unit})`,
  }, {
    x: new Array(data.aIncrement.length).fill(0),
    y: data.bIncrement,
    z: data.nDepth,
    mode: 'markers+lines',
    marker: { size: 5, color: 'orange' },
    type: 'scatter3d',
    name: `B Displacement (in ${unit})`
  }]
);

const build2dTrace = (data, key, unit) => (
  [{
    x: data[key],
    y: data.nDepth,
    mode: 'markers+lines',
    marker: { size: 10, color: key === 'aIncrement' ? 'green' : 'orange' },
    type: 'scatter',
    name: `${key} Displacement (in ${unit})`,
  }]
);

const DepthChart = () => {
  const [time, setTime] = useState('6/21/2021');
  const [sliderVal, setSliderVal] = useState(0);
  const displacementConstant = { x: -44.5242, y: 65.123 };
  const isMetric = false;
  const unit = isMetric ? 'mm' : 'inches';
  const { dataArray, depthIncrements = [] } = formatData(testDepthChartData, time, isMetric);

  const config = {
    repsonsive: true,
    displaylogo: false,
    displayModeBar: true,
    scrollZoom: true,
  };

  const layout3d = {
    autosize: true,
    title: 'Depth Plots',
    height: 800,
    scene: {
      xaxis: { title: `A-Displacement (in ${unit})` },
      yaxis: { title: `B-Displacement (in ${unit})` },
      zaxis: { title: 'Depth', autorange: 'reversed' },
    },
    legend: {
      'orientation': 'h',
    },
  };

  const layoutTall = (key) => ({
    autosize: true,
    height: 800,
    yaxis: {
      autorange: 'reversed',
      title: `Depth in Feet`,
    }, 
    xaxis: {
      title: `${key}-Displacement in ${unit}`,
    },
  });

  const incrementData = build3dTraces(dataArray, unit);

  useEffect(() => {
    setTime(depthIncrements[sliderVal]?.time);
  }, [setTime, sliderVal]);

  return (
    <>
      <div className='row'>
        <div className='col-3'>
          <Chart
            data={build2dTrace(dataArray, 'aIncrement', unit)}
            layout={layoutTall('A')}
            config={config}
          />
        </div>
        <div className='col-6'>
          <Chart
            data={incrementData}
            config={config}
            layout={layout3d}
          />
        </div>
        <div className='col-3'>
          <Chart
            data={build2dTrace(dataArray, 'bIncrement', unit)}
            layout={layoutTall('B')}
            config={config}
          />
        </div>
      </div>
      <div className='row'>
        <div className='col-10 offset-1'>
          <Slider
            aria-label='depth plot time slider'
            valueLabelDisplay='auto'
            min={0}
            max={depthIncrements.length - 1}
            step={1}
            value={sliderVal}
            valueLabelFormat={(_val, _index) => <span>{time}</span>}
            onChange={(_e, newVal) => setSliderVal(newVal)}
          />
        </div>
      </div>
    </>
  );
};

export default DepthChart;
