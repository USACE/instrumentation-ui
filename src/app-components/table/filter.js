import React, { cloneElement } from 'react';
import Select from 'react-select';

import Icon from '../icon';

const ValueContainer = ({ children, getValue }) => {
  const length = getValue().length;

  return (
    <span className='text-info' style={{ minWidth: '70px', paddingLeft: '10px' }}>
      <span><Icon icon='filter' /> ({length})</span>
      {cloneElement(children[1])}
    </span>
  );
};

const Filter = ({ column }) => {
  const { columnDef } = column;

  return (
    <Select
      isMulti
      allowSelectAll={true}
      isSearchable={false}
      isClearable={false}
      hideSelectedOptions={false}
      closeMenuOnSelect={false}
      className='d-inline-block pl-3'
      styles={{
        control: (baseStyles) => ({
          ...baseStyles,
          cursor: 'pointer',
          color: '#555',
          fontWeight: 300,
          borderColor: '#3498DB !important',
        }),
        menu: (baseStyles) => ({
          ...baseStyles,
          fontWeight: 300,
          overflow: 'visible',
        }),
        dropdownIndicator: (baseStyles) => ({
          ...baseStyles,
          color: '#3498DB !important',
        }),
      }}
      options={columnDef.filterOptions}
      defaultValue={columnDef.filterOptions}
      components={{ ValueContainer }}
      onChange={val => {
        column.setFilterValue(val);
      }}
    />
  );
};

export default Filter;
