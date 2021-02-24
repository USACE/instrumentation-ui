import React, { useState, useEffect } from 'react';
import { connect } from 'redux-bundler-react';

export default connect(
  'selectDomainsItemsByGroup',
  ({ domainsItemsByGroup: domains }) => {
    const [statuses, setStatuses] = useState([]);

    useEffect(() => {
      const { status } = domains;
      const statusOrder = ['Active', 'Lost', 'Inactive', 'Abandoned', 'Destroyed'];
      if (domains && status) {
        const newStatuses = status.map(s => {
          const title = s.value[0].toUpperCase() + s.value.substr(1).toLowerCase();

          return {
            title,
            value: s.value,
            order: statusOrder.indexOf(title),
          };
        });
        newStatuses.sort((a, b) => (a.order > b.order ? 1 : -1));
        console.log(newStatuses);
        setStatuses(newStatuses);
      }
    }, [domains, setStatuses]);
    return (
      <div style={{ position: 'absolute', top: 10, right: 10 }}>
        <div className='card' style={{ opacity: 0.8 }}>
          <div className='card-body'>
            {statuses.map((x, i) => (
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
  }
);
