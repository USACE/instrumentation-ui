import React from 'react';
import { connect } from 'redux-bundler-react';
import Select from 'react-select';

export default connect(
  'selectDomainsItemsByGroup',
  ({ value, onChange, domain, domainsItemsByGroup }) => {
    const options = domainsItemsByGroup[domain]?.map(item => (
      { value: item.id, label: item.value }
    ));

    const initValue = domainsItemsByGroup[domain]?.find(el => el.id === value);

    return (
      <>
        {!options || !options.length ? (
          <i className='d-block pl-3'>No Options...</i>
        ) : (
          <Select
            isSearchable
            defaultValue={initValue ? { value: initValue.id, label: initValue.value } : undefined}
            onChange={val => onChange(val.value)}
            placeholder='Select one...'
            options={options}
            styles={{
              menuList: base => ({
                ...base,
                maxHeight: '200px',
              })
            }}
          />
        )}
      </>
    );
  }
);
