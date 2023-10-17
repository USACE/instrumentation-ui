import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';
import { Autocomplete, TextField } from '@mui/material';

export default connect(
  'selectDomainsItemsByGroup',
  ({
    domainsItemsByGroup,
    value,
    onChange,
    domain,
  }) => {
    const [selectValue, setSelectValue] = useState();
    const options = domainsItemsByGroup[domain]?.map(item => (
      { value: item.id, label: item.value }
    )) || [];

    useEffect(() => {
      if (selectValue && domainsItemsByGroup[domain]?.find(el => el.value === selectValue)) {
        onChange(selectValue.value);
      }
    }, [selectValue])

    return (
      <>
        {!options || !options.length ? (
          <i className='d-block pl-3'>No Options...</i>
        ) : (
          <Autocomplete
            size='small'
            defaultValue={options.find(el => el.value === value)}
            isOptionEqualToValue={(opt, val) => opt.value === val.value}
            onChange={e => setSelectValue(e.target.innerText)}
            renderInput={(params) => <TextField {...params} placeholder='Select one...' onChange={e => setSelectValue(e.target.value)} />}
            options={options}
            fullWidth
          />
        )}
      </>
    );
  }
);
