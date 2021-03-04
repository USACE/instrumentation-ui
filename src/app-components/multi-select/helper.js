import React from 'react';

import Dropdown from '../dropdown';
import Icon from '../icon';

export const reduceSelections = (selection, currentSelections) => {
  const final = [...currentSelections];
  const idx = currentSelections.findIndex(elem => elem === selection);

  idx < 0 ? final.push(selection) : final.splice(idx, 1);

  return final;
};

export const generateOption = (option, handleClick, optionIsSelected, i) => {
  const icon = optionIsSelected ? 'check-box-outline' : 'checkbox-blank-outline';

  return (
    <Dropdown.Item key={i} onClick={(_e) => handleClick()}>
      <span className={optionIsSelected ? 'text-info' : 'text-dark'}>
        <Icon icon={icon} />&nbsp;
        {option.text || option.value}
      </span>
    </Dropdown.Item>
  );
};