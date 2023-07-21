import React from 'react';
import { Close } from '@mui/icons-material';

const Searchbar = ({ value, placeholder, onChange }) => (
  <div className='form-group'>
    <div className='input-group'>
      <input
        type='text'
        className='form-control'
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
      />
      <div className='input-group-append'>
        <span
          title='Clear Filter'
          className='input-group-text pointer'
          onClick={() => onChange('')}
        >
          <Close fontSize='small' />
        </span>
      </div>
    </div>
  </div>
);

export default Searchbar;
