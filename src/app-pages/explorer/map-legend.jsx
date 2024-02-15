import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';
import { Icon } from '@iconify/react';
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';

import Card from '../../app-components/card';
import { classArray } from '../../common/helpers/utils';

// TODO: Ability to filter the instrumnets displayed on the map by selecting one (or many) types/statuses

const STATUS_ORDER = ['Active', 'Lost', 'Inactive', 'Abandoned', 'Destroyed'];

const getLegendItemClasses = (allItems = [], currentItem) => {
  const isEmpty = allItems.length === 0;
  const contains = allItems.includes(currentItem);

  const classes = classArray([
    'mb-2',
    'ml-1',
    'pointer',
    !isEmpty && !contains ? 'inactive-item' : 'active-item',
  ]);

  return classes;
};

const displayInstrumentTypes = (legendTypes = [], currentTypes = [], onClick = () => {}) => (
  currentTypes?.map(type => {
    const { id, value, description: icon } = type;

    return (
      <p className={getLegendItemClasses(legendTypes, id)} title={value} key={id} onClick={() => onClick(type)}>
        {icon && <Icon icon={`mdi:${icon}`} />}
        <span className='ml-2'>{value}</span>
      </p>
    )
  })
);

export default connect(
  'selectDomainsItemsByGroup',
  'selectInstrumentsItems',
  ({
    domainsItemsByGroup: domains,
    instrumentsItems: instruments,
    legendFilters = {},
    setLegendFilters = () => {},
  }) => {
    const [isVisible, setIsVisible] = useState(true);
    const { status = [], instrument_type = [] } = domains || {};
    const { status: legendStatus = [], type: legendType = [] } = legendFilters || {};

    const statuses = status.map(s => {
      const title = s.value[0].toUpperCase() + s.value.substr(1).toLowerCase();

      return {
        title,
        value: s.value,
        order: STATUS_ORDER.indexOf(title),
      };
    }).sort((a, b) => (a.order > b.order ? 1 : -1));

    const currentTypes = instrument_type.filter(type => instruments.some(i => i.type_id === type.id));

    const toggleVisibleInstruments = (key, item, maxLength) => {
      if (key === 'status') {
        const { value } = item;

        setLegendFilters(prev => {
          const found = prev['status'].findIndex(el => el === value);

          if (found >= 0) {
            const clone = [...prev['status']];
            clone.splice(found, 1);
            return {
              ...prev,
              status: clone.length  === maxLength - 1 ? [value] : clone,
            };
          } else {
            return {
              ...prev,
              status: [...prev['status'], value],
            };
          };
        });
      } else if (key === 'type') {
        const { id } = item;

        setLegendFilters(prev => {
          const found = prev['type'].findIndex(el => el === id);
          if (found >= 0) {
            const clone = [...prev['type']];
            clone.splice(found, 1);
            return {
              ...prev,
              type: clone.length === maxLength - 1 ? [id] : clone,
            };
          } else {
            return {
              ...prev,
              type: [...prev['type'], id],
            };
          }
        });
      } else {
        // eslint-disable-next-line no-console
        console.log('Invalid Type. Skipping Execution of `toggleVisibleInstruments()`');
      }
    };

    return (
      <div style={{ position: 'absolute', right: 7, top: 7 }}>
        <Card style={{ opacity: 0.8 }}>
          <Card.Body>
            <span>
              <b>Map Legend</b>
              <IconButton
                className='ml-2'
                onClick={() => setIsVisible(prev => !prev)}
                title={isVisible ? 'Hide Legend' : 'Show Legend'}
              >
                {isVisible ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
              </IconButton>
            </span>
            {isVisible && (
              <>
                <hr />
                {statuses?.map(s => (
                  <p className={getLegendItemClasses(legendStatus, s.value)} title={s.title} key={s.title} onClick={() => toggleVisibleInstruments('status', s, statuses.length)}>
                    <svg width='15' height='15' className='mr-2'>
                      <circle
                        className={`legend-icon ${s.value}`}
                        cx='8'
                        cy='8'
                        r='5'
                      />
                    </svg>
                    {s.title}
                  </p>
                ))}
                {!!currentTypes?.length && (
                  <>
                    <hr />
                    {displayInstrumentTypes(legendType, currentTypes, (i) => toggleVisibleInstruments('type', i, currentTypes.length))}
                  </>
                )}
              </>
            )}
          </Card.Body>
        </Card>
      </div>
    );
  }
);
