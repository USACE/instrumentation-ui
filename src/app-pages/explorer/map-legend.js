import React, { useState, useEffect } from 'react';
import { connect } from 'redux-bundler-react';

import Card from '../../app-components/card';

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
        setStatuses(newStatuses);
      }
    }, [domains, setStatuses]);

    return (
      <div style={{ position: 'absolute', top: 10, right: 10 }}>
        <Card style={{ opacity: 0.8 }}>
          <Card.Body>
            <h6><strong>Instrument Status</strong></h6>
            {statuses.map(x => (
              <p className='mb-2 ml-3' key={x.title}>
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
          </Card.Body>
        </Card>
      </div>
    );
  }
);
