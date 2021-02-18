import React from 'react';

import Dropdown from '../dropdown';

export const reduceSelections = (selection, currentSelections) => {
  const final = [...currentSelections];
  const idx = currentSelections.findIndex(elem => elem === selection);

  idx < 0 ? final.push(selection) : final.splice(idx, 1);

  return final;
};

export const generateOption = (option, handleClick, optionIsSelected, i) => {
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