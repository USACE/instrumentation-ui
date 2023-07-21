import React, { useEffect, useState } from 'react';

import usePrevious from '../../customHooks/usePrevious';

import './toggle-button.scss';

const ToggleButton = ({
  defaultState = true,
  handleChange = () => {},
}) => {
  const [isChecked, setIsChecked] = useState(defaultState);
  const previousCheck = usePrevious(isChecked);

  useEffect(() => {
    if (previousCheck !== isChecked) handleChange(isChecked);
  }, [isChecked, previousCheck, handleChange]);

  return (
    <label className='switch'>
      <input type='checkbox' checked={isChecked} onChange={() => setIsChecked(!isChecked)} />
      <span className='slider round' />
    </label>
  );
};

export default ToggleButton;
