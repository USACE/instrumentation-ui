import React from 'react';
import { connect } from 'redux-bundler-react';
import { Autocomplete, TextField } from '@mui/material';

export default connect(
  'selectDomainsItemsByGroup',
  ({
    domainsItemsByGroup,
    defaultValue,
    useLabelAsDefault = false,
    onChange,
    domain,
  }) => {
    const options = domainsItemsByGroup[domain]?.map(item => (
      { value: item.id, label: item.value }
    )) || [];

    return (
      <>
        {!options || !options.length ? (
          <i className='d-block pl-3'>No Options...</i>
        ) : (
          <Autocomplete
            size='small'
            defaultValue={options.find(el => el[useLabelAsDefault ? 'label' : 'value'] === defaultValue)}
            isOptionEqualToValue={(opt, val) => opt.value === val.value}
            onChange={(_e, value) => {
              const item = domainsItemsByGroup[domain]?.find(el => el.value === value?.label);
              onChange(item);
            }}
            renderInput={(params) => <TextField {...params} placeholder='Select one...' />}
            options={options}
            fullWidth
          />
        )}
      </>
    );
  }
);
