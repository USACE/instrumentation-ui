import React from "react";

export default () => {
  return (
    <div className="field">
      <label className="label is-medium">Search Instrumentation</label>
      <p className="control has-icons-left">
        <input className="input is-medium" type="text" placeholder="Search" />
        <span className="icon is-small is-left">
          <i className="mdi mdi-magnify"></i>
        </span>
      </p>
    </div>
  );
};
