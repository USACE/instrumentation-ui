import React, { useEffect, useState, useRef } from 'react';

import Dropdown from '../dropdown';
import { DropdownButton, FilterInput } from './subcomponents';
import { generateOption, reduceSelections } from './helper';

const MultiSelect = ({
  text = 'Select Options',
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
    console.log('opening!');
    if (dropdownRef && dropdownRef.current) {
      if (!isDropdownOpen) dropdownRef.current.openDropdown();
    }
  };

  const handleClose = () => {
    console.log('closing!');
    if (dropdownRef && dropdownRef.current) {
      if (isDropdownOpen) dropdownRef.current.closeDropdown();
    }
  };

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
            onChange={(val) => console.log('input changed! ', val)}
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
      {withSelectAllOption && (
        generateOption({ text: 'Select All' }, handleSelectAll, isAllSelected, 'all')
      )}
      {options.map((option, i) => {
        const optionIsSelected = currentSelections.find(elem => elem === option.value);
        const handleClick = () => setCurrentSelections(reduceSelections(option.value, currentSelections));

        return generateOption(option, handleClick, optionIsSelected, i);
      })}
    </Dropdown.Menu>
  );
};

export default MultiSelect;
