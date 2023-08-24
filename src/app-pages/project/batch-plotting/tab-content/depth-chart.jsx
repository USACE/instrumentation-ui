import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';
import { Slider } from '@mui/material';
import { DateTime } from 'luxon';

import Chart from '../../../../app-components/chart/chart';

const colors = [
  '#800000',
  '#000075',
  '#e6194B',
  '#3cb44b',
  '#911eb4',
  '#fabed4',
];

const formatData = (data = [], indexes = []) => {
  const inclinometerIds = Object.keys(data);
  if (!inclinometerIds.length) return {};

  const workingData = data[inclinometerIds[0]].inclinometers;

  const depthIncrements = workingData.map((datum, i) => {
    const { time, values } = datum;

    const valueDisplacement = values.sort((a, b) => b.nDepth - a.nDepth);

    return { time, valueDisplacement, colorIndex: i };
  }).sort((a, b) => DateTime.fromISO(a.time).toMillis() - DateTime.fromISO(b.time).toMillis());

  const relevantData = depthIncrements.slice(indexes[0], indexes[1] + 1);
  const dataArray = [];

  for (let i = 0; i < relevantData.length; i++) {
    const { valueDisplacement, time, colorIndex } = relevantData[i];

    dataArray.push(
      valueDisplacement.reduce((accum, current, ind) => {
        const { depth, aIncrement, bIncrement } = current;
    
        if (ind === 0) {
          accum.nDepth.push(depth);
          accum.aIncrement.push(aIncrement);
          accum.bIncrement.push(bIncrement);
          accum.time = DateTime.fromISO(time).toFormat('MMM dd, yyyy hh:mm:ss');
          accum.colorIndex = colorIndex;
        } else {
          accum.nDepth.push(depth);
          accum.aIncrement.push(accum.aIncrement[ind - 1] + aIncrement);
          accum.bIncrement.push(accum.bIncrement[ind - 1] + bIncrement);
          accum.time = DateTime.fromISO(time).toFormat('MMM dd, yyyy hh:mm:ss');
          accum.colorIndex = colorIndex;
        }
        
        return accum;
      }, {
        nDepth: [],
        aIncrement: [],
        bIncrement: [],
        time: '',
        colorIndex: '',
      })
    )
  }

  return { depthIncrements, dataArray, relevantData };
};

const build3dTraces = (dataArray, unit) => dataArray.map(data => (
  {
    x: data.aIncrement,
    y: data.bIncrement,
    z: data.nDepth,
    mode: 'markers+lines',
    marker: { size: 3, color: colors[data.colorIndex % colors.length] },
    line: { width: 1 },
    type: 'scatter3d',
    name: `${data.time} Cumulative Displacement (in ${unit})`,
  }

  // If client wants A and B Displacement on the 3-D plot, add these back in and adjust function to a forEach using push logic.
  // , {
  //   x: data.aIncrement,
  //   y: new Array(data.bIncrement.length).fill(0),
  //   z: data.nDepth,
  //   mode: 'markers+lines',
  //   marker: { size: 5, color: 'green' },
  //   type: 'scatter3d',
  //   name: `A Displacement (in ${unit})`,
  // }, {
  //   x: new Array(data.aIncrement.length).fill(0),
  //   y: data.bIncrement,
  //   z: data.nDepth,
  //   mode: 'markers+lines',
  //   marker: { size: 5, color: 'orange' },
  //   type: 'scatter3d',
  //   name: `B Displacement (in ${unit})`
  // }
));

const build2dTrace = (dataArray, key, unit) => dataArray.map(data => (
  {
    x: data[key],
    y: data.nDepth,
    mode: 'markers+lines',
    marker: { size: 5, color: colors[data.colorIndex % colors.length] },
    line: { width: 1 },
    type: 'scatter',
    name: `${key} Displacement (in ${unit})`,
    hovertemplate: `
      <b>${data.time}</b><br>
      Depth: %{y}<br>
      Measurement: %{x}<br>
      <extra></extra>
    `,
  }
));

const DepthChart = connect(
  'doFetchInclinometerMeasurementsByTimeseriesId',
  'selectCurrentInclinometerMeasurements',
  ({
    doFetchInclinometerMeasurementsByTimeseriesId,
    currentInclinometerMeasurements,
    inclinometerTimeseriesIds,
  }) => {
    const [sliderVal, setSliderVal] = useState([0, 0]);

    useEffect(() => {
      inclinometerTimeseriesIds.forEach(id => {
        doFetchInclinometerMeasurementsByTimeseriesId(id);
      });
    }, [inclinometerTimeseriesIds, doFetchInclinometerMeasurementsByTimeseriesId]);

    const inclinometerIds = Object.keys(currentInclinometerMeasurements || {});
    const isMetric = false;
    const unit = isMetric ? 'mm' : 'inches';
    const { dataArray = [], depthIncrements = [] } = formatData(currentInclinometerMeasurements, sliderVal, isMetric);

    const config = {
      repsonsive: true,
      displaylogo: false,
      displayModeBar: true,
      scrollZoom: true,
    };

    const layout3d = {
      autosize: true,
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
      showlegend: false,
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

    return inclinometerIds.length ? (
      <>
        <div className='row'>
          <div className='col-3'>
            <Chart
              data={build2dTrace(dataArray, 'aIncrement', unit)}
              layout={layoutTall('A')}
              config={config}
            />
          </div>
          <div className='col-3'>
            <Chart
              data={build2dTrace(dataArray, 'bIncrement', unit)}
              layout={layoutTall('B')}
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
              valueLabelFormat={(val) => <span>{DateTime.fromISO(depthIncrements[val]?.time).toFormat('MMM dd, yyyy hh:mm:ss')}</span>}
              onChange={(_e, newVal) => setSliderVal(newVal)}
            />
          </div>
        </div>
      </>
    ) : <span>Loading Chart Data....</span>;
  },
);

export default DepthChart;
