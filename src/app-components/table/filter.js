import React from 'react';
import Select from 'react-select';

// import Icon from '../icon';

const ValueContainer = ({ children, getValue, ...props }) => {
  var length = getValue().length;

  return (
    <i {...props} style={{ minWidth: '100px', paddingLeft: '5px' }}>
      {!props.selectProps.menuIsOpen &&
        `${length} selected`}
      {React.cloneElement(children[1])}
    </i>
  );
};

const Filter = ({ table, column }) => {
  const { columnDef, getFilterValue } = column;

  const columnFilterValue = getFilterValue();

  return (
    <Select
      isMulti
      allowSelectAll
      hideSelectedOptions={false}
      closeMenuOnSelect={false}
      className='d-inline-block pl-3'
      styles={{
        control: (baseStyles) => ({
          ...baseStyles,
          color: '#555',
          fontWeight: 300,
        }),
        menu: (baseStyles) => ({
          ...baseStyles,
          fontWeight: 300,
        }),
      }}
      options={columnDef.filterOptions}
      defaultValue={columnDef.filterOptions}
      components={{ ValueContainer }}
      // onChange={val => column.setFilterValue(val[0])}
    />
  );
};

export default Filter;
