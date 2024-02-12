import React from 'react';
import { connect } from 'redux-bundler-react';
import { Icon } from '@iconify/react';

import Card from '../../app-components/card';

// TODO: FIX THIS!
// Update icons on map to be symbols. use api response: "instrument-type" domain
// Ability to filter the instrumnets displayed on the map by selecting one (or many) types/statuses

const STATUS_ORDER = ['Active', 'Lost', 'Inactive', 'Abandoned', 'Destroyed'];

const displayInstrumentTypes = (types, instruments) => {
  const currentTypes = types.filter(type => instruments.some(i => i.type_id === type.id));

  console.log('test types: ', types);

  return currentTypes?.map(type => {
    const { type_id, value, description: icon } = type;

    return (
      <p className='mb-1 ml-3' key={type_id}>
        {icon && <Icon icon={`mdi:${icon}`} />}
        <span className='ml-2'>{value}</span>
      </p>
    )
  });
};

export default connect(
  'selectDomainsItemsByGroup',
  'selectInstrumentsItems',
  ({
    domainsItemsByGroup: domains,
    instrumentsItems: instruments,
  }) => {
    const { status = [], instrument_type = [] } = domains || {};

    const statuses = status.map(s => {
      const title = s.value[0].toUpperCase() + s.value.substr(1).toLowerCase();

      return {
        title,
        value: s.value,
        order: STATUS_ORDER.indexOf(title),
      };
    }).sort((a, b) => (a.order > b.order ? 1 : -1));


    return (
      <div style={{ position: 'absolute', top: 10, right: 10 }}>
        <Card style={{ opacity: 0.8 }}>
          <Card.Body>
            <h6><strong>Map Legend</strong></h6>
            {statuses?.map(x => (
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
            {!!instrument_type?.length && (
              <>
                <hr />
                {displayInstrumentTypes(instrument_type, instruments)}
              </>
            )}
          </Card.Body>
        </Card>
      </div>
    );
  }
);
