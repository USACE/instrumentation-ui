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

  /** Execute callback function when input value changes */
  useEffect(() => {
    if (onChange && typeof onChange === 'function') {
      onChange(inputValue);
    }
  }, [inputValue, onChange]);

  /** Clear input when dropdown is closed */
  useEffect(() => {
    if (isHidden) {
      setInputValue('');
    }
  }, [isHidden]);

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