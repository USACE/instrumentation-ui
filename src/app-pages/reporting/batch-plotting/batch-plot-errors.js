import React from 'react';

const BatchPlotErrors = ({
  chartData,
  plotConfig,
  timeseries,
}) => {
  const emptyDataSets = [];

  plotConfig?.timeseries_id?.forEach(el => {
    const found = chartData.find(data => data.timeseriesId === el);

    if (found?.x?.length) return;

    const ts = timeseries.find(data => data.id === el);
    const {instrument, name, unit } = ts;

    emptyDataSets.push(`${instrument} - ${name} (${unit})`);
  });


  return (
    emptyDataSets.length ? (
      <span className='text-danger px-2'>
        The following selected timeseries have no measurements for the given timeframe or settings:
        <ul>
          {emptyDataSets.map(el => (
            <li key={el}>{el}</li>
          ))}
        </ul>
      </span>
    ) : null
  );
};

export default BatchPlotErrors;
