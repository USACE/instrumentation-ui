import React, { forwardRef } from 'react';

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
}, ref) => (
  <div className='input-group'>
    <input
      ref={ref}
      style={{
        maxWidth: '400px',
        display: isHidden ? 'none' : 'inline-block',
      }}
      className='form-control'
      autoFocus
      placeholder='Filter List...'
    />
    <div className='input-group-append dropup'>
      <DropdownButton isHidden={isHidden} />
    </div>
  </div>
));
