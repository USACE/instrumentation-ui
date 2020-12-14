import React from "react";
import { connect } from "redux-bundler-react";

import Select from './select';

export default connect(
  "selectDomainsItemsByGroup",
  ({ value, onChange, domain, domainsItemsByGroup }) => {
    const options = domainsItemsByGroup[domain].map(item => (
      { value: item.id, text: item.value }
    ));

    return (
      <>
        {!options.length ? (
          <p>No Options...</p>
        ) : (
          <Select
            defaultOption={value}
            onChange={onChange}
            placeholderText='Select one...'
            options={options}
          />
        )}
      </>
    );
  }
);
