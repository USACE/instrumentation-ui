import React, { useEffect, useState } from 'react';

import Dropdown from './dropdown';
import usePrevious from '../customHooks/usePrevious';

const getDisplay = elem => {
  const { value, text } = elem;
  return text ? text : value;
};

/**
 * A component that provides the ability for a user to filter a dropdown list via an input field.
 * 
 * @param {Array} items - a list of items to populate the dropdown list with. Each item must be an object with the shape: `{value: '', text: ''}`
 * @param {string} placeholder - a string to be displayed in the input field when it is empty
 * @param {boolean} hasClearButton - whether or not there should be a button to clear the input field, default `false`
 * @param {Function} onChange - callback function that supplies the consumer with the filtered list, current input value, value of element if input matches an element
 * @param {string} className - a string of custom class(es) to be applied to the dropdown container
 */
const FilterSelect = ({
  items,
  placeholder = 'Filter...',
  hasClearButton = false,
  onChange = null,
  className,
  ...customProps
}) => {
  const [filteredList, setFilteredList] = useState(items);
  const [inputVal, setInputVal] = useState('');
  const previousVal = usePrevious(inputVal);

  useEffect(() => {
    if (inputVal !== previousVal) {
      const newSet = items.filter(elem => {
        const val = getDisplay(elem);

        return (val.toLowerCase()).indexOf(inputVal.toLowerCase()) !== -1;
      });

      setFilteredList(newSet);

      if (onChange) onChange(newSet, inputVal, (items.find(e => e.text === inputVal) || {}).value);
    }
  }, [inputVal, previousVal, items, onChange, setFilteredList]);

  return (
    <Dropdown.Menu
      className={[className]}
      customContent={(
        <div className='input-group' {...customProps}>
          <input
            className='form-control'
            placeholder={placeholder}
            onChange={(e) => setInputVal(e.target.value)}
            value={inputVal}
          />
          {hasClearButton && (
            <div className='input-group-append'>
              <span
                title='Clear Filter'
                className='input-group-text pointer'
                onClick={() => setInputVal('')}
              >
                <i className='mdi mdi-close'></i>
              </span>
            </div>
          )}
        </div>
      )}
    >
      {filteredList.length ? filteredList.map(elem => {
        const display = getDisplay(elem);

        return <Dropdown.Item key={display} onClick={() => setInputVal(display)}>{display}</Dropdown.Item>;
      }) : <Dropdown.Item key='No items' onClick={() => {}}>No Items Match Your Search</Dropdown.Item>}
    </Dropdown.Menu>
  );
};

export default FilterSelect;
