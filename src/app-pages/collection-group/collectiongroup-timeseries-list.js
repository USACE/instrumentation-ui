import React, { useState } from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';

import Button from '../../app-components/button';
import Icon from '../../app-components/icon';
import RoleFilter from '../../app-components/role-filter';

const TimeseriesListEntry = ({
  handleItemSaveValue,
  handleItemDelete,
  handleLocalTimeseriesOrderChange,
  item,
}) => {
  const [value, setValue] = useState('');

  return (
    // Flex Wrapper
    <div className='d-flex flex-row list-group-item border-0 bg-light my-1'>
      {/* Column 1 */}
      <div className='d-flex flex-row' style={{ minWidth: '350px' }}>
        <div className='d-flex flex-column my-2'>
          <div className='h5 mb-1'>
            <a href={`/${item.project_slug}/instruments/${item.instrument_slug}`}>
              {item.instrument}
            </a>
          </div>
          <div className='h6'>
            {item.name}
            <small className='ml-2 text-uppercase text-secondary'>
              | {item.unit}
            </small>
          </div>
        </div>
      </div>

      {/* Column 2 (Latest Value) */}
      <div className='d-flex flex-row w-100 justify-content-between align-items-center'>
        <div className='d-flex flex-column justify-content-center align-items-left'>
          <div className='h5 mb-0'>
            {item.latest_value}
            <small className='ml-2 text-uppercase text-secondary'>
              {item.unit}
            </small>
          </div>
          <div className='text-secondary font-weight-light font-italic'>
            {item.latest_time ? formatDistanceToNow(parseISO(item.latest_time)) + ' ago' : 'No Data Found'}
          </div>
        </div>
        {/* column 2 buttons */}
        <div className='d-flex flex-row justify-content-between align-items-center'>
          <RoleFilter allowRoles={[`${item.project_slug.toUpperCase()}.*`]}>
            <Button
              variant='link'
              className='text-secondary h-50'
              handleClick={() => handleItemDelete(item)}
              icon={<Icon icon='delete-outline' className='text-danger' />}
              title='Remove from group'
            />
            <Button
              variant='link'
              className='text-secondary h-50'
              handleClick={() => handleLocalTimeseriesOrderChange(item, '++')}
              icon={<Icon icon='chevron-double-up' />}
              title='Increase order to first'
            />
            <Button
              variant='link'
              className='text-secondary h-50'
              handleClick={() => handleLocalTimeseriesOrderChange(item, '+')}
              icon={<Icon icon='chevron-up' />}
              title='Increase order by 1'
            />
            <Button
              variant='link'
              className='text-secondary h-50'
              handleClick={() => handleLocalTimeseriesOrderChange(item, '-')}
              icon={<Icon icon='chevron-down' />}
              title='Decrease order by 1'
            />
            <Button
              variant='link'
              className='text-secondary h-50'
              handleClick={() => handleLocalTimeseriesOrderChange(item, '--')}
              icon={<Icon icon='chevron-double-down' />}
              title='Decrease order to last'
            />
          </RoleFilter>
        </div>
        {/* Column 3 */}
        <div className='d-flex flex-row'>
          <div className='input-group'>
            <input
              type='number'
              value={value}
              className='form-control'
              placeholder='Enter value...'
              onChange={(e) => setValue(e.target.value)}
            />
            <div className='input-group-append'>
              <Button
                variant='secondary'
                handleClick={() => {
                  handleItemSaveValue(item, value);
                  setValue('');
                }}
                text='Add'
                icon={<Icon icon='mdi-plus' />}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CollectionGroupTimeseriesList = ({
  items,
  handleItemDelete,
  handleItemSaveValue,
  localTimeseriesOrder,
  handleLocalTimeseriesOrderChange,
}) => (
  <div className='w-100 list-group'>
    {items.sort((a, b) =>
      (a.list_order === null) - (b.list_order === null) || a - b
    )
      .map((item, idx) => (
        <TimeseriesListEntry
          key={idx}
          item={item}
          handleItemDelete={handleItemDelete}
          handleItemSaveValue={handleItemSaveValue}
          handleLocalTimeseriesOrderChange={handleLocalTimeseriesOrderChange}
        />
      ))}
  </div>
);

export default CollectionGroupTimeseriesList;
