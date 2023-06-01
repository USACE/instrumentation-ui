import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const IntervalSelection = ({ defaultSelection = {}, onChange }) => {
  const {
    number: defaultNumber = 0,
    duration: defaultDuration = null,
  } = defaultSelection;
  const [number, setNumber] = useState(defaultNumber);
  const [duration, setDuration] = useState(defaultDuration);


  useEffect(() => {
    if (!number || !Number(number) || !duration?.value) {
      onChange(null);
      return;
    }
    
    const evalObj = {
      [duration?.value]: Number(number),
    };

    onChange(evalObj);
  }, [number, duration]);

  return (
    <div className='row no-gutters'>
      <div className='form-group col-3 pr-2'>
        <input
          type='text'
          className='form-control'
          value={number}
          onChange={e => {
            const regex = /^[0-9\b]+$/;
            if (e.target.value === '' || regex.test(e.target.value)) {
              setNumber(e.target.value);
            }
          }}
        />
      </div>
      <div className='form-group col-9'>
        <Select
          isClearable
          value={duration}
          placeholder='Select one...'
          options={[
            { label: 'minutes', value: 'minutes' },
            { label: 'hours', value: 'hours' },
            { label: 'days', value: 'days' },
            { label: 'weeks', value: 'weeks' },
            { label: 'months', value: 'months' },
            { label: 'years', value: 'years' },
          ]}
          onChange={val => setDuration(val)}
        />
      </div>
    </div>
  );
};

export default IntervalSelection;
