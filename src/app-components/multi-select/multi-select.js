import React, { useEffect, useState, useRef } from 'react';

import Dropdown from '../dropdown';
import { DropdownButton, FilterInput } from './subcomponents';
import { generateOption, reduceSelections } from './helper';
import usePrevious from '../../customHooks/usePrevious';

const getDisplay = elem => {
  const { value, text } = elem;
  return text ? text : value;
};

const MultiSelect = ({
  text = 'Select Options ',
  className = '',
  menuClasses = '',
  onChange = () => {},
  options = [],
  withSelectAllOption = false,
  initialValues = [],
  isFilterable = false,
}) => {
  const [currentSelections, setCurrentSelections] = useState(initialValues);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [inputValue, setInputValue] = useState('');
  const previuosInputValue = usePrevious(inputValue);
  const dropdownRef = useRef();
  const inputRef = useRef();

  const handleSelectAll = () => {
    if (isAllSelected) {
      setCurrentSelections([]);
    } else {
      setCurrentSelections(options.map(elem => elem.value));
    }
  };

  const handleOpen = () => {
    if (dropdownRef && dropdownRef.current) {
      if (!isDropdownOpen) dropdownRef.current.openDropdown();
    }
  };

  const handleClose = () => {
    if (dropdownRef && dropdownRef.current) {
      if (isDropdownOpen) dropdownRef.current.closeDropdown();
    }
  };

  /** Execute callback when new values are selected and check if all were selected to update the UI (if necessary) */
  useEffect(() => {
    if (onChange && typeof onChange === 'function') onChange(currentSelections);
    if (withSelectAllOption) {
      if (currentSelections.length === options.length) {
        setIsAllSelected(true);
      } else {
        setIsAllSelected(false);
      }
    }
  }, [onChange, currentSelections, withSelectAllOption, setIsAllSelected]);

  /** Update dropdown list of item when input component value changes. Only runs if `isFilterable` is true. */
  useEffect(() => {
    if (isFilterable) {
      if (previuosInputValue !== inputValue) {
        const newSet = options.filter(elem => {
          const val = getDisplay(elem);
  
          return (String(val).toLowerCase()).indexOf(inputValue.toLowerCase()) !== -1;
        });
  
        setFilteredOptions(newSet);
      }
    }
  }, [isFilterable, previuosInputValue, inputValue]);

  return (
    <Dropdown.Menu
      ref={dropdownRef}
      customContent={(
        <>
          <DropdownButton
            handleClick={handleOpen}
            text={text}
            isHidden={isFilterable && isDropdownOpen}
          />
          <FilterInput
            onChange={val => setInputValue(val)}
            handleClose={handleClose}
            isHidden={!isFilterable || (isFilterable && !isDropdownOpen)}
            ref={inputRef}
          />
        </>
      )}
      dropdownClasses={[className]}
      menuClasses={[menuClasses]}
      closeOnSelect={false}
      onToggle={isOpen => setIsDropdownOpen(isOpen)}
      containerRefs={[inputRef]}
      customElementProps={{
        onClick: () => {},
      }}
    >
      {filteredOptions.length ? (
        <>
          {withSelectAllOption && (
            generateOption({ text: 'Select All' }, handleSelectAll, isAllSelected, 'all')
          )}
          {filteredOptions.map((option, i) => {
            const optionIsSelected = currentSelections.find(elem => elem === option.value);
            const handleClick = () => setCurrentSelections(reduceSelections(option.value, currentSelections));

            return generateOption(option, handleClick, optionIsSelected, i);
          })}
        </>
      ) : (
        <p className='text-dark mx-3 my-1'>
          {isFilterable ? 'No Items Match Your Search' : 'No Options Provided'}
        </p>
      )}
    </Dropdown.Menu>
  );
};

export default MultiSelect;
