import React from 'react';
import { connect } from 'redux-bundler-react';
import Select from 'react-select';

export default connect(
  'selectDomainsItemsByGroup',
  ({ value, onChange, domain, domainsItemsByGroup }) => {
    const options = domainsItemsByGroup[domain].map(item => (
      { value: item.id, label: item.value }
    ));

    const initValue = domainsItemsByGroup[domain].find(el => el.id === value);

    return (
      <>
        {!options.length ? (
          <p>No Options...</p>
        ) : (
          <Select
            isSearchable
            defaultValue={initValue ? { value: initValue.id, label: initValue.value } : undefined}
            onChange={val => onChange(val.value)}
            placeholder='Select one...'
            options={options}
          />
        )}
      </>
    );
  }
);
