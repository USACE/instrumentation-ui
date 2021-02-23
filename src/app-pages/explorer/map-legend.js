import React from 'react';

const status = [
  { title: 'Abandoned', value: 'abandoned', order: 4 },
  { title: 'Active', value: 'active', order: 1 },
  { title: 'Destroyed', value: 'destroyed', order: 5 },
  { title: 'Inactive', value: 'inactive', order: 3 },
  { title: 'Lost', value: 'lost', order: 2 }
];
const MapLegend = () => {
  status.sort((a, b) => a.order > b.order ? 1 : -1);
  return (
    <div style={{ position: 'absolute', top: 10, right: 10 }}>
      <div className='card' style={{ opacity: 0.8 }}>
        <div className='card-body'>
          {status.map((x, i) => (
            <p className='mb-2 mt-2' key={i}>
              <svg width='15' height='15' className='mr-2'>
                <circle
                  className={`legend-icon ${x.value}`}
                  cx='8'
                  cy='8'
                  r='5'
                />
              </svg>
              {x.title}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapLegend;
