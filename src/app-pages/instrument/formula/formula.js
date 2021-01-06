import React, { useState, useRef } from 'react';
import { connect } from 'redux-bundler-react';

export default connect(
  'selectInstrumentsByRoute',
  'selectInstrumentTimeseriesItemsByRoute',
  'selectTimeseriesMeasurementsItemsObject',
  'doInstrumentsSave',
  ({
    instrumentsByRoute: instrument,
    instrumentTimeseriesItemsByRoute: timeseries,
    doInstrumentsSave,
  }) => {
    const [formula, setFormula] = useState(instrument.formula || '');
    const input = useRef(null);

    const insertParam = (param) => {
      const start = input.current.selectionStart;
      const end = input.current.selectionEnd;
      const txt = `${formula.slice(0, start)}${param}${formula.slice(
        end,
        formula.length
      )}`;
      setFormula(txt);
    };

    const handleSave = () => {
      instrument.formula = formula;
      doInstrumentsSave(instrument);
    };

    return (
      <div>
        <p>
          Use the formula editor to describe how this instrument should be
          visualized, you can choose a single data series, or alter the values
          using a combination of series and constants.
        </p>
        Available parameters
        <div className='row'>
          <div className='col-3'>
            <ul className='list-group'>
              {timeseries.map((ts, i) => (
                <li
                  key={i}
                  className='list-group-item list-group-item-action noselect'
                  onDoubleClick={() => insertParam(`[${ts.variable}]`)}
                >
                  {ts.slug}
                </li>
              ))}
            </ul>
          </div>
          <div className='col'>
            <textarea
              ref={input}
              className='form-control'
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              rows={6}
            />
            <div className='float-right mt-2'>
              <button
                onClick={() => {
                  setFormula(instrument.formula || '');
                }}
                className='btn btn-sm btn-secondary mr-1'
                title='Cancel'
              >
                Cancel
              </button>
              <button onClick={handleSave} className='btn btn-sm btn-success' title='Save Formula'>
                Save
              </button>
            </div>
            <small className='hidden text-danger'>Error parsing formula</small>
          </div>
        </div>
      </div>
    );
  }
);
