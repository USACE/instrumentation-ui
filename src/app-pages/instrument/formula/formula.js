import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';
import Button from '../../../app-components/button';

import FormulaCard from './formulaCard';

export default connect(
  'doModalOpen',
  'doInstrumentFormulasSave',
  'selectInstrumentsIdByRoute',
  'selectInstrumentFormulasItems',
  'selectNonComputedTimeseriesItemsByRoute',
  'selectTimeseriesMeasurementsItemsObject',
  ({
    doModalOpen,
    doInstrumentFormulasSave,
    instrumentsIdByRoute,
    instrumentFormulasItems,
    nonComputedTimeseriesItemsByRoute: timeseries,
  }) => {
    const [formulaIsEditing, setIsFormulaEditing] = useState(false);

    const createNewFormula = () => {
      doInstrumentFormulasSave({
        formula_name: '',
        formula: '',
        instrument_id: instrumentsIdByRoute?.instrumentId,
      }, null, true, true);
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
            {instrumentFormulasItems.length ? (
              instrumentFormulasItems.map(f => (
                <FormulaCard
                  key={f?.id}
                  formulaItem={f}
                  isAnotherEditing={formulaIsEditing}
                  handleEditClick={(isEditing) => setIsFormulaEditing(isEditing)}
                  doInstrumentFormulasSave={doInstrumentFormulasSave}
                  doModalOpen={doModalOpen}
                />
              ))
            ) : (
              <i>No formulas for this instrument. To create one, click the button below.</i>
            )}
            <Button
              handleClick={() => createNewFormula()}
              className='d-block mt-2'
              variant='success'
              size='small'
              text='+ New Formula'
              isOutline
            />
          </div>
        </div>
      </div>
    );
  }
);
