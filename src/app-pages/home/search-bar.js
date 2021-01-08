import React from 'react';

const Searchbar = ({ value, placeholder, onChange }) => {
  return (
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
            <i className='mdi mdi-close'></i>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Searchbar;
