import React, { forwardRef, useEffect, useState } from 'react';

import Button from '../button';

export const DropdownButton = ({
  isHidden = false,
  variant = 'info',
  handleClick = () => {},
  text,
}) => (
  <Button
    style={{
      display: isHidden ? 'none' : 'initial',
    }}
    isOutline
    variant={variant}
    className='dropdown-toggle'
    title='Toggle Dropdown'
    text={text}
    handleClick={handleClick}
  />
);

export const FilterInput = forwardRef(({
  isHidden = false,
  handleClose = () => {},
  onChange = () => {},
}, ref) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (onChange && typeof onChange === 'function') {
      onChange(inputValue);
    }
  }, [inputValue, onChange]);

  return (
    <div className='input-group' ref={ref} style={{ maxWidth: '400px' }}>
      <input
        autoFocus
        style={{
          display: isHidden ? 'none' : 'inline-block',
        }}
        className='form-control'
        placeholder='Filter List...'
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
      />
      <div className='input-group-append dropup'>
        <Button
          style={{
            display: isHidden ? 'none' : 'initial',
          }}
          variant='secondary'
          isOutline
          title='Clear Input'
          text='&#x2715;'
          handleClick={() => setInputValue('')}
        />
      </div>
      <div className='input-group-append dropup'>
        <DropdownButton isHidden={isHidden} handleClick={handleClose} />
      </div>
    </div>
  );
});