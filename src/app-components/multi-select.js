import React, { useEffect, useState } from 'react';

import Dropdown from './dropdown';

const reduceSelections = (selection, currentSelections) => {
  const final = [...currentSelections];
  const idx = currentSelections.findIndex(elem => elem === selection);

  idx < 0 ? final.push(selection) : final.splice(idx, 1);

  return final;
};

const generateOption = (option, handleClick, optionIsSelected, i) => {
  const icon = optionIsSelected ? 'mdi-check-box-outline' : 'mdi-checkbox-blank-outline';

  return (
    <Dropdown.Item key={i} onClick={(_e) => handleClick()}>
      <span className={optionIsSelected ? 'text-info' : 'text-dark'}>
        <i className={`mdi ${icon}`}/>&nbsp;
        {option.text || option.value}
      </span>
    </Dropdown.Item>
  );
};

const MultiSelect = ({
  text = 'Select Options',
  className = '',
  menuClasses = '',
  onChange = () => {},
  options = [],
  withSelectAllOption = false,
}) => {
  const [currentSelections, setCurrentSelections] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);

  const handleSelectAll = () => {
    if (isAllSelected) {
      setCurrentSelections([]);
    } else {
      setCurrentSelections(options.map(elem => elem.value));
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
  }, [onChange, currentSelections, setIsAllSelected]);

  return (
    <Dropdown.Menu
      dropdownClasses={[className]}
      menuClasses={[menuClasses]}
      buttonContent={<span>{text}&nbsp;</span>}
      buttonClasses={['btn-outline-info']}
      closeOnSelect={false}
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
