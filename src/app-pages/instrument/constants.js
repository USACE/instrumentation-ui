import React from "react";

export default () => {
  return (
    <div>
      <p>
        <small>
          Constants are values that you would like to make available to the
          formula editor, constants can be a single value, or a set of values
          valid during distinct time spans.
        </small>
      </p>
      <div className="row">
        <div className="col-3">
          <ul className="list-group">
            <li className="list-group-item">Add New</li>
          </ul>
        </div>
        <div className="col">edit the constant here</div>
      </div>
    </div>
  );
};
