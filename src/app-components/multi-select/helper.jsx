import React from 'react';
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';

import Dropdown from '../dropdown';

export const reduceSelections = (selection, currentSelections) => {
  const final = [...currentSelections];
  const idx = currentSelections.findIndex(elem => elem === selection);

  idx < 0 ? final.push(selection) : final.splice(idx, 1);

  return final;
};

export const generateOption = (option, handleClick, optionIsSelected, i) => {
  const icon = optionIsSelected ? <CheckBox fontSize='inherit' /> : <CheckBoxOutlineBlank fontSize='inherit' />;

  return (
    <Dropdown.Item key={i} onClick={(_e) => handleClick()}>
      <span className={optionIsSelected ? 'text-info' : 'text-dark'}>
        {icon}&nbsp;
        {option.text || option.value}
      </span>
    </Dropdown.Item>
  );
};