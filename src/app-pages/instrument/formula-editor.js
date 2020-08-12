import React, { useState, useRef } from "react";

export default () => {
  const [formula, setFormula] = useState("");
  const input = useRef(null);

  const insertParam = (param) => {
    console.log(input.current.selectionStart, param);
    const start = input.current.selectionStart;
    const end = input.current.selectionEnd;
    const txt = `${formula.slice(0, start)}${param}${formula.slice(
      end,
      formula.length
    )}`;
    setFormula(txt);
  };

  return (
    <div>
      <p>
        <small>
          Use the formula editor to describe how this instrument should be
          visualized, you can choose a single data series, or alter the values
          using a combination of series and constants.
        </small>
      </p>
      Available parameters
      <div className="row">
        <div className="col-3">
          <ul className="list-group">
            <li
              className="list-group-item list-group-item-action"
              onDoubleClick={() => {
                insertParam("[$zref]");
              }}
            >
              $zref
            </li>
            <li
              className="list-group-item list-group-item-action"
              onDoubleClick={() => {
                insertParam("[$piezo]");
              }}
            >
              $piezo
            </li>
            <li
              className="list-group-item list-group-item-action"
              onDoubleClick={() => {
                insertParam("[$series.val]");
              }}
            >
              $series.val
            </li>
          </ul>
        </div>
        <div className="col">
          <textarea
            ref={input}
            className="form-control"
            value={formula}
            onChange={(e) => {
              setFormula(e.target.value);
            }}
            rows={6}
          />
          <small className="text-danger">Error parsing formula</small>
        </div>
      </div>
    </div>
  );
};
