import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';
import { Autocomplete, TextField } from '@mui/material';

export default connect(
  'selectDomainsItemsByGroup',
  ({
    domainsItemsByGroup,
    defaultValue,
    onChange,
    domain,
  }) => {
    const [selectValue, setSelectValue] = useState();
    const options = domainsItemsByGroup[domain]?.map(item => (
      { value: item.id, label: item.value }
    )) || [];

    useEffect(() => {
      const item = domainsItemsByGroup[domain]?.find(el => el.value === selectValue);
      onChange(item);
    }, [selectValue]);

    return (
      <>
        {!options || !options.length ? (
          <i className='d-block pl-3'>No Options...</i>
        ) : (
          <Autocomplete
            size='small'
            defaultValue={options.find(el => el.value === defaultValue)}
            isOptionEqualToValue={(opt, val) => opt.value === val.value}
            onChange={(_e, value) => setSelectValue(value?.label)}
            renderInput={(params) => <TextField {...params} placeholder='Select one...' />}
            options={options}
            fullWidth
          />
        )}
      </>
    );
  }
);
