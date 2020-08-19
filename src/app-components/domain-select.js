import React from "react";
import { connect } from "redux-bundler-react";

export default connect(
  "selectDomainsItemsByGroup",
  ({ value, onChange, domain, domainsItemsByGroup }) => {
    const options = domainsItemsByGroup[domain];
    if (!options) return <p>no options...</p>;
    return (
      <select className="form-control" value={value} onChange={onChange}>
        {value ? null : <option value="">Select one...</option>}
        {options.map((opt, i) => {
          return (
            <option key={i} value={opt.id}>
              {opt.value}
            </option>
          );
        })}
      </select>
    );
  }
);
