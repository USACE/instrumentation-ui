import React, { useState, useRef, useEffect } from 'react';

import Button from '../../../app-components/button';
import Card from '../../../app-components/card';
import DeleteFormulaModal from './deleteFormulaModal';
import Icon from '../../../app-components/icon';

const FormulaCard = ({
  formulaItem,
  isAnotherEditing,
  handleEditClick,
  doModalOpen,
  doInstrumentFormulasSave,
}) => {
  const {
    formula_name: defaultFormulaName,
    formula: defaultFormula,
    id,
    instrument_id,
    // parameter_id,
    // slug,
    // unit_id,
  } = formulaItem;

  const [formulaName, setFormulaName] = useState(defaultFormulaName || '');
  const [formula, setFormula] = useState(defaultFormula || '');
  const [isEditing, setIsEditing] = useState(false);
  const input = useRef(null);

  const handleSave = () => {
    doInstrumentFormulasSave({
      id,
      instrument_id,
      formula_name: formulaName,
      formula,
    }, () => setIsEditing(false), false, false);
  };

  useEffect(() => {
    if (!isEditing) {
      setFormula(defaultFormula);
      setFormulaName(defaultFormulaName);
      handleEditClick(null);
    }
    else {
      handleEditClick({ input, formula, setFormula });
    }
  }, [isEditing, formula, setFormula]);

  return (
    <Card className='mb-2'>
      <Card.Body>
        {isEditing ? (
          <>
            <input
              type='text'
              className='form-control mb-2'
              placeholder='Custom formula name...'
              value={formulaName}
              onChange={e => setFormulaName(e.target.value)}
            />
            <textarea
              ref={input}
              className='form-control'
              placeholder='Formula...'
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              rows={6}
            />
            <div className='text-right mt-2 mb-0'>
              <Button
                handleClick={() => setIsEditing(false)}
                className='mr-1'
                variant='secondary'
                size='small'
                title='Cancel'
                text='Cancel'
              />
              <Button
                handleClick={handleSave}
                variant='success'
                size='small'
                title='Save Formula'
                text='Save'
              />
            </div>
          </>
        ) : (
          <>
            <div className='btn-group float-right'>
              <Button
                isDisabled={isAnotherEditing}
                variant='info'
                size='small'
                isOutline
                icon={<Icon icon='pencil' />}
                title='Edit Formula'
                handleClick={() => setIsEditing(true)}
              />
              <Button
                isDisabled={isAnotherEditing}
                variant='danger'
                size='small'
                isOutline
                icon={<Icon icon='trash-can' />}
                title='Delete Formula'
                handleClick={() => doModalOpen(DeleteFormulaModal, { formulaItem })}
              />
            </div>
            <b>Formula Name: </b> {formulaName || <i className='text-secondary'>none</i>}
            <i className='d-block mt-3'>{formula}</i>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default FormulaCard;
