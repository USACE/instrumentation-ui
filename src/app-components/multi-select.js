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
      <span className={optionIsSelected ? 'text-info' : ''}>
        <i className={`mdi ${icon}`}/>&nbsp;
        {option.text || option.value}
      </span>
    </Dropdown.Item>
  );
};

const MultiSelect = ({
  text = 'Select Options',
  className = '',
  onChange = () => {},
  options = [],
}) => {
  const [currentSelections, setCurrentSelections] = useState([]);

  useEffect(() => {
    if (onChange && typeof onChange === 'function') onChange(currentSelections);
  }, [onChange, currentSelections]);

  return (
    <Dropdown.Menu
      dropdownClasses={[className]}
      buttonContent={<span>{text}&nbsp;</span>}
      buttonClasses={['btn-outline-info']}
      closeOnSelect={false}
    >
      {options.map((option, i) => {
        const optionIsSelected = currentSelections.find(elem => elem === option.value);
        const handleClick = () => setCurrentSelections(reduceSelections(option.value, currentSelections));

        return generateOption(option, handleClick, optionIsSelected, i);
      })}
    </Dropdown.Menu>
  );
};

export default MultiSelect;
